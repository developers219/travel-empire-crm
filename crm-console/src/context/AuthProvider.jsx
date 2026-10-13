import { useCallback, useEffect, useMemo, useState } from "react";
import { AuthContext } from "./authContext.js";
import { getMe } from "../api/authApi.js";
import { TOKEN_KEY } from "../api/http.js";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      if (!localStorage.getItem(TOKEN_KEY)) {
        setChecking(false);
        return;
      }
      try {
        setUser(await getMe());
      } catch {
        setUser(null);
      } finally {
        setChecking(false);
      }
    };
    restoreSession();
  }, []);

  useEffect(() => {
    const handleExpired = () => setUser(null);
    window.addEventListener("auth:expired", handleExpired);
    return () => window.removeEventListener("auth:expired", handleExpired);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, checking, setUser, logout }),
    [user, checking, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
