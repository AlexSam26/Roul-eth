'use client';

import { useEffect, useState } from 'react';

export function useTelegram() {
  const [isTelegram, setIsTelegram] = useState(false);
  const [webApp, setWebApp] = useState<Window['Telegram'] | null>(null);
  const [user, setUser] = useState<{ id: number; firstName: string; username?: string } | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const tg = window.Telegram?.WebApp;
    if (tg) {
      setIsTelegram(true);
      setWebApp(window.Telegram);
      tg.ready();
      tg.expand();

      const u = tg.initDataUnsafe?.user;
      if (u) {
        setUser({
          id: u.id,
          firstName: u.first_name,
          username: u.username,
        });
      }
    }
  }, []);

  return {
    isTelegram,
    webApp: webApp?.WebApp ?? null,
    user,
  };
}
