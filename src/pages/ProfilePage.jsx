import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  getUserProfile,
  updateUserProfile
} from "../services/userService";
import { getApiError } from "../utils/getApiError";
import { removeToken } from "../utils/token";

function ProfilePage() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({
    firstName: "",
    lastName: ""
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      try {
        const data = await getUserProfile();

        if (!active) return;

        setProfile(data);
        setForm({
          firstName: data.firstName ?? "",
          lastName: data.lastName ?? ""
        });
      } catch (err) {
        if (!active) return;

        if (err.response?.status === 401) {
          removeToken();
          navigate("/login", { replace: true });
          return;
        }

        setError(
          getApiError(err, "Unable to load your profile.")
        );
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProfile();

    return () => {
      active = false;
    };
  }, [navigate]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!form.firstName.trim() || !form.lastName.trim()) {
      setError("First name and last name are required.");
      return;
    }

    try {
      setSaving(true);

      await updateUserProfile({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim()
      });

      // Reload the real saved values from Spring Boot.
      const updated = await getUserProfile();

      setProfile(updated);
      setForm({
        firstName: updated.firstName ?? "",
        lastName: updated.lastName ?? ""
      });

      setMessage("Profile updated successfully!");
    } catch (err) {
      if (err.response?.status === 401) {
        removeToken();
        navigate("/login", { replace: true });
        return;
      }

      setError(
        getApiError(err, "Unable to update your profile.")
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <main className="profile-page">Loading profile...</main>;
  }

  if (!profile) {
    return (
      <main className="profile-page">
        <p role="alert">{error || "Profile not available."}</p>
        <Link to="/dashboard">Back to Dashboard</Link>
      </main>
    );
  }

  return (
    <main className="profile-page">
      <Link to="/dashboard">Back to Dashboard</Link>

      <h1>My Profile</h1>

      <div className="profile-card">
        <p>
          <strong>Email:</strong> {profile.email}
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

        <form onSubmit={handleSubmit}>
          <label htmlFor="profileFirstName">
            First Name
          </label>

          <input
            id="profileFirstName"
            value={form.firstName}
            onChange={event =>
              setForm(previous => ({
                ...previous,
                firstName: event.target.value
              }))
            }
            required
          />

          <label htmlFor="profileLastName">
            Last Name
          </label>

          <input
            id="profileLastName"
            value={form.lastName}
            onChange={event =>
              setForm(previous => ({
                ...previous,
                lastName: event.target.value
              }))
            }
            required
          />

          <button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Update Profile"}
          </button>
        </form>

        <p>
          <Link to="/resend-verification">
            Resend verification email
          </Link>
        </p>
      </div>
    </main>
  );
}

export default ProfilePage;
