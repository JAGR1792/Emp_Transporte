import { Routes, Route, Outlet } from 'react-router-dom';
import { MainLayout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Pasajeros } from './pages/Pasajeros';
import { Envios } from './pages/Envios';
import { Rastreo } from './pages/Rastreo';
import { Servicios } from './pages/Servicios';
import { Demo } from './pages/Demo';
import { DashboardLayout } from './layouts/DashboardLayout';
import { DashboardRouter } from './pages/dashboards/DashboardRouter';

const App = () => {
  return (
    <Routes>
      {/* Public Routes with MainLayout */}
      <Route element={<MainLayout><Outlet /></MainLayout>}>
        <Route path="/" element={<Home />} />
        <Route path="/pasajeros" element={<Pasajeros />} />
        <Route path="/envios" element={<Envios />} />
        <Route path="/rastreo" element={<Rastreo />} />
        <Route path="/servicios" element={<Servicios />} />
      </Route>

      {/* Login */}
      <Route path="/login" element={<Login />} />

      {/* Dev-only component playground — no layout wrapper */}
      {import.meta.env.DEV && (
        <Route path="/demo" element={<Demo />} />
      )}

      {/* Protected Routes with DashboardLayout */}
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<DashboardRouter />} />
      </Route>
    </Routes>
  );
};

export default App;
