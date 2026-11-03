'use client';

import { useState } from 'react';
import type { Payout } from '../../lib/types';
import { formatDate, formatMoney, formatStatus } from '../../lib/format';
import { PayoutMethod } from '../payout-method';

type Action = 'approve' | 'paid' | 'reject';
type AdminPayoutsPageProps = {
  payouts: Payout[];
  busy: boolean;
  onUpdate: (payout: Payout, action: Action, details?: { providerRef?: string; note?: string }) => void;
};

function payoutDestination(payout: Payout): [string, string][] {
  const destination = payout.destination || {};
  const values: [string, unknown][] = payout.method === 'bank_transfer'
    ? [['IBAN', destination.iban], ['Banco', destination.bank_name], ['Titular', destination.account_holder]]
    : [['Telemóvel', destination.phone], ['Titular', destination.account_holder]];
  return values.filter((entry): entry is [string, string] => typeof entry[1] === 'string' && entry[1].length > 0);
}

export function AdminPayoutsPage({ payouts, busy, onUpdate }: AdminPayoutsPageProps) {
  const [selected, setSelected] = useState<Payout | null>(null);
  const [action, setAction] = useState<Action>('approve');
  const [providerRef, setProviderRef] = useState('');
  const [note, setNote] = useState('');
  const processingCount = payouts.filter((payout) => payout.status === 'processing').length;
  const requestedCount = payouts.filter((payout) => payout.status === 'requested').length;

  const openAction = (payout: Payout, nextAction: Action) => {
    setSelected(payout);
    setAction(nextAction);
    setProviderRef('');
    setNote('');
  };

  const submit = () => {
    if (!selected) return;
    onUpdate(selected, action, { providerRef, note });
    setSelected(null);
  };

  return (
    <section className="feature-page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">GESTÃO INTERNA</span>
          <h1>Administração de pagamentos</h1>
          <p>Analise os pedidos e registe o resultado do processamento.</p>
        </div>
      </div>

      <div className="admin-summary">
        <article><span>Pedidos por analisar</span><strong>{requestedCount}</strong></article>
        <article><span>Em processamento</span><strong>{processingCount}</strong></article>
        <article><span>Total em aberto</span><strong>{payouts.length}</strong></article>
      </div>

      <div className="table-card">
        <div className="table-card-heading">
          <div>
            <h2>Pedidos de levantamento</h2>
            <p>Os pedidos incluem o estado actual do processamento.</p>
          </div>
        </div>
        {payouts.length ? (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>AFILIADO</th><th>DATA</th><th>VALOR</th><th>MÉTODO</th>
                  <th>DESTINO</th><th>ESTADO</th><th>ACÇÕES</th>
                </tr>
              </thead>
              <tbody>
                {payouts.map((payout) => (
                  <tr key={payout.id}>
                    <td>
                      <strong className="table-primary">{payout.affiliate_email || payout.affiliate_code || payout.affiliate_id}</strong>
                      <span className="table-subtext">{payout.affiliate_code || payout.affiliate_id}</span>
                    </td>
                    <td>{formatDate(payout.requested_at)}</td>
                    <td><strong className="table-primary">{formatMoney(payout.amount_cents, payout.currency)}</strong></td>
                    <td><PayoutMethod compact method={payout.method} /></td>
                    <td>
                      {payoutDestination(payout).map(([label, value]) => (
                        <span className="table-subtext" key={label}><strong>{label}:</strong> {value}</span>
                      ))}
                    </td>
                    <td><span className={`status-pill status-${payout.status}`}>{formatStatus(payout.status)}</span></td>
                    <td>
                      <div className="action-group">
                        {payout.status === 'requested' && (
                          <button type="button" className="button button-small button-primary" disabled={busy} onClick={() => openAction(payout, 'approve')}>Aprovar</button>
                        )}
                        {(payout.status === 'requested' || payout.status === 'processing') && (
                          <>
                            <button type="button" className="button button-small button-outline" disabled={busy} onClick={() => openAction(payout, 'paid')}>Marcar pago</button>
                            <button type="button" className="button button-small button-danger" disabled={busy} onClick={() => openAction(payout, 'reject')}>Rejeitar</button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <span className="empty-icon">✓</span>
            <strong>Não há pedidos pendentes</strong>
            <p>Os novos pedidos de levantamento serão apresentados aqui.</p>
          </div>
        )}
      </div>

      {selected && (
        <div
          className="dialog-backdrop"
          role="presentation"
          onClick={(event) => {
            if (event.target === event.currentTarget) setSelected(null);
          }}
        >
          <section className="action-dialog" role="dialog" aria-modal="true" aria-labelledby="payout-dialog-title">
            <button type="button" className="dialog-close" onClick={() => setSelected(null)} aria-label="Fechar">×</button>
            <span className="eyebrow">CONFIRMAR ACÇÃO</span>
            <h2 id="payout-dialog-title">
              {action === 'approve' ? 'Aprovar pedido' : action === 'paid' ? 'Registar pagamento' : 'Rejeitar pedido'}
            </h2>
            <p>{formatMoney(selected.amount_cents, selected.currency)} · {selected.affiliate_email || selected.affiliate_code || selected.affiliate_id}</p>
            <div className="destination-details">
              {payoutDestination(selected).map(([label, value]) => (
                <div key={label}><span>{label}</span><strong>{value}</strong></div>
              ))}
            </div>
            {action === 'paid' && (
              <>
                <label htmlFor="provider-reference">Referência de pagamento <span>(opcional)</span></label>
                <input id="provider-reference" maxLength={200} value={providerRef} onChange={(event) => setProviderRef(event.target.value)} placeholder="Referência da operação" />
              </>
            )}
            {action !== 'approve' && (
              <>
                <label htmlFor="action-note">{action === 'reject' ? 'Motivo da rejeição' : 'Nota interna'} <span>(opcional)</span></label>
                <textarea id="action-note" maxLength={500} rows={3} value={note} onChange={(event) => setNote(event.target.value)} placeholder={action === 'reject' ? 'Indique o motivo...' : 'Adicionar nota...'} />
              </>
            )}
            <div className="dialog-actions">
              <button type="button" className="button button-outline" onClick={() => setSelected(null)}>Cancelar</button>
              <button type="button" className={`button ${action === 'reject' ? 'button-danger' : 'button-primary'}`} disabled={busy} onClick={submit}>
                {action === 'approve' ? 'Aprovar pedido' : action === 'paid' ? 'Confirmar pagamento' : 'Rejeitar pedido'}
              </button>
            </div>
          </section>
        </div>
      )}
    </section>
  );
}
