import { useEffect, useState, type ReactNode } from 'react';
import { BrandAttribution } from './brand-attribution';
import { Icon, type IconName } from './icons';
import { mediaUrl } from '../lib/api';

export type DashboardView = 'overview' | 'commissions' | 'payouts' | 'notifications' | 'account' | 'security';

const navigation: { id: DashboardView; label: string; icon: IconName }[] = [
  { id: 'overview', label: 'Visão geral', icon: 'home' },
  { id: 'commissions', label: 'Comissões', icon: 'trend' },
  { id: 'payouts', label: 'Levantamentos', icon: 'wallet' },
  { id: 'notifications', label: 'Notificações', icon: 'bell' },
  { id: 'account', label: 'A minha conta', icon: 'user' },
  { id: 'security', label: 'Segurança', icon: 'shield' },
];

const mobilePrimaryViews: DashboardView[] = ['overview', 'commissions', 'payouts', 'notifications'];

type DashboardShellProps = {
  userName: string;
  userAvatarUrl: string | null;
  activeView: DashboardView;
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
  busy,
  error,
  message,
  onViewChange,
  onSignOut,
  children,
}: DashboardShellProps) {
  const [moreOpen, setMoreOpen] = useState(false);
  const mobilePrimaryNavigation = navigation.filter(({ id }) => mobilePrimaryViews.includes(id));
  const mobileMoreNavigation = navigation.filter(({ id }) => !mobilePrimaryViews.includes(id));

  useEffect(() => {
    if (!moreOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMoreOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [moreOpen]);

  const navigate = (view: DashboardView) => {
    setMoreOpen(false);
    onViewChange(view);
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand-lockup sidebar-brand" href="/" aria-label="Nobug Rewards">
          <img alt="" className="brand-mark" decoding="async" src="/brand/rewards-mark.png" />
          <span className="brand-wordmark">Nobug <b>Rewards</b></span>
        </a>
        <div className="sidebar-section-label">ESPAÇO DE TRABALHO</div>
        <nav className="sidebar-nav" aria-label="Navegação principal">
          {navigation.map(({ id, label, icon }) => (
            <button type="button" key={id} className={`nav-link ${activeView === id ? 'selected' : ''}`} onClick={() => onViewChange(id)} aria-current={activeView === id ? 'page' : undefined}>
              <span className="nav-icon" aria-hidden="true"><Icon name={icon} size={18} /></span>
              <span>{label}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-help">
          <span className="help-icon"><Icon name="gift" size={17} /></span>
          <strong>Precisa de ajuda?</strong>
          <p>Estamos aqui para apoiar o seu crescimento.</p>
          <span className="support-label">Consulte os canais oficiais de suporte.</span>
        </div>
        <div className="sidebar-footer">Nobug Rewards <span>•</span> Parceiros</div>
      </aside>

      <div className="workspace">
        <header className="topbar">
          <div className="mobile-brand-lockup">
            <img alt="" className="brand-mark" decoding="async" src="/brand/rewards-mark.png" />
            <span className="brand-wordmark">Nobug <b>Rewards</b></span>
          </div>
          <div className="topbar-spacer" />
          <span className="topbar-tag"><span className="brand-dot" /> Recompensas e ecossistema de parceiros</span>
          <button
            type="button"
            className={`notification-shortcut${activeView === 'notifications' ? ' selected' : ''}`}
            onClick={() => navigate('notifications')}
            aria-label="Abrir notificações"
            aria-current={activeView === 'notifications' ? 'page' : undefined}
            title="Notificações"
          >
            <Icon name="bell" size={19} />
          </button>
          <div className="topbar-divider" />
          <div className="profile-summary">
            <span className="avatar">{userAvatarUrl ? <img alt="" src={mediaUrl(userAvatarUrl) || undefined} /> : userName.slice(0, 1).toUpperCase() || 'A'}</span>
            <span className="profile-name">{userName}</span>
          </div>
          <button type="button" className="signout-button" onClick={onSignOut} aria-label="Terminar sessão" title="Terminar sessão"><Icon name="logout" size={17} /></button>
        </header>
        {moreOpen && (
          <div className="mobile-more-overlay">
            <button aria-label="Fechar menu" className="mobile-more-dismiss" onClick={() => setMoreOpen(false)} type="button" />
            <nav aria-label="Mais secções" className="mobile-more-panel" id="mobile-more-panel">
              {mobileMoreNavigation.map(({ id, label, icon }) => (
                <button
                  aria-current={activeView === id ? 'page' : undefined}
                  className={activeView === id ? 'mobile-more-item mobile-more-item--active' : 'mobile-more-item'}
                  key={id}
                  onClick={() => navigate(id)}
                  type="button"
                >
                  <Icon name={icon} size={19} />
                  <span>{label}</span>
                </button>
              ))}
              <div className="mobile-more-account">
                <span className="mobile-more-avatar">{userAvatarUrl ? <img alt="" src={mediaUrl(userAvatarUrl) || undefined} /> : userName.slice(0, 1).toUpperCase() || 'A'}</span>
                <span className="mobile-more-user">{userName}</span>
                <button className="mobile-more-logout" disabled={busy} onClick={() => { setMoreOpen(false); onSignOut(); }} type="button">
                  Terminar sessão
                </button>
              </div>
            </nav>
          </div>
        )}
        <nav className="mobile-nav" aria-label="Navegação principal">
          {mobilePrimaryNavigation.map(({ id, label, icon }) => (
            <button
              aria-current={activeView === id ? 'page' : undefined}
              className={activeView === id ? 'mobile-nav__item mobile-nav__item--active' : 'mobile-nav__item'}
              key={id}
              onClick={() => navigate(id)}
              type="button"
            >
              <Icon name={icon} size={20} />
              <span>{id === 'overview' ? 'Início' : id === 'commissions' ? 'Comissões' : id === 'payouts' ? 'Levantamentos' : 'Avisos'}</span>
            </button>
          ))}
          <button
            aria-controls="mobile-more-panel"
            aria-expanded={moreOpen}
            className={`mobile-nav__item${moreOpen || mobileMoreNavigation.some(({ id }) => id === activeView) ? ' mobile-nav__item--active' : ''}`}
            onClick={() => setMoreOpen((open) => !open)}
            type="button"
          >
            <Icon name="more" size={20} />
            <span>Mais</span>
          </button>
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
