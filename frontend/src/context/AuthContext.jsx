import { createContext, useContext, useEffect, useState } from 'react';
import api from '../lib/api';
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => { try { return JSON.parse(localStorage.getItem('portfolio_admin_user') || 'null'); } catch { return null; } });
  const [checking, setChecking] = useState(Boolean(localStorage.getItem('portfolio_admin_token')));
  useEffect(() => {
    const expired = () => { setUser(null); setChecking(false); };
    window.addEventListener('admin-session-expired', expired);
    if (localStorage.getItem('portfolio_admin_token')) api.get('/auth/me').then(({ data }) => { setUser(data.admin); localStorage.setItem('portfolio_admin_user', JSON.stringify(data.admin)); }).catch(() => setUser(null)).finally(() => setChecking(false));
    return () => window.removeEventListener('admin-session-expired', expired);
  }, []);
  async function login(email, password) { const { data } = await api.post('/auth/login', { email, password }); localStorage.setItem('portfolio_admin_token', data.token); localStorage.setItem('portfolio_admin_user', JSON.stringify(data.admin)); setUser(data.admin); return data.admin; }
  function logout() { localStorage.removeItem('portfolio_admin_token'); localStorage.removeItem('portfolio_admin_user'); setUser(null); }
  function updateUser(nextUser) { setUser(nextUser); localStorage.setItem('portfolio_admin_user', JSON.stringify(nextUser)); }
  return <AuthContext.Provider value={{ user, checking, login, logout, updateUser }}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
