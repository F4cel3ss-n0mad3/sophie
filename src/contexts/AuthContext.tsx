import React, { createContext, useContext, useEffect, useState } from 'react';

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'affiliate';
  fullName: string;
  createdAt: string;
  paypalEmail?: string;
  slug?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string, role: 'admin' | 'affiliate') => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Mock users for development
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@example.com',
    role: 'admin',
    fullName: 'Admin User',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    email: 'affiliate@example.com',
    role: 'affiliate',
    fullName: 'John Affiliate',
    createdAt: '2024-01-01T00:00:00Z',
    paypalEmail: 'affiliate@paypal.com',
    slug: 'john-affiliate',
  },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Mock login - in real app, this would call Supabase auth
    const foundUser = mockUsers.find(u => u.email === email);
    if (foundUser && password === 'password') {
      setUser(foundUser);
      localStorage.setItem('user', JSON.stringify(foundUser));
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const register = async (email: string, password: string, fullName: string, role: 'admin' | 'affiliate') => {
    // Mock registration - in real app, this would call Supabase auth
    const newUser: User = {
      id: Date.now().toString(),
      email,
      role,
      fullName,
      createdAt: new Date().toISOString(),
      ...(role === 'affiliate' && {
        slug: fullName.toLowerCase().replace(/\s+/g, '-'),
      }),
    };
    
    mockUsers.push(newUser);
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}