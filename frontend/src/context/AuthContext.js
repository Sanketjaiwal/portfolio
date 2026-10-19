import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'react-toastify';

const AuthContext = createContext();

const INACTIVE_MS = 2 * 60 * 1000;   // 2 minutes
const WARN_MS     = 30 * 1000;        // warn 30s before logout

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const inactiveTimer = useRef(null);
  const warnTimer     = useRef(null);
  const warnToastId   = useRef(null);

  const login  = (t) => { localStorage.setItem('token', t); setToken(t); };
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    clearTimeout(inactiveTimer.current);
    clearTimeout(warnTimer.current);
    if (warnToastId.current) toast.dismiss(warnToastId.current);
  }, []);

  const resetTimers = useCallback(() => {
    if (!localStorage.getItem('token')) return;
    clearTimeout(inactiveTimer.current);
    clearTimeout(warnTimer.current);
    if (warnToastId.current) { toast.dismiss(warnToastId.current); warnToastId.current = null; }

    // warn 30s before logout
    warnTimer.current = setTimeout(() => {
      warnToastId.current = toast.warn('⚠️ Session expiring in 30 seconds due to inactivity...', {
        autoClose: WARN_MS,
        toastId: 'session-warn',
      });
    }, INACTIVE_MS - WARN_MS);

    // auto logout after 2 min
    inactiveTimer.current = setTimeout(() => {
      toast.error('Session expired due to inactivity.');
      logout();
      setTimeout(() => window.location.href = '/login', 1500);
    }, INACTIVE_MS);
  }, [logout]);

  // Start/stop timers based on login state
  useEffect(() => {
    if (!token) return;
    resetTimers();

    const events = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
    events.forEach(e => window.addEventListener(e, resetTimers, { passive: true }));
    return () => {
      clearTimeout(inactiveTimer.current);
      clearTimeout(warnTimer.current);
      events.forEach(e => window.removeEventListener(e, resetTimers));
    };
  }, [token, resetTimers]);

  return (
    <AuthContext.Provider value={{ token, login, logout, isAuth: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
