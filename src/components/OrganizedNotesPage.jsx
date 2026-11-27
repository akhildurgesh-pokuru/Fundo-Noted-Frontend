
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";

import { getApiError } from "../utils/getApiError";
import { removeToken } from "../utils/token";

function OrganizedNotesPage({
  title,
  loadNotes,
  actions
}) {
  const navigate = useNavigate();

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await loadNotes();
      setNotes(result);
    } catch (err) {
      if (err.response?.status === 401) {
        removeToken();
        navigate("/login", { replace: true });
        return;
      }

      setError(getApiError(err, "Unable to load notes."));
    } finally {
      setLoading(false);
    }
  }, [loadNotes, navigate]);

  useEffect(() => {
    load();
  }, [load]);

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
      await load();

      setMessage(`${action.label} completed successfully.`);
    } catch (err) {
      if (err.response?.status === 401) {
        removeToken();
        navigate("/login", { replace: true });
        return;
      }

      setError(getApiError(err, "Unable to complete action."));
    } finally {
      setBusyId(null);
    }
  }

  return (
    <main className="dashboard-page">
      <header className="dashboard-header">
        <h1>Fundoo Notes</h1>
        <Link to="/dashboard">Back to Notes</Link>
      </header>

      <section className="dashboard-content">
        <h2>{title}</h2>

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
          <p>Loading notes...</p>
        ) : error ? (
          <button onClick={load}>Retry</button>
        ) : notes.length === 0 ? (
          <p>No notes found in {title.toLowerCase()}.</p>
        ) : (
          <div className="notes-grid">
            {notes.map(note => (
              <article className="note-card" key={note.id}>
                <h3>{note.title || "Untitled Note"}</h3>

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
