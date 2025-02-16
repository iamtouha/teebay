import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import { AppRouter } from './AppRouter';
import { AuthProvider } from './contexts/AuthContext';
function App() {
  return (
    <MantineProvider>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </MantineProvider>
  );
}

export default App;
