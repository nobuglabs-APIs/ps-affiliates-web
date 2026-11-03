'use client';

import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { AuthScreen, type AuthMode, type Credentials } from './components/auth-screen';
import { BrandSplash } from './components/brand-splash';
import { DashboardShell, type DashboardView } from './components/dashboard-shell';
import { get, post, request, SessionChallengeRequiredError } from './lib/api';
import { clearTokens, hasTokens, readRefreshToken, saveTokens } from './lib/session';
import { formatMoney } from './lib/format';
import type { AffiliateOverview, AuthResponse, Challenge, Commission, Payout, Page, TwoFactorStatus } from './lib/types';

const AdminPayoutsPage = lazy(() => import('./components/pages/admin-payouts-page').then((module) => ({ default: module.AdminPayoutsPage })));
const AccountPage = lazy(() => import('./components/pages/account-page').then((module) => ({ default: module.AccountPage })));
const CommissionsPage = lazy(() => import('./components/pages/commissions-page').then((module) => ({ default: module.CommissionsPage })));
const OverviewPage = lazy(() => import('./components/pages/overview-page').then((module) => ({ default: module.OverviewPage })));
const PayoutsPage = lazy(() => import('./components/pages/payouts-page').then((module) => ({ default: module.PayoutsPage })));
const SecurityPage = lazy(() => import('./components/pages/security-page').then((module) => ({ default: module.SecurityPage })));

export default function AffiliatesPage() {
  const [overview, setOverview] = useState<AffiliateOverview | null>(null);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [adminPayouts, setAdminPayouts] = useState<Payout[]>([]);
  const [twoFactor, setTwoFactor] = useState<TwoFactorStatus | null>(null);
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [challengePurpose, setChallengePurpose] = useState<'login' | 'enable' | 'disable'>('login');
  const [view, setView] = useState<DashboardView>('overview');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [loadedViews, setLoadedViews] = useState<Partial<Record<DashboardView, boolean>>>({});
  const [sectionLoading, setSectionLoading] = useState(false);
  const [sectionRetry, setSectionRetry] = useState(0);

  const loadData = useCallback(async () => {
    const summary = await get<AffiliateOverview>('/affiliate');
    setOverview(summary);
    setLoadedViews({});
    setCommissions([]);
    setPayouts([]);
    setAdminPayouts([]);
    setTwoFactor(null);
  }, []);

  useEffect(() => {
    if (!authenticated || !overview || view === 'overview' || loadedViews[view]) return;
    let active = true;
    setSectionLoading(true);
    setError('');

    const loadSection = async () => {
      try {
        if (view === 'commissions') {
          const page = await get<Page<Commission>>('/affiliate/commissions?per_page=50');
          if (active) setCommissions(page.items);
        } else if (view === 'payouts') {
          const page = await get<Page<Payout>>('/affiliate/payouts?per_page=50');
          if (active) setPayouts(page.items);
        } else if (view === 'security') {
          const status = await get<TwoFactorStatus>('/auth/me/two-factor');
          if (active) setTwoFactor(status);
        } else if (view === 'admin' && overview.profile.is_admin) {
          const [requested, processing] = await Promise.all([
            get<Page<Payout>>('/admin/payouts?status=requested&per_page=50'),
            get<Page<Payout>>('/admin/payouts?status=processing&per_page=50'),
          ]);
          if (active) setAdminPayouts([...requested.items, ...processing.items]);
        }
        if (active) setLoadedViews((current) => ({ ...current, [view]: true }));
      } catch (reason) {
        if (active && reason instanceof SessionChallengeRequiredError) {
          setAuthenticated(false);
          setChallenge(reason.challenge);
          setChallengePurpose('login');
          setMessage(`Código enviado por ${reason.challenge.channel === 'email' ? 'e-mail' : 'SMS'}.`);
        } else if (active) {
          setError(reason instanceof Error ? reason.message : 'Não foi possível carregar esta área.');
        }
      } finally {
        if (active) setSectionLoading(false);
      }
    };

    void loadSection();
    return () => { active = false; };
  }, [authenticated, loadedViews, overview, sectionRetry, view]);

  useEffect(() => {
    if (!hasTokens()) return;
    setBusy(true);
    void loadData()
      .then(() => setAuthenticated(true))
      .catch((reason: unknown) => {
        if (reason instanceof SessionChallengeRequiredError) {
          setChallenge(reason.challenge);
          setChallengePurpose('login');
          setMessage(`Código enviado por ${reason.challenge.channel === 'email' ? 'e-mail' : 'SMS'}.`);
        } else {
          clearTokens();
          setError(reason instanceof Error ? reason.message : 'Sessão inválida.');
        }
      })
      .finally(() => setBusy(false));
  }, [loadData]);

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get('token');
    if (!token) return;
    setAuthMode('verify');
    void post('/auth/email/verify', { token }, false)
      .then(() => {
        setAuthMode('login');
        setMessage('E-mail verificado. Já pode iniciar sessão.');
        window.history.replaceState({}, '', window.location.pathname);
      })
      .catch((reason: unknown) => setError(reason instanceof Error ? reason.message : 'Token inválido.'));
  }, []);

  const run = async (action: () => Promise<void>) => {
    setError('');
    setMessage('');
    setBusy(true);
    try {
      await action();
    } catch (reason) {
      if (reason instanceof SessionChallengeRequiredError) {
        setAuthenticated(false);
        setChallenge(reason.challenge);
        setChallengePurpose('login');
        setMessage(`Código enviado por ${reason.challenge.channel === 'email' ? 'e-mail' : 'SMS'}.`);
      } else {
        setError(reason instanceof Error ? reason.message : 'Não foi possível concluir o pedido.');
      }
    } finally {
      setBusy(false);
    }
  };

  const authenticate = (mode: AuthMode, credentials: Credentials) => run(async () => {
    if (mode === 'verify') {
      await post('/auth/email/verify', { token: credentials.token }, false);
      setAuthMode('login');
      setMessage('E-mail verificado. Já pode iniciar sessão.');
      return;
    }
    if (mode === 'register') {
      await post<AuthResponse>('/auth/register', {
        full_name: credentials.name,
        email: credentials.email,
        password: credentials.password,
      }, false);
      setAuthMode('verify');
      setMessage('Conta criada. Verifique o seu e-mail para confirmar a conta antes de iniciar sessão.');
      return;
    }
    const result = await post<AuthResponse | Challenge>('/auth/login', {
      email: credentials.email,
      password: credentials.password,
    }, false);
    if ('challenge_id' in result) {
      setChallenge(result);
      setChallengePurpose('login');
      setMessage(`Código enviado por ${result.channel === 'email' ? 'e-mail' : 'SMS'}.`);
      return;
    }
    saveTokens(result.tokens);
    await loadData();
    setAuthenticated(true);
  });

  const resendVerification = (email: string) => run(async () => {
    await post('/auth/email/resend', { email }, false);
    setMessage('Se a conta ainda precisar de verificação, será enviado um novo e-mail.');
  });

  const verifyChallenge = (code: string) => run(async () => {
    if (!challenge) return;
    if (challengePurpose === 'enable') {
      await post('/auth/me/two-factor/enable', { challenge_id: challenge.challenge_id, code });
      setChallenge(null);
      setTwoFactor(await get<TwoFactorStatus>('/auth/me/two-factor'));
      setMessage('Autenticação de dois fatores ativada.');
      return;
    }
    if (challengePurpose === 'disable') {
      await post('/auth/me/two-factor/disable', { challenge_id: challenge.challenge_id, code });
      setChallenge(null);
      setTwoFactor(await get<TwoFactorStatus>('/auth/me/two-factor'));
      setMessage('Autenticação de dois fatores desativada.');
      return;
    }
    const result = await post<AuthResponse>('/auth/login/verify', {
      challenge_id: challenge.challenge_id,
      code,
    }, false);
    saveTokens(result.tokens);
    setChallenge(null);
    await loadData();
    setAuthenticated(true);
  });

  const requestPayout = (amount: string, method: string, destination: Payout['destination']) => run(async () => {
    if (!overview) return;
    const amountCents = Math.round(Number(amount) * 100);
    if (!Number.isSafeInteger(amountCents) || amountCents < overview.minimum_withdrawal_cents) {
      throw new Error(`O levantamento mínimo é ${formatMoney(overview.minimum_withdrawal_cents, overview.currency)}.`);
    }
    if (amountCents > overview.balance_cents) {
      throw new Error('O valor solicitado não pode exceder o saldo disponível.');
    }
    await post('/affiliate/payouts', { amount_cents: amountCents, method, destination });
    setMessage('Pedido de levantamento registado.');
    const [summary, page] = await Promise.all([
      get<AffiliateOverview>('/affiliate'),
      get<Page<Payout>>('/affiliate/payouts?per_page=50'),
    ]);
    setOverview(summary);
    setPayouts(page.items);
    setLoadedViews((current) => ({ ...current, payouts: true }));
  });

  const startTwoFactorSetup = () => run(async () => {
    const next = await post<Challenge>('/auth/me/two-factor/setup');
    setChallenge(next);
    setChallengePurpose('enable');
    setMessage(`Código enviado por ${next.channel === 'email' ? 'e-mail' : 'SMS'}.`);
  });

  const startTwoFactorDisable = () => run(async () => {
    const next = await post<Challenge>('/auth/me/two-factor/disable/request');
    setChallenge(next);
    setChallengePurpose('disable');
    setMessage(`Código enviado por ${next.channel === 'email' ? 'e-mail' : 'SMS'} para confirmar a desativação.`);
  });

  const updatePayout = (payout: Payout, action: 'approve' | 'paid' | 'reject', details?: { providerRef?: string; note?: string }) => run(async () => {
    if (action === 'approve') {
      await post(`/admin/payouts/${payout.id}/approve`);
    } else if (action === 'paid') {
      await post(`/admin/payouts/${payout.id}/mark-paid`, {
        provider_ref: details?.providerRef || null,
        note: details?.note || null,
      });
    } else {
      await post(`/admin/payouts/${payout.id}/reject`, { reason: details?.note || null });
    }
    const [requested, processing] = await Promise.all([
      get<Page<Payout>>('/admin/payouts?status=requested&per_page=50'),
      get<Page<Payout>>('/admin/payouts?status=processing&per_page=50'),
    ]);
    setAdminPayouts([...requested.items, ...processing.items]);
    setLoadedViews((current) => ({ ...current, admin: true }));
    setMessage(action === 'approve' ? 'Levantamento aprovado e enviado para processamento.' : action === 'paid' ? 'Levantamento marcado como pago.' : 'Levantamento rejeitado.');
  });

  const signOut = () => run(async () => {
    const refreshToken = readRefreshToken();
    try {
      if (refreshToken) await request('/auth/logout', { method: 'POST', body: { refresh_token: refreshToken }, retry: false });
    } finally {
      clearTokens();
      setAuthenticated(false);
      setOverview(null);
      setChallenge(null);
    }
  });

  if (!authenticated && busy && hasTokens()) {
    return <BrandSplash />;
  }

  if (!authenticated || challenge) {
    return (
      <AuthScreen
        mode={authMode}
        challenge={challenge}
        busy={busy}
        error={error}
        message={message}
        onModeChange={setAuthMode}
        onAuthenticate={authenticate}
        onResendVerification={resendVerification}
        onVerifyChallenge={verifyChallenge}
        onCancelChallenge={() => setChallenge(null)}
      />
    );
  }

  return (
    <DashboardShell
      userName={overview?.profile.full_name ?? ''}
      userAvatarUrl={overview?.profile.avatar_url ?? null}
      activeView={view}
      isAdmin={Boolean(overview?.profile.is_admin)}
      busy={busy}
      error={error}
      message={message}
      onViewChange={setView}
      onSignOut={() => void signOut()}
    >
      {view === 'overview' && overview && <OverviewPage overview={overview} />}
      {view !== 'overview' && sectionLoading && <div className="section-loading" role="status">A carregar esta área…</div>}
      {view !== 'overview' && !sectionLoading && !loadedViews[view] && view !== 'account' && error && <button className="button button-outline section-retry" onClick={() => setSectionRetry((value) => value + 1)} type="button">Tentar carregar novamente</button>}
      <Suspense fallback={<div className="section-loading" role="status">A preparar esta área…</div>}>
      {view === 'commissions' && loadedViews.commissions && <CommissionsPage commissions={commissions} />}
      {view === 'payouts' && loadedViews.payouts && overview && <PayoutsPage overview={overview} payouts={payouts} busy={busy} onRequestPayout={requestPayout} />}
      {view === 'account' && overview && <AccountPage overview={overview} onUpdated={setOverview} />}
      {view === 'security' && loadedViews.security && <SecurityPage status={twoFactor} onSetup={() => void startTwoFactorSetup()} onDisable={() => void startTwoFactorDisable()} />}
      {view === 'admin' && loadedViews.admin && overview?.profile.is_admin && (
        <AdminPayoutsPage payouts={adminPayouts} busy={busy} onUpdate={updatePayout} />
      )}
      </Suspense>
    </DashboardShell>
  );
}
