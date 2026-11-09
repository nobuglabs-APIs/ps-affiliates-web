'use client';

import { useEffect, useState } from 'react';
import type { AppNotification, Page } from '../../lib/types';
import { get, post } from '../../lib/api';
import { Icon } from '../icons';

function formatDate(value: string) {
  return new Intl.DateTimeFormat('pt-AO', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
}

export function NotificationsPage() {
  const [items, setItems] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const refresh = async () => {
    setError('');
    try {
      const [result, unread] = await Promise.all([
        get<Page<AppNotification>>('/notifications?per_page=30'),
        get<Page<AppNotification>>('/notifications?unread_only=true&per_page=1'),
      ]);
      setItems(result.items);
      setPage(result.page);
      setTotal(result.total);
      setUnreadCount(unread.total);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Não foi possível carregar as notificações.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void refresh(); }, []);

  const markRead = async (item: AppNotification) => {
    setBusy(true);
    setError('');
    try {
      await post(`/notifications/${encodeURIComponent(item.id)}/read`);
      setItems((current) => current.map((notification) => notification.id === item.id
        ? { ...notification, read_at: new Date().toISOString() }
        : notification));
      setUnreadCount((count) => Math.max(0, count - (item.read_at ? 0 : 1)));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Não foi possível marcar como lida.');
    } finally {
      setBusy(false);
    }
  };

  const markAllRead = async () => {
    setBusy(true);
    setError('');
    try {
      await post('/notifications/read-all');
      const now = new Date().toISOString();
      setItems((current) => current.map((item) => ({ ...item, read_at: item.read_at || now })));
      setUnreadCount(0);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Não foi possível marcar todas como lidas.');
    } finally {
      setBusy(false);
    }
  };

  const loadMore = async () => {
    setBusy(true);
    setError('');
    try {
      const result = await get<Page<AppNotification>>(`/notifications?page=${page + 1}&per_page=30`);
      setItems((current) => [...current, ...result.items]);
      setPage(result.page);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Não foi possível carregar mais notificações.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="feature-page">
      <header className="page-heading notification-heading">
        <div><span className="eyebrow">CENTRO DE AVISOS</span><h1>Notificações</h1><p>Acompanhe novidades e atualizações da sua conta.</p></div>
        {unreadCount > 0 && <button className="button button-outline" disabled={busy} onClick={() => void markAllRead()} type="button">Marcar todas como lidas</button>}
      </header>
      {error && <p className="notice notice-error" role="alert">{error}</p>}
      <div className="notification-list" aria-label="Lista de notificações">
        {loading ? <div className="empty-state">A carregar notificações…</div> : items.length === 0 ? (
          <div className="empty-state"><span aria-hidden="true" className="empty-icon"><Icon name="check" size={19} /></span><strong>Está tudo em dia</strong><p>Quando houver novidades importantes, elas aparecerão aqui.</p></div>
        ) : items.map((item) => (
          <article className={`notification-item${item.read_at ? '' : ' notification-item-unread'}`} key={item.id}>
            <span aria-hidden="true" className="notification-item-icon"><Icon name="bell" size={15} /></span>
            <div className="notification-item-copy">
              <div className="notification-item-title"><h2>{item.title}</h2>{!item.read_at && <span>Nova</span>}</div>
              <p>{item.body}</p>
              <time dateTime={item.created_at}>{formatDate(item.created_at)}</time>
            </div>
            {!item.read_at && <button aria-label={`Marcar "${item.title}" como lida`} className="notification-read" disabled={busy} onClick={() => void markRead(item)} type="button"><Icon name="check" size={14} /></button>}
          </article>
        ))}
      </div>
      {!loading && items.length < total && <button className="button button-outline notification-more" disabled={busy} onClick={() => void loadMore()} type="button">{busy ? 'A carregar…' : 'Carregar mais'}</button>}
    </section>
  );
}
