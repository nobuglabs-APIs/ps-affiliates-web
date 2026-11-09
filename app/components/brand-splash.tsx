export function BrandSplash() {
  return (
    <main className="brand-splash" role="status" aria-label="A carregar Nobug Rewards">
      <div className="brand-splash-app">
        <img alt="" decoding="async" src="/brand/rewards-mark.png" />
        <span className="brand-wordmark">Nobug <b>Rewards</b></span>
        <small>Recompensas e ecossistema de parceiros</small>
        <span className="brand-splash-loader" aria-hidden="true" />
      </div>
      <div className="brand-splash-attribution">
        <span>From</span>
        <img alt="Nobug Labs" decoding="async" src="/brand/nobuglabs-logo.webp" />
        <small>© Nobug Labs. Todos os direitos reservados.</small>
      </div>
    </main>
  );
}
