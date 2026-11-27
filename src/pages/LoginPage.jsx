
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { loginUser } from "../services/authService";

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    try {
      setLoading(true);

      await loginUser(email.trim(), password);

      navigate("/dashboard", {
        replace: true
      });
    } catch (err) {
      const backendMessage = err.response?.data?.message;

      setError(
        typeof backendMessage === "string"
          ? backendMessage
          : err.message || "Login failed."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Fundoo Notes</h1>
        <h2>Login</h2>

        {location.state?.message && (
          <p className="success-message" role="status">
            {location.state.message}
          </p>
        )}

        {error && (
          <p className="error-message" role="alert">
            {error}
          </p>
        )}

        <label htmlFor="loginEmail">Email</label>
        <input
          id="loginEmail"
          type="email"
          value={email}
          onChange={event => setEmail(event.target.value)}
          required
        />

        <label htmlFor="loginPassword">Password</label>
        <input
          id="loginPassword"
          type="password"
          value={password}
          onChange={event => setPassword(event.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p>
          Don't have an account?{" "}
          <Link to="/register">Register</Link>
        </p>
        <p>
        <Link to="/forgot-password">Forgot Password?</Link>
        </p>

        <p>
          <Link to="/resend-verification">
            Resend Verification Email
          </Link>
        </p>
      </form>
    </main>
  );
}

export default LoginPage;
