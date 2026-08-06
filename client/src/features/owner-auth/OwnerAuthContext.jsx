import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { fetchOwnerSession, loginOwner, logoutOwner } from '../../api/ownerAuth.js';

const OwnerAuthContext = createContext(null);

export function OwnerAuthProvider({ children }) {
  const [owner, setOwner] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);

  const refreshSession = useCallback(async () => {
    try {
      const data = await fetchOwnerSession();
      setOwner(data.authenticated ? data.owner : null);
    } catch {
      setOwner(null);
    } finally {
      setCheckingSession(false);
    }
  }, []);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  async function login(email, password) {
    const data = await loginOwner(email, password);
    setOwner(data.owner);
    return data;
  }

  async function logout() {
    await logoutOwner();
    setOwner(null);
  }

  return (
    <OwnerAuthContext.Provider value={{ owner, checkingSession, login, logout, isAuthenticated: !!owner }}>
      {children}
    </OwnerAuthContext.Provider>
  );
}

export function useOwnerAuth() {
  const ctx = useContext(OwnerAuthContext);
  if (!ctx) throw new Error('useOwnerAuth must be used within an OwnerAuthProvider');
  return ctx;
}
