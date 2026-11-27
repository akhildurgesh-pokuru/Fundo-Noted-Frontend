import { useState } from "react";
import { Link } from "react-router";

import { forgotPassword } from "../services/userService";
import { getApiError } from "../utils/getApiError";

function ForgotPasswordPage() {
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

      await forgotPassword(email.trim());

      setMessage(
        "Request received. If the account is eligible, check your email for reset instructions."
      );
    } catch (err) {
      // Avoid showing account-existence details for requests
      // the backend treats as accepted.
      setError(
        getApiError(err, "Unable to request password reset.")
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Fundoo Notes</h1>
        <h2>Forgot Password</h2>

        <p>
          Enter your email to request a password reset.
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

        <label htmlFor="forgotEmail">Email</label>

        <input
          id="forgotEmail"
          type="email"
          value={email}
          onChange={event => setEmail(event.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Request Reset"}
        </button>

        <p>
          <Link to="/login">Back to Login</Link>
        </p>
      </form>
    </main>
  );
}

export default ForgotPasswordPage;