import { MantineProvider } from '@mantine/core';
import { AppRouter } from './AppRouter';
import { GraphqlClientProvider } from './utils/graphql';
import { Notifications } from '@mantine/notifications';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

function App() {
  return (
    <MantineProvider>
      <Notifications />
      <GraphqlClientProvider>
        <AppRouter />
      </GraphqlClientProvider>
    </MantineProvider>
  );
}

export default App;
