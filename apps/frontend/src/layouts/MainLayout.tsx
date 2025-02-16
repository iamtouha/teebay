import { AppShell, Burger, Button, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Link, useNavigate } from 'react-router';
import { useAuthStore } from '../stores/authStore';
import { useEffect } from 'react';

export function MainLayout({ children }: { children: React.ReactNode }) {
  const [opened, { toggle }] = useDisclosure();
  const token = useAuthStore((store) => store.token);
  const signOut = useAuthStore((store) => store.logout);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) navigate('/signin');
  }, [token]);
  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header px="md" style={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between ' }}>
        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <Text size="xl" style={{ fontWeight: 'bold' }}>
            Teebay
          </Text>
        </Link>
        <Button variant="outline" onClick={signOut}>
          Sign Out
        </Button>
      </AppShell.Header>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
