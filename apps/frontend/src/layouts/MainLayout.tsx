import { AppShell, Burger, Button, Group, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Link, useNavigate } from 'react-router';
import { useAuthStore } from '../stores/authStore';
import { useEffect } from 'react';
import { api, APIError } from '../utils/api';
import type { User } from '../utils/types';

if (window !== undefined) {
  const { token } = useAuthStore.getState();
  if (token) {
    api<User>('/api/auth/profile', { method: 'GET', headers: { Authorization: `Bearer ${token}` } })
      .then((data) => useAuthStore.setState({ user: data }))
      .catch((error) => {
        if (error instanceof APIError && error.status === 401) useAuthStore.getState().logout();
      });
  }
}

export function MainLayout({ children }: { children: React.ReactNode }) {
  const [opened, { toggle }] = useDisclosure();
  const token = useAuthStore((store) => store.token);
  const signOut = useAuthStore((store) => store.logout);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/signin');
    }
  }, [token]);

  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShell.Header px="md" style={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between ' }}>
        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
        <Group gap="md" align="center">
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Text size="xl" style={{ fontWeight: 'bold' }}>
              Teebay
            </Text>
          </Link>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            Home
          </Link>
          <Link to="/my-products" style={{ textDecoration: 'none', color: 'inherit' }}>
            My Products
          </Link>
        </Group>
        <Button variant="outline" onClick={signOut}>
          Sign Out
        </Button>
      </AppShell.Header>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
