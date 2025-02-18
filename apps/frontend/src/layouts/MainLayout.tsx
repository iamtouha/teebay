import { AppShell, Burger, Button, Group, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Link, useNavigate } from 'react-router';
import { useAuthStore } from '../stores/authStore';
import { useEffect } from 'react';
import type { User } from '../utils/types';
import { useQuery } from '@apollo/client';
import { GET_PROFILE } from '../utils/graphql/queries';

export function MainLayout({ children }: { children: React.ReactNode }) {
  const [opened, { toggle }] = useDisclosure();
  const setUser = useAuthStore((store) => store.setUserData);
  const signOut = useAuthStore((store) => store.logout);
  const navigate = useNavigate();
  const { data, loading, error, refetch } = useQuery<{ profile: User }>(GET_PROFILE);

  useEffect(() => {
    if (error?.message.includes('Unauthorized')) {
      navigate('/signin');
    }
  }, [error?.message]);

  useEffect(() => {
    if (data?.profile) {
      setUser(data.profile);
    }
  }, [data]);

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }

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
        <Button
          variant="outline"
          onClick={() => {
            signOut();
            refetch();
            navigate('/signin');
          }}
        >
          Sign Out
        </Button>
      </AppShell.Header>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
