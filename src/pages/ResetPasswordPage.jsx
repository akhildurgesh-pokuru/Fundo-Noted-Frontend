
import { useState } from "react";
import {
  Link,
  useNavigate,
  useSearchParams
} from "react-router";

import { resetPassword } from "../services/userService";
import { getApiError } from "../utils/getApiError";

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [token, setToken] = useState(
    searchParams.get("token") ?? ""
  );

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");

    if (!token.trim()) {
      setError("Reset token is required.");
      return;
    }

    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      await resetPassword(token.trim(), password);

      navigate("/login", {
        replace: true,
        state: {
          message: "Password reset successful. Please log in."
        }
      });
    } catch (err) {
      setError(
        getApiError(err, "Unable to reset password.")
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Fundoo Notes</h1>
        <h2>Reset Password</h2>

        {error && (
          <p className="error-message" role="alert">
            {error}
          </p>
        )}

        <label htmlFor="resetToken">
          Password Reset Token
        </label>

        <input
          id="resetToken"
          type="text"
          value={token}
          onChange={event => setToken(event.target.value)}
          required
        />

        <label htmlFor="newPassword">
          New Password
        </label>

        <input
          id="newPassword"
          type="password"
          value={password}
          onChange={event => setPassword(event.target.value)}
          minLength={8}
          required
        />

        <label htmlFor="confirmNewPassword">
          Confirm New Password
        </label>

        <input
          id="confirmNewPassword"
          type="password"
          value={confirmPassword}
          onChange={event =>
            setConfirmPassword(event.target.value)
          }
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Resetting..." : "Reset Password"}
        </button>

        <p>
          <Link to="/login">Back to Login</Link>
        </p>
      </form>
    </main>
  );
}

export default ResetPasswordPage;
