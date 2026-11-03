type PayoutMethodProps = {
  method: string;
  compact?: boolean;
};

const methods: Record<string, { label: string; image?: string }> = {
  multicaixa_express: { label: 'Multicaixa Express', image: '/brand/express.webp' },
  unitel_money: { label: 'Unitel Money', image: '/brand/unitelmoney.jfif' },
  bank_transfer: { label: 'Transferência bancária' },
};

export function PayoutMethod({ method, compact = false }: PayoutMethodProps) {
  const paymentMethod = methods[method] || { label: method.replaceAll('_', ' ') };

  return (
    <span className={`payout-method${compact ? ' payout-method--compact' : ''}`}>
      {paymentMethod.image
        ? <img alt="" src={paymentMethod.image} />
        : <span className="payout-method__bank" aria-hidden="true">AO</span>}
      <span>{paymentMethod.label}</span>
    </span>
  );
}
