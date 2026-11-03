import type { ReactNode } from 'react';
import { BrandAttribution } from './brand-attribution';
import { mediaUrl } from '../lib/api';

export type DashboardView = 'overview' | 'commissions' | 'payouts' | 'account' | 'security' | 'admin';

const navigation: { id: DashboardView; label: string; icon: string }[] = [
  { id: 'overview', label: 'Visão geral', icon: '⌂' },
  { id: 'commissions', label: 'Comissões', icon: '↗' },
  { id: 'payouts', label: 'Levantamentos', icon: '◇' },
  { id: 'account', label: 'A minha conta', icon: '◎' },
  { id: 'security', label: 'Segurança', icon: '⌑' },
];

type DashboardShellProps = {
  userName: string;
  userAvatarUrl: string | null;
  activeView: DashboardView;
  isAdmin: boolean;
  busy: boolean;
  error: string;
  message: string;
  onViewChange: (view: DashboardView) => void;
  onSignOut: () => void;
  children: ReactNode;
};

export function DashboardShell({
  userName,
  userAvatarUrl,
  activeView,
  isAdmin,
  busy,
  error,
  message,
  onViewChange,
  onSignOut,
  children,
}: DashboardShellProps) {
  const links = isAdmin ? [...navigation, { id: 'admin' as const, label: 'Administração', icon: '⚙' }] : navigation;

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand-lockup sidebar-brand" href="/" aria-label="PS Affiliates">
          <img alt="" className="brand-mark brand-mark-image" decoding="async" src="/brand/affiliates.webp" /><span>Affiliates</span>
        </a>
        <div className="sidebar-section-label">ESPAÇO DE TRABALHO</div>
        <nav className="sidebar-nav" aria-label="Navegação principal">
          {links.map(({ id, label, icon }) => (
            <button type="button" key={id} className={`nav-link ${activeView === id ? 'selected' : ''}`} onClick={() => onViewChange(id)} aria-current={activeView === id ? 'page' : undefined}>
              <span className="nav-icon" aria-hidden="true">{icon}</span><span>{label}</span>
              {id === 'admin' && <span className="nav-badge">ADMIN</span>}
            </button>
          ))}
        </nav>
        <div className="sidebar-help">
          <span className="help-icon">?</span>
          <strong>Precisa de ajuda?</strong>
          <p>Estamos aqui para apoiar o seu crescimento.</p>
          <span className="support-label">Consulte os canais oficiais de suporte.</span>
        </div>
        <div className="sidebar-footer">PS-Mobile <span>•</span> Parceiros</div>
      </aside>

      <div className="workspace">
        <header className="topbar">
          <div className="mobile-brand-lockup"><img alt="" className="brand-mark brand-mark-image" decoding="async" src="/brand/affiliates.webp" /><span>Affiliates</span></div>
          <div className="topbar-spacer" />
          <span className="topbar-tag"><span className="brand-dot" /> Programa de afiliados</span>
          <div className="topbar-divider" />
          <div className="profile-summary"><span className="avatar">{userAvatarUrl ? <img alt="" src={mediaUrl(userAvatarUrl) || undefined} /> : userName.slice(0, 1).toUpperCase() || 'A'}</span><span className="profile-name">{userName}</span></div>
          <button type="button" className="signout-button" onClick={onSignOut} aria-label="Terminar sessão" title="Terminar sessão">↗</button>
        </header>
        <nav className="mobile-nav" aria-label="Navegação principal">
          {links.map(({ id, label, icon }) => (
            <button
              type="button"
              key={id}
              className={activeView === id ? 'selected' : ''}
              onClick={() => onViewChange(id)}
              aria-current={activeView === id ? 'page' : undefined}
            >
              <span aria-hidden="true">{icon}</span>
              {label}
            </button>
          ))}
        </nav>
        <main className="main-content">
          {error && <p className="notice notice-error" role="alert">{error}</p>}
          {message && <p className="notice notice-success" role="status">{message}</p>}
          {busy && <div className="loading-line" role="status"><span /> A actualizar os seus dados…</div>}
          {children}
          <footer className="page-footer"><span>Feito para crescer consigo</span><BrandAttribution /></footer>
        </main>
      </div>
    </div>
  );
}
