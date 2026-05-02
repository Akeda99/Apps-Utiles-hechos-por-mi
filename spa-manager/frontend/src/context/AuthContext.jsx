import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,  setUser]  = useState(() => {
    try { return JSON.parse(localStorage.getItem('spa_user')); } catch { return null; }
  });
  const [token, setToken] = useState(() => localStorage.getItem('spa_token'));

  function login(userData, tokenData) {
    setUser(userData);
    setToken(tokenData);
    localStorage.setItem('spa_user',  JSON.stringify(userData));
    localStorage.setItem('spa_token', tokenData);
  }

  function logout() {
    setUser(null);
    setToken(null);
    localStorage.removeItem('spa_user');
    localStorage.removeItem('spa_token');
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
