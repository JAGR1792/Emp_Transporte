import { Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { PlaceholderPage } from './pages/PlaceholderPages';

const App = () => {
  return (
    <MainLayout>
      <Routes>
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
      </Routes>
    </MainLayout>
  );
};

export default App;
