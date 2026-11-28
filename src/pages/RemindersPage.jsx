
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";

import {
  getUpcomingReminders,
  removeNoteReminder
} from "../services/reminderService";

import ReminderForm from "../components/ReminderForm";

import LoadingState from "../components/ui/LoadingState";
import EmptyState from "../components/ui/EmptyState";
import StatusMessage from "../components/ui/StatusMessage";
import Modal from "../components/ui/Modal";

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

  // Load real upcoming reminders.
  const loadReminders = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getUpcomingReminders();

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

  // Convert UTC reminder time to browser local time.
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

  // Delete the reminder without deleting its note.
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

  // Open Update Reminder modal.
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

      <header className="dashboard-header">
        <h1>Fundoo Notes</h1>

        <nav
          className="dashboard-actions"
          aria-label="Page navigation"
        >
          <Link to="/dashboard" className="profile-link">
            My Notes
          </Link>

          <Link to="/labels" className="profile-link">
            Manage Labels
          </Link>

          <Link to="/archive" className="profile-link">
            Archive
          </Link>

          <Link to="/trash" className="profile-link">
            Trash
          </Link>
        </nav>
      </header>

      <section className="dashboard-content">
        <h2>Upcoming Reminders</h2>

        <p>
          View, update, or remove reminders for your notes.
        </p>

        {/* UC9 - Error */}
        {error && (
          <StatusMessage type="error">
            {error}
          </StatusMessage>
        )}

        {/* UC9 - Success */}
        {message && (
          <StatusMessage type="success">
            {message}
          </StatusMessage>
        )}

        {/* UC9 - Loading / Empty / Reminders */}
        {loading ? (
          <LoadingState
            message="Loading upcoming reminders..."
          />
        ) : error ? (
          <button
            type="button"
            onClick={loadReminders}
          >
            Retry
          </button>
        ) : reminders.length === 0 ? (
          <EmptyState
            title="No upcoming reminders"
            description="Open My Notes and set a reminder for a future date."
          />
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
                  {formatReminderDate(reminder.reminderAt)}
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

      {/* UC9 - Accessible Update Reminder modal */}
      {editingReminder && (
        <Modal
          title="Update reminder"
          onClose={() => setEditingReminder(null)}
        >
          <ReminderForm
            key={editingReminder.noteId}
            note={{
              id: editingReminder.noteId,
              title: editingReminder.title
            }}
            initialReminderAt={editingReminder.reminderAt}
            onSuccess={handleReminderUpdated}
            onCancel={() =>
              setEditingReminder(null)
            }
          />
        </Modal>
      )}
    </main>
  );
}

export default RemindersPage;
