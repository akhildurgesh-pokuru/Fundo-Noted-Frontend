
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";

import { getApiError } from "../utils/getApiError";
import { removeToken } from "../utils/token";

import LoadingState from "./ui/LoadingState";
import EmptyState from "./ui/EmptyState";
import StatusMessage from "./ui/StatusMessage";

function OrganizedNotesPage({ title, loadNotes, actions }) {
  const navigate = useNavigate();

  const [notes, setNotes] = useState([]);
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

  // Load real archived or trashed notes from Spring Boot.
  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const result = await loadNotes();
      setNotes(result);

      return true;
    } catch (err) {
      handleError(err, "Unable to load notes.");
      return false;
    } finally {
      setLoading(false);
    }
  }, [loadNotes, handleError]);

  useEffect(() => {
    load();
  }, [load]);

  // Restore, unarchive, or permanently delete a note.
  async function handleAction(action, note) {
    if (
      action.confirm &&
      !window.confirm(
        `${action.label} "${note.title || "Untitled Note"}"?`
      )
    ) {
      return;
    }

    try {
      setBusyId(note.id);
      setError("");
      setMessage("");

      await action.run(note.id);

      const loaded = await load();

      if (loaded) {
        setMessage(`${action.label} completed successfully.`);
      }
    } catch (err) {
      handleError(err, "Unable to complete action.");
    } finally {
      setBusyId(null);
    }
  }

  const emptyDescription =
    title === "Trash"
      ? "Notes moved to Trash will appear here."
      : "Archived notes will appear here.";

  return (
    <main className="dashboard-page">
      <header className="dashboard-header">
        <h1>Fundoo Notes</h1>

        <nav
          className="dashboard-actions"
          aria-label="Page navigation"
        >
          <Link to="/dashboard" className="profile-link">
            Back to Notes
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
        <h2>{title}</h2>

        {/* UC9 - Error feedback */}
        {error && (
          <StatusMessage type="error">
            {error}
          </StatusMessage>
        )}

        {/* UC9 - Success feedback */}
        {message && (
          <StatusMessage type="success">
            {message}
          </StatusMessage>
        )}

        {/* UC9 - Loading / Empty / Notes */}
        {loading ? (
          <LoadingState
            message={`Loading ${title.toLowerCase()}...`}
          />
        ) : error ? (
          <button type="button" onClick={load}>
            Retry
          </button>
        ) : notes.length === 0 ? (
          <EmptyState
            title={`No notes in ${title}`}
            description={emptyDescription}
          />
        ) : (
          <div className="notes-grid">
            {notes.map(note => (
              <article
                className="note-card"
                key={note.id}
              >
                <h3>
                  {note.title || "Untitled Note"}
                </h3>

                <p className="note-content">
                  {note.content || "No content"}
                </p>

                <div className="note-card-actions">
                  {actions.map(action => (
                    <button
                      key={action.label}
                      type="button"
                      disabled={busyId !== null}
                      onClick={() =>
                        handleAction(action, note)
                      }
                    >
                      {busyId === note.id
                        ? "Processing..."
                        : action.label}
                    </button>
                  ))}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default OrganizedNotesPage;
