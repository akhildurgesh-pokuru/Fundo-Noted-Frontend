
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";

import {
  getUpcomingReminders,
  removeNoteReminder
} from "../services/reminderService";

import ReminderForm from "../components/ReminderForm";

import { getApiError } from "../utils/getApiError";
import { removeToken } from "../utils/token";

function RemindersPage() {
  const navigate = useNavigate();

  const [reminders, setReminders] = useState([]);
  const [editingReminder, setEditingReminder] = useState(null);

  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleError = useCallback(
    (err, fallback) => {
      if (err.response?.status === 401) {
        removeToken();
        navigate("/login", { replace: true });
        return;
      }

      setError(getApiError(err, fallback));
    },
    [navigate]
  );

  // Fetch real reminders from Spring Boot.
  const loadReminders = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getUpcomingReminders();

      // Show the nearest reminder first.
      const sorted = [...data].sort(
        (a, b) =>
          new Date(a.reminderAt).getTime() -
          new Date(b.reminderAt).getTime()
      );

      setReminders(sorted);
      return true;
    } catch (err) {
      handleError(err, "Unable to load reminders.");
      return false;
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  useEffect(() => {
    loadReminders();
  }, [loadReminders]);

  // Display the actual reminder date in local time.
  function formatReminderDate(reminderAt) {
    const date = new Date(reminderAt);

    if (Number.isNaN(date.getTime())) {
      return "Invalid reminder date";
    }

    return date.toLocaleString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit"
    });
  }

  // Remove a reminder without deleting the note.
  async function handleRemoveReminder(reminder) {
    const confirmed = window.confirm(
      `Remove reminder for "${
        reminder.title || "Untitled Note"
      }"?`
    );

    if (!confirmed) return;

    try {
      setBusyId(reminder.noteId);
      setError("");
      setMessage("");

      await removeNoteReminder(reminder.noteId);

      const loaded = await loadReminders();

      if (loaded) {
        setMessage("Reminder removed successfully.");
      }
    } catch (err) {
      handleError(err, "Unable to remove reminder.");
    } finally {
      setBusyId(null);
    }
  }

  // The existing ReminderForm can also update reminders.
  function handleEditReminder(reminder) {
    setEditingReminder(reminder);
    setError("");
    setMessage("");
  }

  async function handleReminderUpdated() {
    setEditingReminder(null);

    const loaded = await loadReminders();

    if (loaded) {
      setMessage("Reminder updated successfully!");
    }
  }

  return (
    <main className="dashboard-page">

      {/* Header and navigation */}
      <header className="dashboard-header">
        <h1>Fundoo Notes</h1>

        <div className="dashboard-actions">
          <Link
            to="/dashboard"
            className="profile-link"
          >
            My Notes
          </Link>

          <Link
            to="/labels"
            className="profile-link"
          >
            Manage Labels
          </Link>

          <Link
            to="/archive"
            className="profile-link"
          >
            Archive
          </Link>

          <Link
            to="/trash"
            className="profile-link"
          >
            Trash
          </Link>
        </div>
      </header>

      <section className="dashboard-content">
        <h2>Upcoming Reminders</h2>

        <p>
          View, update, or remove reminders for your notes.
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

        {loading ? (
          <p>Loading reminders...</p>
        ) : error ? (
          <button
            type="button"
            onClick={loadReminders}
          >
            Retry
          </button>
        ) : reminders.length === 0 ? (
          <div className="empty-notes">
            <h3>No upcoming reminders</h3>
            <p>
              Open My Notes and set a reminder for a note.
            </p>
          </div>
        ) : (
          <div className="reminders-grid">
            {reminders.map(reminder => (
              <article
                className="reminder-card"
                key={reminder.noteId}
              >
                <h3>
                  {reminder.title || "Untitled Note"}
                </h3>

                <p className="note-content">
                  {reminder.description || "No content"}
                </p>

                <p className="reminder-date">
                  Reminder:{" "}
                  {formatReminderDate(
                    reminder.reminderAt
                  )}
                </p>

                <div className="reminder-card-actions">
                  <button
                    type="button"
                    disabled={busyId !== null}
                    onClick={() =>
                      handleEditReminder(reminder)
                    }
                  >
                    Update Reminder
                  </button>

                  <button
                    type="button"
                    className="delete-button"
                    disabled={busyId !== null}
                    onClick={() =>
                      handleRemoveReminder(reminder)
                    }
                  >
                    {busyId === reminder.noteId
                      ? "Removing..."
                      : "Remove Reminder"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Update reminder modal */}
      {editingReminder && (
        <div className="note-modal-backdrop">
          <div
            className="note-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Update reminder"
          >
            <ReminderForm
              note={{
                id: editingReminder.noteId,
                title: editingReminder.title
              }}
              initialReminderAt={
                editingReminder.reminderAt
              }
              onSuccess={handleReminderUpdated}
              onCancel={() =>
                setEditingReminder(null)
              }
            />
          </div>
        </div>
      )}
    </main>
  );
}

export default RemindersPage;
