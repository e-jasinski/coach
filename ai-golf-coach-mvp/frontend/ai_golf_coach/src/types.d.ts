export interface AuthContextType {
    token: string;
    login: (jwt: string) => void;
    logout: () => void;
  }
  