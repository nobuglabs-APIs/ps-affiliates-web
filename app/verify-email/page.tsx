'use client';

import { useEffect } from 'react';

export default function VerifyEmailPage() {
  useEffect(() => {
    window.location.replace(`/${window.location.search}`);
  }, []);

  return <main className="auth-page">A abrir a confirmação do e-mail…</main>;
}
