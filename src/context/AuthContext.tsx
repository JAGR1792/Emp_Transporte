import { createContext, useContext, ReactNode, useState, useEffect } from 'react';

export type Role = 'ADMIN' | 'OPERARIO' | 'CLIENTE';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (role: Role) => void;
  logout: () => void;
}

const mockUsers: Record<Role, User> = {
  ADMIN: {
    id: 'USR-001',
    name: 'Carlos Gerente',
    email: 'carlos.admin@emp-transporte.com',
    role: 'ADMIN',
    avatar: 'https://i.pravatar.cc/150?u=admin'
  },
  OPERARIO: {
    id: 'USR-104',
    name: 'Ana Cajera',
    email: 'ana.cajera@emp-transporte.com',
    role: 'OPERARIO',
    avatar: 'https://i.pravatar.cc/150?u=operario'
  },
  CLIENTE: {
    id: 'CLI-899',
    name: 'Juan Perez',
    email: 'juan.perez@correo.com',
    role: 'CLIENTE',
    avatar: 'https://i.pravatar.cc/150?u=cliente'
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Rehydrate user from localStorage on mount
    const storedUser = localStorage.getItem('mock_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (role: Role) => {
    const selectedUser = mockUsers[role];
    setUser(selectedUser);
    localStorage.setItem('mock_user', JSON.stringify(selectedUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mock_user');
  };

  if (loading) return null; // Or a global spinner

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
