import { AppShell } from '@mantine/core';
import { useAuth } from '../stores/authStore';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

export function AuthLayout({ children }: { children: React.ReactNode }) {
  const { isLoggedin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedin) navigate('/');
  }, [isLoggedin]);

  return (
    <AppShell padding="md">
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
