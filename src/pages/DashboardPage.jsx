
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";

import NoteForm from "../components/NoteForm";
import NoteCard from "../components/NoteCard";

import {
  getNotes,
  createNote,
  updateNote,
  deleteNote
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

  const [notes, setNotes] = useState([]);
  const [editingNote, setEditingNote] = useState(null);
  const [viewingNote, setViewingNote] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

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

  const loadNotes = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getNotes();
      setNotes(data);
    } catch (err) {
      handleApiError(err, "Unable to load notes.");
    } finally {
      setLoading(false);
    }
  }, [handleApiError]);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  async function handlePin(note) {
    try {
      setError("");
      setMessage("");
  
      if (note.pinned) {
        await unpinNote(note.id);
      } else {
        await pinNote(note.id);
      }
  
      await loadNotes();
    } catch (err) {
      handleApiError(err, "Unable to change pin status.");
    }
  }
  
  async function handleArchive(note) {
    try {
      setError("");
      setMessage("");
  
      await archiveNote(note.id);
      await loadNotes();
  
      setMessage("Note archived successfully.");
    } catch (err) {
      handleApiError(err, "Unable to archive note.");
    }
  }
  
  async function handleTrash(note) {
    const confirmed = window.confirm(
      `Move "${note.title || "Untitled Note"}" to Trash?`
    );
  
    if (!confirmed) return;
  
    try {
      setError("");
      setMessage("");
  
      await trashNote(note.id);
      await loadNotes();
  
      setMessage("Note moved to Trash.");
    } catch (err) {
      handleApiError(err, "Unable to move note to Trash.");
    }
  }

  async function handleCreate(form) {
    try {
      setError("");
      setMessage("");

      await createNote(form);
      await loadNotes();

      setMessage("Note created successfully!");
    } catch (err) {
      handleApiError(err, "Unable to create note.");
      throw new Error("Note could not be saved.");
    }
  }

  async function handleUpdate(form) {
    if (!editingNote) return;

    try {
      setError("");
      setMessage("");

      await updateNote(editingNote.id, form);
      await loadNotes();

      setEditingNote(null);
      setMessage("Note updated successfully!");
    } catch (err) {
      handleApiError(err, "Unable to update note.");
      throw new Error("Note could not be updated.");
    }
  }

  async function handleDelete(note) {
    const confirmed = window.confirm(
      `Delete "${note.title || "Untitled Note"}"?`
    );

    if (!confirmed) return;

    try {
      setError("");
      setMessage("");

      await deleteNote(note.id);
      await loadNotes();

      setMessage("Delete request completed.");
    } catch (err) {
      handleApiError(err, "Unable to delete note.");
    }
  }

  function handleLogout() {
    logoutUser();
    navigate("/login", { replace: true });
  }

  const visibleNotes = notes
  .filter(note => !note.archived && !note.trashed)
  .sort((a, b) => Number(b.pinned) - Number(a.pinned));

  return (
    <main className="dashboard-page">
      <header className="dashboard-header">
        <h1>Fundoo Notes</h1>

        <div className="dashboard-actions">
          <Link to="/profile" className="profile-link">
            My Profile
          </Link>

          <Link to="/archive" className="profile-link">
            Archive
          </Link>

          <Link to="/trash" className="profile-link">
            Trash
          </Link>

          <button onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <section className="dashboard-content">
        <h2>My Notes</h2>

        <NoteForm onSave={handleCreate} />

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
          <button onClick={loadNotes}>
            Retry Loading Notes
          </button>
        ) : visibleNotes.length === 0 ? (
          <div className="empty-notes">
            <h3>No notes yet</h3>
            <p>Create your first note above.</p>
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
          />
        ))}
      </div>
        )}
      </section>

      {viewingNote && (
  <div className="note-modal-backdrop">
    <div
      className="note-modal"
      role="dialog"
      aria-modal="true"
      aria-label="View note"
    >
      <h2>{viewingNote.title || "Untitled Note"}</h2>

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
    </main>
  );
}

export default DashboardPage;
