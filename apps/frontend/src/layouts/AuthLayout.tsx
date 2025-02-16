import { AppShell } from '@mantine/core';

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell padding="md">
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
