import { Routes, Route, Outlet } from 'react-router-dom';
import { MainLayout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { PlaceholderPage } from './pages/PlaceholderPages';
import { Login } from './pages/Login';
import { DashboardLayout } from './layouts/DashboardLayout';
import { DashboardRouter } from './pages/dashboards/DashboardRouter';

const App = () => {
  return (
    <Routes>
      {/* Public Routes with MainLayout */}
      <Route element={<MainLayout><Outlet /></MainLayout>}>
        <Route path="/" element={<Home />} />
        <Route 
          path="/pasajeros" 
          element={
            <PlaceholderPage 
              title="Comprar Tiquetes" 
              description="Módulo de compra de tiquetes y consulta de itinerarios para pasajeros." 
            />
          } 
        />
        <Route 
          path="/envios" 
          element={
            <PlaceholderPage 
              title="Cotizar Envíos" 
              description="Plataforma de cotización y solicitud de recogida de paquetes." 
            />
          } 
        />
        <Route 
          path="/rastreo" 
          element={
            <PlaceholderPage 
              title="Rastreo de Paquetes" 
              description="Sistema de trazabilidad en tiempo real para todos tus envíos." 
            />
          } 
        />
        <Route 
          path="/servicios" 
          element={
            <PlaceholderPage 
              title="Servicios Corporativos" 
              description="Soluciones especializadas y carga masiva para clientes empresariales." 
            />
          } 
        />
      </Route>

      {/* Login */}
      <Route path="/login" element={<Login />} />

      {/* Protected Routes with DashboardLayout */}
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<DashboardRouter />} />
      </Route>
    </Routes>
  );
};

export default App;
