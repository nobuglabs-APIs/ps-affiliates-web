import type { Metadata } from 'next';
import './styles.css';

export const metadata: Metadata = {
  title: 'PS Affiliates | Programa de parceiros PS-Mobile',
  description: 'Acompanhe indicações, comissões e levantamentos no programa de parceiros PS-Mobile.',
  icons: {
    icon: '/brand/affiliates.webp',
    apple: '/brand/affiliates.webp',
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt"><body>{children}</body></html>;
}
