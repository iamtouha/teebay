import { BrowserRouter, Outlet, Route, Routes } from 'react-router';
import { Home } from './views/Home';
import { MainLayout } from './layouts/MainLayout';

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <MainLayout>
              <Outlet />
            </MainLayout>
          }
        >
          <Route index element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
