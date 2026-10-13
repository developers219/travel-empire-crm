import { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { login } from "../api/authApi.js";
import { TOKEN_KEY } from "../api/http.js";
import { useAuth } from "../hooks/useAuth.js";
import Button from "../components/ui/Button.jsx";

export default function Login() {
  const { user, setUser } = useAuth();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || "/leads";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (user) return <Navigate to={redirectTo} replace />;

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setSubmitting(true);
      setError("");
      const data = await login(email, password);
      localStorage.setItem(TOKEN_KEY, data.token);
      setUser(data.user);
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-page p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-card border border-line bg-white p-8"
      >
        <h1 className="text-[26px] font-bold">Sign in</h1>
        <p className="mb-6 text-[13px] text-muted">Travel Empire CRM</p>

        <label className="mb-1 block text-[13px] font-semibold">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4 h-10 w-full rounded-control border border-line px-3 outline-none focus:border-brand"
        />

        <label className="mb-1 block text-[13px] font-semibold">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4 h-10 w-full rounded-control border border-line px-3 outline-none focus:border-brand"
        />

        {error && (
          <p className="mb-4 rounded-control border border-danger/30 bg-danger/5 p-3 text-[13px] text-danger">
            {error}
          </p>
        )}

        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? "Signing in..." : "Log in"}
        </Button>
      </form>
    </div>
  );
}
