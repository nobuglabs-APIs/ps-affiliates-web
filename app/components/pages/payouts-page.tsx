'use client';

import { FormEvent, useState } from 'react';
import type { AffiliateOverview, Payout } from '../../lib/types';
import { formatDate, formatMoney, formatStatus } from '../../lib/format';
import { PayoutMethod } from '../payout-method';
import { Icon } from '../icons';

type PayoutsPageProps = {
  overview: AffiliateOverview;
  payouts: Payout[];
  busy: boolean;
  onRequestPayout: (amount: string, method: string, destination: Payout['destination']) => void;
};

export function PayoutsPage({ overview, payouts, busy, onRequestPayout }: PayoutsPageProps) {
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('multicaixa_express');
  const [phone, setPhone] = useState('');
  const [iban, setIban] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountHolder, setAccountHolder] = useState('');

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const destination = method === 'bank_transfer'
      ? { iban, bank_name: bankName || null, account_holder: accountHolder }
      : { phone, account_holder: accountHolder };
    onRequestPayout(amount, method, destination);
    setAmount('');
  };

  return (
    <section className="feature-page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">PAGAMENTOS</span>
          <h1>Levantamentos</h1>
          <p>Solicite e acompanhe os pagamentos das suas comissões.</p>
        </div>
        <div className="heading-total">
          <span>Saldo disponível</span>
          <strong>{formatMoney(overview.balance_cents, overview.currency)}</strong>
        </div>
      </div>

      <div className="payout-layout">
        <article className="form-card">
          <div className="form-card-heading">
            <span className="form-card-icon"><Icon name="wallet" size={18} /></span>
            <div>
              <h2>Pedir levantamento</h2>
              <p>Indique o valor e os dados de destino.</p>
            </div>
          </div>
          <form className="payout-form" onSubmit={submit}>
            <label htmlFor="payout-amount">Valor a levantar <span>({overview.currency})</span></label>
            <div className="amount-input">
              <span>{overview.currency}</span>
              <input
                id="payout-amount"
                required
                type="number"
                min={(overview.minimum_withdrawal_cents / 100).toFixed(2)}
                max={(overview.balance_cents / 100).toFixed(2)}
                step="0.01"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                placeholder="0,00"
              />
            </div>
            <small>Mínimo: {formatMoney(overview.minimum_withdrawal_cents, overview.currency)} · Saldo: {formatMoney(overview.balance_cents, overview.currency)}</small>

            <span className="payout-method-label" id="payout-method-label">Método de pagamento</span>
            <div className="payout-method-choices" role="radiogroup" aria-labelledby="payout-method-label">
              {(['multicaixa_express', 'unitel_money', 'bank_transfer'] as const).map((option) => (
                <label
                  className={`payout-method-choice${method === option ? ' is-selected' : ''}`}
                  key={option}
                >
                  <input
                    checked={method === option}
                    name="payout-method"
                    onChange={() => setMethod(option)}
                    type="radio"
                    value={option}
                  />
                  <PayoutMethod method={option} />
                  <span className="payout-method-choice__radio" aria-hidden="true" />
                </label>
              ))}
            </div>

            {method === 'bank_transfer' ? (
              <>
                <label htmlFor="payout-iban">IBAN</label>
                <input id="payout-iban" required value={iban} onChange={(event) => setIban(event.target.value)} placeholder="AO06 0000 0000 0000 0000 0000 0" />
                <label htmlFor="payout-bank">Banco <span>(opcional)</span></label>
                <input id="payout-bank" value={bankName} onChange={(event) => setBankName(event.target.value)} placeholder="Nome do banco" />
              </>
            ) : (
              <>
                <label htmlFor="payout-phone">Número de telemóvel</label>
                <input id="payout-phone" required type="tel" autoComplete="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="+244 9xx xxx xxx" />
              </>
            )}

            <label htmlFor="payout-holder">Titular da conta</label>
            <input id="payout-holder" required minLength={2} value={accountHolder} onChange={(event) => setAccountHolder(event.target.value)} placeholder="Nome do titular" />
            <button className="button button-primary button-wide" disabled={busy || !overview.withdrawals_enabled || overview.balance_cents < overview.minimum_withdrawal_cents}>
              {busy ? 'A processar…' : 'Solicitar levantamento'}
            </button>
            {!overview.withdrawals_enabled && <p className="inline-hint">Os levantamentos estão temporariamente indisponíveis.</p>}
          </form>
        </article>

        <aside className="payout-note">
          <span className="note-icon"><Icon name="info" size={14} /></span>
          <h3>Antes de solicitar</h3>
          <p>Os pedidos são analisados pela equipa Nobug Rewards. As comissões ficam sujeitas a um período de retenção de {overview.hold_days} dias.</p>
          <div className="note-separator" />
          <div className="note-row"><span>Valor mínimo</span><strong>{formatMoney(overview.minimum_withdrawal_cents, overview.currency)}</strong></div>
          <div className="note-row"><span>Pedidos recentes</span><strong>{payouts.length}</strong></div>
        </aside>
      </div>

      <div className="table-card payout-history">
        <div className="table-card-heading">
          <div>
            <h2>Histórico de pedidos</h2>
            <p>Acompanhe o estado dos seus levantamentos.</p>
          </div>
        </div>
        {payouts.length ? (
          <div className="table-scroll">
            <table>
              <thead>
                <tr><th>DATA DO PEDIDO</th><th>VALOR</th><th>MÉTODO</th><th>ESTADO</th></tr>
              </thead>
              <tbody>
                {payouts.map((item) => (
                  <tr key={item.id}>
                    <td>{formatDate(item.requested_at)}</td>
                    <td><strong className="table-primary">{formatMoney(item.amount_cents, item.currency)}</strong></td>
                    <td><PayoutMethod compact method={item.method} /></td>
                    <td><span className={`status-pill status-${item.status}`}>{formatStatus(item.status)}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <span className="empty-icon"><Icon name="wallet" size={19} /></span>
            <strong>Sem pedidos de levantamento</strong>
            <p>Os seus pedidos vão aparecer aqui.</p>
          </div>
        )}
      </div>
    </section>
  );
}
