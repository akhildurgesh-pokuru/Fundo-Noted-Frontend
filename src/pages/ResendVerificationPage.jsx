import { useState } from "react";
import { Link } from "react-router";

import { resendVerificationEmail } from "../services/userService";
import { getApiError } from "../utils/getApiError";

function ResendVerificationPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setMessage("");

    try {
      setLoading(true);

      await resendVerificationEmail(email.trim());

      setMessage(
        "Request completed. Check Mailpit for a verification email."
      );
    } catch (err) {
      setError(
        getApiError(err, "Unable to request verification email.")
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Fundoo Notes</h1>
        <h2>Resend Verification Email</h2>

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

        <label htmlFor="resendEmail">Email</label>

        <input
          id="resendEmail"
          type="email"
          value={email}
          onChange={event => setEmail(event.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Resend Email"}
        </button>

        <p>
          <Link to="/login">Back to Login</Link>
        </p>
      </form>
    </main>
  );
}

export default ResendVerificationPage;