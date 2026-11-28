
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";

import NoteForm from "../components/NoteForm";
import NoteCard from "../components/NoteCard";
import ReminderForm from "../components/ReminderForm";

import {
  getNotes,
  createNote,
  updateNote,
  searchNotes
} from "../services/noteService";

import {
  pinNote,
  unpinNote,
  archiveNote,
  trashNote
} from "../services/noteOrganizationService";

import { logoutUser } from "../services/authService";
import { getApiError } from "../utils/getApiError";
import { removeToken } from "../utils/token";

function DashboardPage() {
  const navigate = useNavigate();

  // Notes state
  const [notes, setNotes] = useState([]);
  const [editingNote, setEditingNote] = useState(null);
  const [viewingNote, setViewingNote] = useState(null);
  const [reminderNote, setReminderNote] = useState(null);

  // UC5: Search state
  const [searchKeyword, setSearchKeyword] = useState("");
  const [activeSearch, setActiveSearch] = useState("");

  // UI state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Handle API errors
  const handleApiError = useCallback(
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

  // Load real notes from Spring Boot.
  // If a search is active, load matching notes.
  const loadNotes = useCallback(
    async (keyword = "") => {
      try {
        setLoading(true);
        setError("");

        const searchText = keyword.trim();

        const data = searchText
          ? await searchNotes(searchText)
          : await getNotes();

        setNotes(data);

        return true;
      } catch (err) {
        handleApiError(err, "Unable to load notes.");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [handleApiError]
  );

  // Load notes when dashboard opens.
  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  // Refresh the currently displayed list after mutations.
  async function refreshNotes() {
    return loadNotes(activeSearch);
  }

  // UC5: Search notes
  async function handleSearch(event) {
    event.preventDefault();

    const keyword = searchKeyword.trim();

    setMessage("");

    const successful = await loadNotes(keyword);

    if (successful) {
      setActiveSearch(keyword);
    }
  }

  // UC5: Clear search
  async function handleClearSearch() {
    setSearchKeyword("");
    setActiveSearch("");
    setMessage("");

    await loadNotes();
  }

  // UC4: Pin / Unpin
  async function handlePin(note) {
    try {
      setError("");
      setMessage("");

      if (note.pinned) {
        await unpinNote(note.id);
      } else {
        await pinNote(note.id);
      }

      await refreshNotes();
    } catch (err) {
      handleApiError(err, "Unable to change pin status.");
    }
  }

  // UC4: Archive
  async function handleArchive(note) {
    try {
      setError("");
      setMessage("");

      await archiveNote(note.id);

      const loaded = await refreshNotes();

      if (loaded) {
        setMessage("Note archived successfully.");
      }
    } catch (err) {
      handleApiError(err, "Unable to archive note.");
    }
  }

  // UC4: Move to Trash
  async function handleTrash(note) {
    const confirmed = window.confirm(
      `Move "${note.title || "Untitled Note"}" to Trash?`
    );

    if (!confirmed) return;

    try {
      setError("");
      setMessage("");

      await trashNote(note.id);

      const loaded = await refreshNotes();

      if (loaded) {
        setMessage("Note moved to Trash.");
      }
    } catch (err) {
      handleApiError(err, "Unable to move note to Trash.");
    }
  }

  // UC3: Create Note
  async function handleCreate(form) {
    try {
      setError("");
      setMessage("");

      await createNote(form);

      const loaded = await refreshNotes();

      if (!loaded) {
        throw new Error(
          "Note was saved, but the notes list could not be refreshed."
        );
      }

      setMessage("Note created successfully!");
    } catch (err) {
      handleApiError(err, "Unable to create note.");
      throw err;
    }
  }

  // UC3: Update Note
  async function handleUpdate(form) {
    if (!editingNote) return;

    try {
      setError("");
      setMessage("");

      await updateNote(editingNote.id, form);

      const loaded = await refreshNotes();

      if (!loaded) {
        throw new Error(
          "Note was updated, but the notes list could not be refreshed."
        );
      }

      setEditingNote(null);
      setMessage("Note updated successfully!");
    } catch (err) {
      handleApiError(err, "Unable to update note.");
      throw err;
    }
  }

  // Logout
  function handleLogout() {
    logoutUser();
    navigate("/login", { replace: true });
  }

  // Show only active notes, with pinned notes first.
  const visibleNotes = [...notes]
    .filter(note => !note.archived && !note.trashed)
    .sort(
      (a, b) => Number(b.pinned) - Number(a.pinned)
    );

  return (
    <main className="dashboard-page">

      {/* Navigation */}
      <header className="dashboard-header">
        <h1>Fundoo Notes</h1>

        <div className="dashboard-actions">
          <Link to="/profile" className="profile-link">
            My Profile
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

          <Link to="/reminders" className="profile-link">
            Reminders
          </Link>

          <Link to="/csv" className="profile-link">
            Import / Export
          </Link>

          <button type="button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <section className="dashboard-content">
        <h2>My Notes</h2>

        {/* UC5: Search Notes */}
        <form
          className="notes-search-form"
          onSubmit={handleSearch}
        >
          <input
            type="search"
            placeholder="Search notes by title or description..."
            value={searchKeyword}
            onChange={event =>
              setSearchKeyword(event.target.value)
            }
          />

          <button
            type="submit"
            disabled={loading}
          >
            Search
          </button>

          <button
            type="button"
            onClick={handleClearSearch}
            disabled={loading}
          >
            Clear
          </button>
        </form>

        {/* Current search indicator */}
        {activeSearch && (
          <p>
            Showing results for: <strong>{activeSearch}</strong>
          </p>
        )}

        {/* UC3: Create Note */}
        <NoteForm onSave={handleCreate} />

        {/* Error */}
        {error && (
          <p className="error-message" role="alert">
            {error}
          </p>
        )}

        {/* Success */}
        {message && (
          <p className="success-message" role="status">
            {message}
          </p>
        )}

        {/* Notes list */}
        {loading ? (
          <p>Loading notes...</p>
        ) : error ? (
          <button
            type="button"
            onClick={() => loadNotes(activeSearch)}
          >
            Retry Loading Notes
          </button>
        ) : visibleNotes.length === 0 ? (
          <div className="empty-notes">
            {activeSearch ? (
              <>
                <h3>No matching notes found</h3>
                <p>
                  No active notes match "{activeSearch}".
                </p>
              </>
            ) : (
              <>
                <h3>No notes yet</h3>
                <p>Create your first note above.</p>
              </>
            )}
          </div>
        ) : (
          <div className="notes-grid">
            {visibleNotes.map(note => (
              <NoteCard
              key={note.id}
              note={note}
              onView={setViewingNote}
              onEdit={setEditingNote}
              onPin={handlePin}
              onArchive={handleArchive}
              onTrash={handleTrash}
              onReminder={setReminderNote}
            />
            ))}
          </div>
        )}
      </section>

      {/* UC3: View Full Note */}
      {viewingNote && (
        <div className="note-modal-backdrop">
          <div
            className="note-modal"
            role="dialog"
            aria-modal="true"
            aria-label="View note"
          >
            <h2>
              {viewingNote.title || "Untitled Note"}
            </h2>

            <p className="note-content">
              {viewingNote.content || "No content"}
            </p>

            <div className="note-form-actions">
              <button
                type="button"
                onClick={() => {
                  setEditingNote(viewingNote);
                  setViewingNote(null);
                }}
              >
                Edit
              </button>

              <button
                type="button"
                onClick={() => setViewingNote(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UC3: Edit Note */}
      {editingNote && (
        <div className="note-modal-backdrop">
          <div
            className="note-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Edit note"
          >
            <h2>Edit Note</h2>

            <NoteForm
              key={editingNote.id}
              initialNote={editingNote}
              onSave={handleUpdate}
              onCancel={() => setEditingNote(null)}
            />
          </div>
        </div>
      )}

      {reminderNote && (
        <div className="note-modal-backdrop">
          <div
            className="note-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Set note reminder"
          >
            <ReminderForm
              note={reminderNote}
              onSuccess={() => {
                setReminderNote(null);
                setMessage("Reminder saved successfully!");
              }}
              onCancel={() => setReminderNote(null)}
            />
          </div>
        </div>
      )}
    </main>
  );
}

export default DashboardPage;
