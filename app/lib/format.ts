export function formatMoney(cents: number, currency = 'AOA') {
  return new Intl.NumberFormat('pt-AO', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat('pt-PT', { dateStyle: 'medium' }).format(new Date(value));
}

export function formatStatus(status: string) {
  const labels: Record<string, string> = {
    active: 'Activo',
    pending: 'Pendente',
    available: 'Disponível',
    reversed: 'Revertida',
    requested: 'Solicitado',
    processing: 'Em processamento',
    paid: 'Pago',
    rejected: 'Rejeitado',
    cancelled: 'Cancelado',
  };
  return labels[status] || status.replaceAll('_', ' ');
}
