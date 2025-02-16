import { AppShell } from '@mantine/core';
import { useAuthStore } from '../stores/authStore';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

export function AuthLayout({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((store) => store.token);
  const navigate = useNavigate();

  useEffect(() => {
    if (!!token) navigate('/');
  }, [token]);

  return (
    <AppShell padding="md">
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
