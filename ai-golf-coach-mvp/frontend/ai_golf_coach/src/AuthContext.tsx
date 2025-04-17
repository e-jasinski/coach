import { createContext, useState, useContext, ReactNode } from 'react';

export interface AuthContextType {
  token: string;
  login: (jwt: string) => void;
  logout: () => void;
}

const AuthCtx = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error('useAuth must be inside <AuthProvider/>');
  return ctx;
};

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string>(() => localStorage.getItem('jwt') || '');

  const login = (jwt: string) => {
    setToken(jwt);
    localStorage.setItem('jwt', jwt);
  };

  const logout = () => {
    setToken('');
    localStorage.removeItem('jwt');
  };

  return (
    <AuthCtx.Provider value={{ token, login, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}