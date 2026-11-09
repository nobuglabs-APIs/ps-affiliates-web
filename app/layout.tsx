import type { Metadata, Viewport } from 'next';
import { ServiceWorkerRegister } from './components/service-worker-register';
import './styles.css';

export const viewport: Viewport = {
  themeColor: '#7c0a18',
  colorScheme: 'light',
};

export const metadata: Metadata = {
  title: 'Nobug Rewards | Recompensas e ecossistema de parceiros',
  description: 'Acompanhe indicações, comissões e levantamentos na plataforma Nobug Rewards.',
  applicationName: 'Nobug Rewards',
  appleWebApp: { capable: true, statusBarStyle: 'default', title: 'Nobug Rewards' },
  formatDetection: { telephone: false },
  robots: { index: false, follow: false },
  icons: {
    icon: '/brand/rewards.webp',
    apple: '/brand/rewards.webp',
  },
  manifest: '/manifest.webmanifest',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt"><body>{children}<ServiceWorkerRegister /></body></html>;
}
