import { BrowserRouter, Link, Outlet, Route, Routes } from 'react-router';
import { Home } from './views/Home';
import { MainLayout } from './layouts/MainLayout';
import { AuthLayout } from './layouts/AuthLayout';
import { Signin } from './views/Signin';
import { Signup } from './views/Signup';
import { MyProducts } from './views/MyProducts';
import AddProduct from './views/AddProduct';

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
          <Route path="my-products" element={<MyProducts />} />
          <Route path="add-product" element={<AddProduct />} />
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
        <Route
          path="*"
          element={
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                fontSize: 24,
              }}
            >
              <div style={{ textAlign: 'center' }}>
                404 - Page Not Found
                <p style={{ fontSize: 20, margin: 0 }}>
                  <Link to="/">Go Home</Link>
                </p>
              </div>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
