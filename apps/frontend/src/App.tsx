import { MantineProvider } from '@mantine/core';
import { AppRouter } from './AppRouter';
import { GraphqlClientProvider } from './utils/graphql';
import '@mantine/core/styles.css';

function App() {
  return (
    <MantineProvider>
      <GraphqlClientProvider>
        <AppRouter />
      </GraphqlClientProvider>
    </MantineProvider>
  );
}

export default App;
