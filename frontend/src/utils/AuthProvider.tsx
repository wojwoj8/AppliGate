import { ReactNode, createContext, useState } from 'react';

interface AuthProviderProps {
  children: ReactNode;
}

interface AuthContextData {
  user: any;
  authTokens: any;
  loginUser: (e: React.FormEvent<HTMLFormElement>) => void;
  logoutUser: (e: React.MouseEvent<HTMLParagraphElement>) => void;
}

const AuthContext = createContext<AuthContextData>({
  user: null,
  authTokens: null,
  loginUser: (e: React.FormEvent<HTMLFormElement>) => {},
  logoutUser: (e: React.MouseEvent<HTMLParagraphElement>) => {},
});

export default AuthContext;

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState({username: 'test'});
  const [authTokens, setAuthTokens] = useState(null);

  const loginUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const logoutUser = (e: React.MouseEvent<HTMLParagraphElement>) => {
    e.preventDefault();
  };

  const contextData: AuthContextData = {
    user,
    authTokens,
    loginUser,
    logoutUser,
  };

  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
};