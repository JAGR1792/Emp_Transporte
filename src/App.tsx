import { Routes, Route, Outlet } from 'react-router-dom';
import { MainLayout } from './views/components/layout/Layout';
import { Home } from './views/pages/Home';
import { Login } from './views/pages/Login';
import { Pasajeros } from './views/pages/Pasajeros';
import { Envios } from './views/pages/Envios';
import { Rastreo } from './views/pages/Rastreo';
import { Servicios } from './views/pages/Servicios';
import { Demo } from './views/pages/Demo';
import { DashboardLayout } from './views/layouts/DashboardLayout';
import { DashboardRouter } from './views/pages/dashboards/DashboardRouter';
import { RutasMetricas } from './views/pages/dashboards/RutasMetricas';

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
        <Route path="rutas" element={<RutasMetricas />} />
      </Route>
    </Routes>
  );
};

export default App;
