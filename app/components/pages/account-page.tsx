'use client';

import { FormEvent, useEffect, useState } from 'react';
import type { AffiliateOverview } from '../../lib/types';
import { mediaUrl, remove, request, upload } from '../../lib/api';
import { Icon } from '../icons';

type Preferences = {
  notify_email: boolean;
  notify_sms: boolean;
  notify_whatsapp: boolean;
};

export function AccountPage({
  overview,
  onUpdated,
}: {
  overview: AffiliateOverview;
  onUpdated: (overview: AffiliateOverview) => void;
}) {
  const [name, setName] = useState(overview.profile.full_name);
  const [phone, setPhone] = useState(overview.profile.phone || '');
  const [preferences, setPreferences] = useState<Preferences | null>(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    let active = true;
    request<Preferences>('/notifications/preferences')
      .then((result) => { if (active) setPreferences(result); })
      .catch((reason: unknown) => { if (active) setError(reason instanceof Error ? reason.message : 'Não foi possível carregar as preferências.'); });
    return () => { active = false; };
  }, []);

  const run = async (action: () => Promise<void>) => {
    setBusy(true);
    setError('');
    setMessage('');
    try {
      await action();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Não foi possível guardar as alterações.');
    } finally {
      setBusy(false);
    }
  };

  const saveProfile = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void run(async () => {
      const updated = await request<AffiliateOverview>('/auth/me', {
        method: 'PATCH',
        body: { full_name: name.trim(), phone: phone.trim() },
      });
      onUpdated(updated);
      setMessage('Os dados do perfil foram atualizados.');
    });
  };

  const setAvatar = (file?: File) => {
    if (!file) return;
    void run(async () => {
      const result = await upload<{ url: string }>('/auth/me/avatar', file);
      onUpdated({ ...overview, profile: { ...overview.profile, avatar_url: result.url } });
      setMessage('Fotografia de perfil atualizada.');
    });
  };

  const deleteAvatar = () => run(async () => {
    await remove('/auth/me/avatar');
    onUpdated({ ...overview, profile: { ...overview.profile, avatar_url: null } });
    setMessage('Fotografia de perfil removida.');
  });

  const savePreference = (key: keyof Preferences, value: boolean) => run(async () => {
    const updated = await request<Preferences>('/notifications/preferences', {
      method: 'PUT',
      body: { [key]: value },
    });
    setPreferences(updated);
    onUpdated({ ...overview, profile: { ...overview.profile, ...updated } });
    setMessage('Preferência atualizada.');
  });

  const savePassword = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('As palavras-passe não coincidem.');
      return;
    }
    void run(async () => {
      await request<void>('/auth/change-password', {
        method: 'POST',
        body: { current_password: currentPassword, new_password: newPassword },
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setMessage('Palavra-passe alterada. As outras sessões foram terminadas.');
    });
  };

  return (
    <section className="feature-page">
      <div className="page-heading">
        <div><span className="eyebrow">CONTA E PREFERÊNCIAS</span><h1>A sua conta</h1><p>Atualize os seus dados e mantenha o acesso protegido.</p></div>
      </div>
      {error && <p className="notice notice-error" role="alert">{error}</p>}
      {message && <p className="notice notice-success" role="status">{message}</p>}

      <article className="account-panel">
        <div className="account-panel-heading"><span className="account-panel-icon"><Icon name="user" size={18} /></span><div><h2>Perfil</h2><p>Os dados de contacto associados à sua conta.</p></div></div>
        <div className="affiliate-profile-image">
          <span className="affiliate-profile-avatar">
            {overview.profile.avatar_url
              ? <img alt="" src={mediaUrl(overview.profile.avatar_url) || undefined} />
              : overview.profile.full_name.slice(0, 1).toLocaleUpperCase()}
          </span>
          <div className="affiliate-profile-image__actions">
            <label className="button button-outline">Escolher fotografia<input accept="image/jpeg,image/png,image/webp" disabled={busy} onChange={(event) => { setAvatar(event.target.files?.[0]); event.currentTarget.value = ''; }} type="file" /></label>
            <label className="button button-outline">Tirar fotografia<input accept="image/*" capture="user" disabled={busy} onChange={(event) => { setAvatar(event.target.files?.[0]); event.currentTarget.value = ''; }} type="file" /></label>
            {overview.profile.avatar_url && <button className="button button-outline" disabled={busy} onClick={() => void deleteAvatar()} type="button">Remover</button>}
          </div>
        </div>
        <form className="account-form" onSubmit={saveProfile}>
          <label><span>Nome completo</span><input autoComplete="name" maxLength={200} minLength={2} required value={name} onChange={(event) => setName(event.target.value)} /></label>
          <label><span>E-mail</span><input disabled value={overview.profile.email || 'Não definido'} /></label>
          <label><span>Telemóvel</span><input autoComplete="tel" maxLength={32} type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="+244 9xx xxx xxx" /></label>
          <button className="button button-primary" disabled={busy} type="submit">{busy ? 'A guardar…' : 'Guardar perfil'}</button>
        </form>
      </article>

      <article className="account-panel">
        <div className="account-panel-heading"><span className="account-panel-icon"><Icon name="bell" size={18} /></span><div><h2>Notificações</h2><p>Escolha os canais onde quer receber novidades e avisos.</p></div></div>
        <div className="affiliate-preferences">
          {([
            ['notify_email', 'E-mail'],
            ['notify_sms', 'SMS'],
            ['notify_whatsapp', 'WhatsApp'],
          ] as const).map(([key, label]) => (
            <label className="affiliate-preference" key={key}>
              <span>{label}</span>
              <input checked={Boolean(preferences?.[key])} disabled={!preferences || busy} onChange={(event) => void savePreference(key, event.target.checked)} type="checkbox" />
            </label>
          ))}
        </div>
      </article>

      <article className="account-panel">
        <div className="account-panel-heading"><span className="account-panel-icon"><Icon name="shield" size={18} /></span><div><h2>Alterar palavra-passe</h2><p>Recomendamos pelo menos 10 caracteres.</p></div></div>
        <form className="account-form" onSubmit={savePassword}>
          <label><span>Palavra-passe atual</span><input autoComplete="current-password" required type="password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} /></label>
          <label><span>Nova palavra-passe</span><input autoComplete="new-password" minLength={10} required type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} /></label>
          <label><span>Confirmar palavra-passe</span><input autoComplete="new-password" minLength={10} required type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} /></label>
          <button className="button button-primary" disabled={busy} type="submit">{busy ? 'A guardar…' : 'Alterar palavra-passe'}</button>
        </form>
      </article>
    </section>
  );
}
