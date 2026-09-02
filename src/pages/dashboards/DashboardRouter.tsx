import { useAuth } from '@/context/AuthContext';
import { ClienteDashboard } from './ClienteDashboard';
import { OperarioDashboard } from './OperarioDashboard';
import { AdminDashboard } from './AdminDashboard';

export const DashboardRouter = () => {
  const { user } = useAuth();

  switch (user?.role) {
    case 'ADMIN':
      return <AdminDashboard />;
    case 'OPERARIO':
      return <OperarioDashboard />;
    case 'CLIENTE':
      return <ClienteDashboard />;
    default:
      return <div>Rol no reconocido.</div>;
  }
};
