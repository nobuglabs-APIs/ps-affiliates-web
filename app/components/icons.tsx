import type { ReactNode } from 'react';

export type IconName =
  | 'home'
  | 'trend'
  | 'wallet'
  | 'bell'
  | 'user'
  | 'shield'
  | 'more'
  | 'logout'
  | 'copy'
  | 'check'
  | 'clock'
  | 'users'
  | 'gift'
  | 'bank'
  | 'info'
  | 'alert'
  | 'arrowUpRight'
  | 'mail';

const icons: Record<IconName, ReactNode> = {
  home: (
    <>
      <path d="M3.5 10.8 12 3.5l8.5 7.3" />
      <path d="M5.5 9.5V20a.5.5 0 0 0 .5.5h12a.5.5 0 0 0 .5-.5V9.5" />
      <path d="M9.5 20.5v-5.2a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v5.2" />
    </>
  ),
  trend: (
    <>
      <path d="M3.5 16.5 9.5 10.5l4 4 7-7" />
      <path d="M14.5 7.5h6v6" />
    </>
  ),
  wallet: (
    <>
      <path d="M5 6.5h13.5A1.5 1.5 0 0 1 20 8v9.5a1.5 1.5 0 0 1-1.5 1.5H5A2 2 0 0 1 3 17V7a2 2 0 0 1 2-2h11" />
      <path d="M16 11.5h4V15h-4a1.75 1.75 0 1 1 0-3.5Z" />
    </>
  ),
  bell: (
    <>
      <path d="M18 8.5a6 6 0 0 0-12 0c0 7-2.5 7-2.5 8.5h17C20.5 15.5 18 15.5 18 8.5" />
      <path d="M10 20.5h4" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="3.6" />
      <path d="M4.8 20.5a7.2 7.2 0 0 1 14.4 0" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3 5 6v5.2c0 4.6 2.9 7.8 7 9.8 4.1-2 7-5.2 7-9.8V6l-7-3Z" />
      <path d="m9 11.8 2.2 2.2 4-4.2" />
    </>
  ),
  more: (
    <>
      <circle cx="5" cy="12" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="19" cy="12" r="1.3" fill="currentColor" stroke="none" />
    </>
  ),
  logout: (
    <>
      <path d="M9.5 21H5.5A1.5 1.5 0 0 1 4 19.5v-15A1.5 1.5 0 0 1 5.5 3h4" />
      <path d="m16 16.5 4.5-4.5L16 7.5" />
      <path d="M20.5 12H9.5" />
    </>
  ),
  copy: (
    <>
      <rect x="8.5" y="8.5" width="11" height="11" rx="2.2" />
      <path d="M15.5 8.5V6a2 2 0 0 0-2-2h-7a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h2.5" />
    </>
  ),
  check: <path d="m4.5 12.5 5 5 10-11" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3.5 20a5.5 5.5 0 0 1 11 0" />
      <path d="M15.5 5.4a3.2 3.2 0 0 1 0 5.2" />
      <path d="M17.5 14.4A5.5 5.5 0 0 1 21 20" />
    </>
  ),
  gift: (
    <>
      <path d="M4 11.5h16V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z" />
      <path d="M3 7.5h18v4H3z" />
      <path d="M12 7.5V21" />
      <path d="M12 7.5S10.8 3 8.2 3a2.3 2.3 0 0 0 0 4.5z" />
      <path d="M12 7.5s1.2-4.5 3.8-4.5a2.3 2.3 0 0 1 0 4.5z" />
    </>
  ),
  bank: (
    <>
      <path d="M3.5 9 12 4l8.5 5" />
      <path d="M5 9v8M9.5 9v8M14.5 9v8M19 9v8" />
      <path d="M3 20.5h18" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 11v5" />
      <path d="M12 7.8h.01" />
    </>
  ),
  alert: (
    <>
      <path d="M12 3.5 21 20H3Z" />
      <path d="M12 9.5V14" />
      <path d="M12 17h.01" />
    </>
  ),
  arrowUpRight: (
    <>
      <path d="M6 18 18 6" />
      <path d="M8.5 6H18v9.5" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5.5" width="18" height="13" rx="2.2" />
      <path d="m4 7 8 6 8-6" />
    </>
  ),
};

export function Icon({ name, size = 20, className }: { name: IconName; size?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {icons[name]}
    </svg>
  );
}
