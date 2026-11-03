import type { Commission } from '../../lib/types';
import { formatDate, formatMoney, formatStatus } from '../../lib/format';

export function CommissionsPage({ commissions }: { commissions: Commission[] }) {
  const total = commissions.reduce((sum, item) => sum + item.commission_cents, 0);

  return (
    <section className="feature-page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">DESEMPENHO</span>
          <h1>Comissões</h1>
          <p>Consulte os ganhos gerados pelas suas indicações.</p>
        </div>
        <div className="heading-total">
          <span>Total listado</span>
          <strong>{formatMoney(total)}</strong>
        </div>
      </div>

      <div className="table-card">
        <div className="table-card-heading">
          <div>
            <h2>Histórico de comissões</h2>
            <p>{commissions.length} registos recentes</p>
          </div>
        </div>
        {commissions.length ? (
          <div className="table-scroll">
            <table>
              <thead>
                <tr><th>PLANO</th><th>VALOR</th><th>ESTADO</th><th>DISPONÍVEL EM</th></tr>
              </thead>
              <tbody>
                {commissions.map((item) => (
                  <tr key={item.id}>
                    <td><strong className="table-primary">{item.plan_code || 'Pagamento'}</strong></td>
                    <td>{formatMoney(item.commission_cents, item.currency)}</td>
                    <td><span className={`status-pill status-${item.status}`}>{formatStatus(item.status)}</span></td>
                    <td>{formatDate(item.available_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <span className="empty-icon">↗</span>
            <strong>Ainda sem comissões</strong>
            <p>Quando as suas indicações gerarem comissões, verá os detalhes aqui.</p>
          </div>
        )}
      </div>
    </section>
  );
}
