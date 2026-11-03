import type { TwoFactorStatus } from '../../lib/types';

export function SecurityPage({ status, onSetup, onDisable }: { status: TwoFactorStatus | null; onSetup: () => void; onDisable: () => void }) {
  const stateLabel = status?.enabled ? 'ACTIVA' : status?.required ? 'NECESSÁRIA' : 'OPCIONAL';
  const stateClass = status?.enabled ? 'status-available' : status?.required ? 'status-pending' : 'status-neutral';
  const description = status?.enabled
    ? 'A sua conta está protegida com uma verificação adicional no início de sessão.'
    : status?.required
      ? 'A verificação de dois factores é necessária para esta conta. Active-a para continuar a proteger o seu acesso.'
      : 'Adicione uma camada extra de protecção. A activação torna-se necessária 30 dias após a criação da conta.';

  return (
    <section className="feature-page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">CONTA E ACESSO</span>
          <h1>Segurança</h1>
          <p>Proteja o acesso à sua conta de afiliado.</p>
        </div>
      </div>

      <article className="security-card">
        <div className="security-illustration">
          <span className="security-shield">✓</span>
          <span className="shield-orbit orbit-a" />
          <span className="shield-orbit orbit-b" />
        </div>
        <div className="security-copy">
          <span className={`status-pill ${stateClass}`}>{stateLabel}</span>
          <h2>Autenticação de dois factores</h2>
          <p>{description}</p>
          <div className="security-delivery">
            <span className="delivery-icon">✉</span>
            <span>O código será enviado para o seu e-mail verificado ou por SMS.</span>
          </div>
          {status?.enabled
            ? <button type="button" className="button button-outline" onClick={onDisable}>Desativar autenticação de dois fatores</button>
            : <button type="button" className="button button-primary" onClick={onSetup}>Activar autenticação de dois factores</button>}
        </div>
      </article>

      <div className="security-footnote">
        <span>i</span>
        <p>Nunca partilhe os seus códigos de segurança com terceiros. A equipa PS-Mobile nunca lhe pedirá um código de autenticação.</p>
      </div>
    </section>
  );
}
