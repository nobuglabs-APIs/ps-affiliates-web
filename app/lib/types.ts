export type TokenResponse = {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
};

export type AuthResponse = {
  tokens: TokenResponse;
  referral_link: string;
  affiliate: unknown;
};

export type Challenge = {
  challenge_id: string;
  channel: string;
  expires_in_secs: number;
};

export type AffiliateOverview = {
  profile: {
    id: string;
    full_name: string;
    email: string | null;
    phone: string | null;
    avatar_url: string | null;
    code: string;
    is_admin: boolean;
    status: string;
  };
  referral_link: string;
  balance_cents: number;
  pending_cents: number;
  lifetime_earned_cents: number;
  paid_out_cents: number;
  referrals_count: number;
  active_referrals_count: number;
  commissions_count: number;
  minimum_withdrawal_cents: number;
  currency: string;
  hold_days: number;
  withdrawals_enabled: boolean;
};

export type Page<T> = {
  items: T[];
  page: number;
  per_page: number;
  total: number;
};

export type Commission = {
  id: string;
  plan_code: string | null;
  commission_cents: number;
  currency: string;
  status: string;
  available_at: string;
  created_at: string;
};

export type Payout = {
  id: string;
  affiliate_id?: string;
  amount_cents: number;
  currency: string;
  method: string;
  status: string;
  requested_at: string;
  affiliate_email?: string | null;
  affiliate_code?: string;
  provider_ref?: string | null;
  note?: string | null;
  destination?: Record<string, unknown>;
};

export type TwoFactorStatus = {
  enabled: boolean;
  required: boolean;
  required_at: string;
};
