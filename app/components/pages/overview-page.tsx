'use client';

import { useState } from 'react';
import type { AffiliateOverview } from '../../lib/types';
import { formatMoney } from '../../lib/format';
import { Icon, type IconName } from '../icons';

export function OverviewPage({ overview }: { overview: AffiliateOverview }) {
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    await navigator.clipboard.writeText(overview.referral_link);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  const metrics: Array<{ label: string; value: string; icon: IconName; tone: string }> = [
    { label: 'Saldo disponível', value: formatMoney(overview.balance_cents, overview.currency), icon: 'wallet', tone: 'rose' },
    { label: 'Comissões em retenção', value: formatMoney(overview.pending_cents, overview.currency), icon: 'clock', tone: 'amber' },
    { label: 'Total recebido', value: formatMoney(overview.paid_out_cents, overview.currency), icon: 'check', tone: 'graphite' },
    { label: 'Indicações activas', value: String(overview.active_referrals_count), icon: 'users', tone: 'plum' },
  ];
  const activeReferralPercent = overview.referrals_count
    ? Math.min(100, overview.active_referrals_count / overview.referrals_count * 100)
    : 0;

  return (
    <section className="feature-page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">O SEU DESEMPENHO</span>
          <h1>Olá, {overview.profile.full_name.split(' ')[0]}</h1>
          <p>Acompanhe os resultados e partilhe o seu convite.</p>
        </div>
        <span className="account-chip">
          <span className="status-dot" />
          Conta {overview.profile.status === 'active' ? 'activa' : overview.profile.status}
        </span>
      </div>

      <article className="referral-banner">
        <div className="banner-copy">
          <span className="eyebrow">O SEU LINK DE CONVITE</span>
          <h2>O próximo cliente pode começar aqui.</h2>
          <p>Partilhe o seu link pessoal e acompanhe cada indicação no seu painel.</p>
          <div className="referral-link">
            <span>{overview.referral_link}</span>
            <button type="button" className="button button-light" onClick={() => void copyLink()}>
              {copied ? <><Icon name="check" size={15} /> Copiado!</> : <><Icon name="copy" size={15} /> Copiar link</>}
            </button>
          </div>
        </div>
        <div className="banner-art" aria-hidden="true">
          <div className="art-ring ring-one" />
          <div className="art-ring ring-two" />
          <span className="art-spark spark-one">✦</span>
          <span className="art-spark spark-two">✧</span>
          <span className="art-mark"><img alt="" src="/brand/rewards-mark.png" /></span>
        </div>
      </article>

      <div className="section-title">
        <div>
          <h2>Resumo da actividade</h2>
          <p>Os seus números actualizados</p>
        </div>
        <span className="referral-code">Código <strong>{overview.profile.code}</strong></span>
      </div>

      <div className="metric-grid">
        {metrics.map((metric) => (
          <article className="metric-card" key={metric.label}>
            <div className={`metric-icon ${metric.tone}`} aria-hidden="true"><Icon name={metric.icon} size={17} /></div>
            <span className="metric-label">{metric.label}</span>
            <strong>{metric.value}</strong>
          </article>
        ))}
      </div>

      <div className="info-grid">
        <article className="info-card">
          <div className="info-card-heading">
            <span className="info-icon"><Icon name="users" size={17} /></span>
            <div><h3>Indicações</h3><p>O impacto das suas partilhas</p></div>
          </div>
          <div className="referral-count">
            <strong>{overview.referrals_count}</strong><span>indicações no total</span>
          </div>
          <div className="progress-track"><span style={{ width: `${activeReferralPercent}%` }} /></div>
          <div className="progress-caption"><span>Activas</span><strong>{overview.active_referrals_count}</strong></div>
        </article>

        <article className="info-card earning-card">
          <div className="info-card-heading">
            <span className="info-icon"><Icon name="clock" size={17} /></span>
            <div><h3>Próxima disponibilidade</h3><p>Sobre comissões em retenção</p></div>
          </div>
          <strong className="earning-value">{formatMoney(overview.pending_cents, overview.currency)}</strong>
          <p className="earning-note">As comissões ficam disponíveis após o período de retenção de {overview.hold_days} dias.</p>
          <div className="earning-divider" />
          <div className="earning-summary"><span>Comissões registadas</span><strong>{overview.commissions_count}</strong></div>
        </article>
      </div>
    </section>
  );
}
