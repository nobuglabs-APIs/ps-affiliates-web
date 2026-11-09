'use client';

import { FormEvent, useState } from 'react';
import type { Challenge } from '../lib/types';
import { BrandAttribution } from './brand-attribution';
import { Icon, type IconName } from './icons';
import { SocialLogin } from './social-login';

export type AuthMode = 'login' | 'register' | 'verify';
export type Credentials = { name: string; email: string; password: string; token: string };

type AuthScreenProps = {
  mode: AuthMode;
  challenge: Challenge | null;
  busy: boolean;
  error: string;
  message: string;
  onModeChange: (mode: AuthMode) => void;
  onAuthenticate: (mode: AuthMode, credentials: Credentials) => void;
  onSocialAuthenticate: (provider: 'google' | 'facebook', token: string) => void;
  onResendVerification: (email: string) => void;
  onVerifyChallenge: (code: string) => void;
  onCancelChallenge: () => void;
};

const benefits: Array<{ icon: IconName; title: string; description: string }> = [
  { icon: 'gift', title: 'Recompensas que se acumulam', description: 'Cada indicação convertida soma comissões para a sua conta.' },
  { icon: 'wallet', title: 'Levantamentos descomplicados', description: 'Receba por Multicaixa Express, Unitel Money ou transferência.' },
  { icon: 'trend', title: 'Progresso sempre visível', description: 'Acompanhe indicações, ganhos e retenções em tempo real.' },
];

export function AuthScreen({
  mode,
  challenge,
  busy,
  error,
  message,
  onModeChange,
  onAuthenticate,
  onSocialAuthenticate,
  onResendVerification,
  onVerifyChallenge,
  onCancelChallenge,
}: AuthScreenProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [code, setCode] = useState('');
  const [socialError, setSocialError] = useState('');

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (challenge) {
      onVerifyChallenge(code);
      return;
    }
    onAuthenticate(mode, { name, email, password, token });
  };

  const eyebrow = challenge
    ? 'VERIFICAÇÃO SEGURA'
    : mode === 'register'
      ? 'JUNTE-SE AO PROGRAMA'
      : mode === 'verify'
        ? 'CONFIRME A SUA CONTA'
        : 'BEM-VINDO DE VOLTA';
  const title = challenge
    ? 'Confirme a sua identidade'
    : mode === 'register'
      ? 'Crie a sua conta'
      : mode === 'verify'
        ? 'Verifique o seu e-mail'
        : 'Entre na sua conta';
  const description = challenge
    ? `Introduza o código enviado por ${challenge.channel === 'email' ? 'e-mail' : 'SMS'} para continuar.`
    : mode === 'register'
      ? 'Comece hoje a construir uma nova fonte de rendimento.'
      : mode === 'verify'
        ? 'Abra o link recebido por e-mail para confirmar a conta. Se não chegar, pode pedir outro.'
        : 'Aceda ao seu painel de afiliado e acompanhe o seu progresso.';

  return (
    <main className="auth-page">
      <aside className="auth-brand" aria-label="Nobug Rewards">
        <a className="brand-lockup" href="/" aria-label="Nobug Rewards, início">
          <img alt="" className="brand-mark" decoding="async" src="/brand/rewards-mark.png" />
          <span className="brand-wordmark">Nobug <b>Rewards</b></span>
        </a>
        <div className="auth-brand-copy">
          <span className="eyebrow">RECOMPENSAS E ECOSSISTEMA DE PARCEIROS</span>
          <h1>Transforme as suas recomendações em recompensas.</h1>
          <p>Partilhe o seu link, acompanhe as comissões e faça a gestão dos seus levantamentos num só lugar.</p>
          <ul className="auth-benefits">
            {benefits.map((benefit) => (
              <li key={benefit.title}>
                <span className="auth-benefit-icon"><Icon name={benefit.icon} size={17} /></span>
                <span>
                  <strong>{benefit.title}</strong>
                  <small>{benefit.description}</small>
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="auth-brand-foot">
          <span className="brand-dot" /> A sua plataforma de parceiros
        </div>
      </aside>

      <section className="auth-main">
        <div className="auth-card">
          <div className="auth-heading">
            <img alt="Nobug Rewards" className="mobile-brand-mark" decoding="async" src="/brand/rewards-mark.png" />
            <span className="eyebrow">{eyebrow}</span>
            <h2>{title}</h2>
            <p>{description}</p>
          </div>

          <form className="auth-form" onSubmit={submit}>
            {challenge ? (
              <>
                <label htmlFor="challenge-code">Código de segurança</label>
                <input
                  id="challenge-code"
                  required
                  value={code}
                  onChange={(event) => setCode(event.target.value)}
                  placeholder="000000"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                />
                <button className="button button-primary button-wide" disabled={busy}>
                  {busy ? 'A confirmar…' : 'Confirmar código'}
                </button>
                <button type="button" className="text-button" onClick={onCancelChallenge}>
                  Voltar ao início de sessão
                </button>
              </>
            ) : (
              <>
                {mode === 'register' && (
                  <>
                    <label htmlFor="full-name">Nome completo</label>
                    <input id="full-name" required autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} placeholder="O seu nome" />
                  </>
                )}
                <label htmlFor="email">E-mail</label>
                <input id="email" required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="nome@exemplo.com" />
                {mode !== 'verify' && (
                  <>
                    <label htmlFor="password">Palavra-passe</label>
                    <input
                      id="password"
                      required
                      minLength={mode === 'register' ? 10 : 1}
                      type="password"
                      autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Introduza a sua palavra-passe"
                    />
                  </>
                )}
                {mode === 'verify' && (
                  <>
                    <label htmlFor="verification-token">Token de verificação</label>
                    <input id="verification-token" required value={token} onChange={(event) => setToken(event.target.value)} placeholder="Cole o token do link recebido por e-mail" />
                    <button type="button" className="text-button" disabled={busy || !email.trim()} onClick={() => onResendVerification(email)}>
                      Reenviar e-mail de verificação
                    </button>
                  </>
                )}
                <button className="button button-primary button-wide" disabled={busy}>
                  {busy ? 'A processar…' : mode === 'login' ? 'Entrar na conta' : mode === 'register' ? 'Criar conta de afiliado' : 'Verificar e-mail'}
                </button>
                {mode === 'login' && (
                  <button type="button" className="text-button" onClick={() => onResendVerification(email)}>
                    Reenviar e-mail de verificação
                  </button>
                )}
                {mode !== 'verify' && (
                  <button type="button" className="text-button" onClick={() => onModeChange(mode === 'login' ? 'register' : 'login')}>
                    {mode === 'login' ? 'Ainda não tem conta? Criar conta' : 'Já tem conta? Iniciar sessão'}
                  </button>
                )}
                {mode === 'login' && (
                  <button type="button" className="text-button secondary-link" onClick={() => onModeChange('verify')}>
                    Tenho um código de verificação
                  </button>
                )}
              </>
            )}
          </form>

          {!challenge && mode === 'login' && (
            <SocialLogin
              disabled={busy}
              onError={setSocialError}
              onFacebookToken={(value) => onSocialAuthenticate('facebook', value)}
              onGoogleToken={(value) => onSocialAuthenticate('google', value)}
            />
          )}

          {error && <p className="notice notice-error" role="alert">{error}</p>}
          {socialError && <p className="notice notice-error" role="alert">{socialError}</p>}
          {message && <p className="notice notice-success" role="status">{message}</p>}
          <div className="auth-trust"><Icon name="shield" size={14} /><span>Ambiente seguro e dados protegidos</span></div>
          <p className="auth-privacy">Ao continuar, concorda com os termos e a política de privacidade da Nobug Rewards.</p>
          <BrandAttribution />
        </div>
      </section>
    </main>
  );
}
