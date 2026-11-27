import { useState } from "react";
import { Link, useSearchParams } from "react-router";

import { verifyUserEmail } from "../services/userService";
import { getApiError } from "../utils/getApiError";

function VerifyEmailPage() {
  const [searchParams] = useSearchParams();

  const [token, setToken] = useState(
    searchParams.get("token") ?? ""
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function handleVerify(event) {
    event.preventDefault();

    setError("");
    setMessage("");

    if (!token.trim()) {
      setError("Enter a verification token.");
      return;
    }

    try {
      setLoading(true);

      await verifyUserEmail(token.trim());

      setMessage("Email verified successfully!");
    } catch (err) {
      setError(
        getApiError(err, "Email verification failed.")
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={handleVerify}>
        <h1>Fundoo Notes</h1>
        <h2>Verify Email</h2>

        <p>
          Use the verification token sent to your email.
        </p>

        {error && (
          <p className="error-message" role="alert">
            {error}
          </p>
        )}

        {message && (
          <p className="success-message" role="status">
            {message}
          </p>
        )}

        <label htmlFor="verifyToken">
          Verification Token
        </label>

        <input
          id="verifyToken"
          value={token}
          onChange={event => setToken(event.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Verifying..." : "Verify Email"}
        </button>

        <p>
          <Link to="/login">Back to Login</Link>
        </p>
      </form>
    </main>
  );
}

export default VerifyEmailPage;