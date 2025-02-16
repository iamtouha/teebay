import { AppShell, Burger, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../stores/authStore';
import { useEffect } from 'react';

export function MainLayout({ children }: { children: React.ReactNode }) {
  const [opened, { toggle }] = useDisclosure();
  const { isLoggedin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedin) navigate('/signin');
  }, [isLoggedin]);
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
      <AppShell.Header px="md" style={{ alignItems: 'center', display: 'flex' }}>
        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <Text size="xl" style={{ fontWeight: 'bold' }}>
            Teebay
          </Text>
        </Link>
      </AppShell.Header>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
