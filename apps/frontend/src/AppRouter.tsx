import { BrowserRouter, Outlet, Route, Routes } from 'react-router';
import { Home } from './views/Home';
import { MainLayout } from './layouts/MainLayout';
import { AuthLayout } from './layouts/AuthLayout';
import { Signin } from './views/Signin';
import { Signup } from './views/Signup';

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          element={
            <MainLayout>
              <Outlet />
            </MainLayout>
          }
        >
          <Route index element={<Home />} />
        </Route>
        <Route
          element={
            <AuthLayout>
              <Outlet />
            </AuthLayout>
          }
        >
          <Route path="signin" element={<Signin />} />
          <Route path="signup" element={<Signup />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
