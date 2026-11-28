
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";

import NoteForm from "../components/NoteForm";
import NoteCard from "../components/NoteCard";
import ReminderForm from "../components/ReminderForm";

// UC9 - Reusable UI components
import LoadingState from "../components/ui/LoadingState";
import EmptyState from "../components/ui/EmptyState";
import StatusMessage from "../components/ui/StatusMessage";
import Modal from "../components/ui/Modal";

// UC3 and UC5 - Notes CRUD and Search
import {
  getNotes,
  createNote,
  updateNote,
  searchNotes
} from "../services/noteService";

// UC4 - Notes Organization
import {
  pinNote,
  unpinNote,
  archiveNote,
  trashNote
} from "../services/noteOrganizationService";

// Authentication and Error Handling
import { logoutUser } from "../services/authService";
import { getApiError } from "../utils/getApiError";
import { removeToken } from "../utils/token";

function DashboardPage() {
  const navigate = useNavigate();

  // -----------------------------
  // Notes State
  // -----------------------------

  const [notes, setNotes] = useState([]);

  const [editingNote, setEditingNote] = useState(null);
  const [viewingNote, setViewingNote] = useState(null);
  const [reminderNote, setReminderNote] = useState(null);

  // -----------------------------
  // UC5 - Search State
  // -----------------------------

  const [searchKeyword, setSearchKeyword] = useState("");
  const [activeSearch, setActiveSearch] = useState("");

  // -----------------------------
  // UI State
  // -----------------------------

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // -----------------------------
  // Handle API Errors
  // -----------------------------

  const handleApiError = useCallback(
    (err, fallback) => {
      if (err.response?.status === 401) {
        removeToken();

        navigate("/login", {
          replace: true
        });

        return;
      }

      setError(getApiError(err, fallback));
    },
    [navigate]
  );

  // -----------------------------
  // Load Notes From Spring Boot
  // -----------------------------

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
        handleApiError(
          err,
          "Unable to load notes."
        );

        return false;
      } finally {
        setLoading(false);
      }
    },
    [handleApiError]
  );

  // Load notes when Dashboard opens.
  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  // Reload current search results after changes.
  async function refreshNotes() {
    return loadNotes(activeSearch);
  }

  // -----------------------------
  // UC5 - Search Notes
  // -----------------------------

  async function handleSearch(event) {
    event.preventDefault();

    const keyword = searchKeyword.trim();

    setMessage("");

    const successful = await loadNotes(keyword);

    if (successful) {
      setActiveSearch(keyword);
    }
  }

  async function handleClearSearch() {
    setSearchKeyword("");
    setActiveSearch("");
    setMessage("");

    await loadNotes();
  }

  // -----------------------------
  // UC3 - Create Note
  // -----------------------------

  async function handleCreate(form) {
    try {
      setError("");
      setMessage("");

      await createNote(form);

      const loaded = await refreshNotes();

      if (!loaded) {
        throw new Error(
          "Note was saved, but the list could not be refreshed."
        );
      }

      setMessage("Note created successfully!");
    } catch (err) {
      handleApiError(
        err,
        "Unable to create note."
      );

      throw err;
    }
  }

  // -----------------------------
  // UC3 - Update Note
  // -----------------------------

  async function handleUpdate(form) {
    if (!editingNote) {
      return;
    }

    try {
      setError("");
      setMessage("");

      await updateNote(
        editingNote.id,
        form
      );

      const loaded = await refreshNotes();

      if (!loaded) {
        throw new Error(
          "Note was updated, but the list could not be refreshed."
        );
      }

      setEditingNote(null);

      setMessage("Note updated successfully!");
    } catch (err) {
      handleApiError(
        err,
        "Unable to update note."
      );

      throw err;
    }
  }

  // -----------------------------
  // UC4 - Pin / Unpin Note
  // -----------------------------

  async function handlePin(note) {
    try {
      setError("");
      setMessage("");

      if (note.pinned) {
        await unpinNote(note.id);
      } else {
        await pinNote(note.id);
      }

      const loaded = await refreshNotes();

      if (loaded) {
        setMessage(
          note.pinned
            ? "Note unpinned successfully."
            : "Note pinned successfully."
        );
      }
    } catch (err) {
      handleApiError(
        err,
        "Unable to change pin status."
      );
    }
  }

  // -----------------------------
  // UC4 - Archive Note
  // -----------------------------

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
      handleApiError(
        err,
        "Unable to archive note."
      );
    }
  }

  // -----------------------------
  // UC4 - Move Note to Trash
  // -----------------------------

  async function handleTrash(note) {
    const confirmed = window.confirm(
      `Move "${note.title || "Untitled Note"}" to Trash?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setMessage("");

      await trashNote(note.id);

      const loaded = await refreshNotes();

      if (loaded) {
        setMessage("Note moved to Trash.");
      }
    } catch (err) {
      handleApiError(
        err,
        "Unable to move note to Trash."
      );
    }
  }

  // -----------------------------
  // UC1 - Logout
  // -----------------------------

  function handleLogout() {
    logoutUser();

    navigate("/login", {
      replace: true
    });
  }

  // -----------------------------
  // Display Active Notes
  // Pinned Notes First
  // -----------------------------

  const visibleNotes = [...notes]
    .filter(
      note => !note.archived && !note.trashed
    )
    .sort(
      (a, b) =>
        Number(b.pinned) - Number(a.pinned)
    );

  // -----------------------------
  // Dashboard UI
  // -----------------------------

  return (
    <main className="dashboard-page">

      {/* Header and Navigation */}
      <header className="dashboard-header">
        <h1>Fundoo Notes</h1>

        <nav
          className="dashboard-actions"
          aria-label="Main navigation"
        >
          <Link
            to="/profile"
            className="profile-link"
          >
            My Profile
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

          <Link
            to="/reminders"
            className="profile-link"
          >
            Reminders
          </Link>

          <Link
            to="/csv"
            className="profile-link"
          >
            Import / Export
          </Link>

          <button
            type="button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </nav>
      </header>

      <section className="dashboard-content">

        <h2>My Notes</h2>

        {/* UC5 - Search Notes */}
        <form
          className="notes-search-form"
          onSubmit={handleSearch}
          role="search"
        >
          <input
            type="search"
            placeholder="Search notes by title or description..."
            aria-label="Search notes"
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

        {/* Display Active Search */}
        {activeSearch && (
          <p className="search-results-label">
            Showing results for:{" "}
            <strong>{activeSearch}</strong>
          </p>
        )}

        {/* UC3 - Create Note */}
        <NoteForm onSave={handleCreate} />

        {/* UC9 - Error Message */}
        {error && (
          <StatusMessage type="error">
            {error}
          </StatusMessage>
        )}

        {/* UC9 - Success Message */}
        {message && (
          <StatusMessage type="success">
            {message}
          </StatusMessage>
        )}

        {/* UC9 - Loading, Empty and Notes States */}
        {loading ? (
          <LoadingState
            message="Loading your notes..."
          />
        ) : error ? (
          <button
            type="button"
            onClick={() =>
              loadNotes(activeSearch)
            }
          >
            Retry Loading Notes
          </button>
        ) : visibleNotes.length === 0 ? (
          <EmptyState
            title={
              activeSearch
                ? "No matching notes"
                : "No notes yet"
            }
            description={
              activeSearch
                ? `No active notes match "${activeSearch}".`
                : "Create your first note using the form above."
            }
          />
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

      {/* UC3 + UC9 - Accessible View Note Dialog */}
      {viewingNote && (
        <Modal
          title="View note"
          onClose={() => setViewingNote(null)}
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
              onClick={() =>
                setViewingNote(null)
              }
            >
              Close
            </button>
          </div>
        </Modal>
      )}

      {/* UC3 + UC9 - Accessible Edit Note Dialog */}
      {editingNote && (
        <Modal
          title="Edit note"
          onClose={() => setEditingNote(null)}
        >
          <h2>Edit Note</h2>

          <NoteForm
            key={editingNote.id}
            initialNote={editingNote}
            onSave={handleUpdate}
            onCancel={() =>
              setEditingNote(null)
            }
          />
        </Modal>
      )}

      {/* UC6 + UC9 - Reminder Dialog */}
      {reminderNote && (
        <Modal
          title="Set note reminder"
          onClose={() => setReminderNote(null)}
        >
          <ReminderForm
            note={reminderNote}
            onSuccess={() => {
              setReminderNote(null);

              setMessage(
                "Reminder saved successfully!"
              );
            }}
            onCancel={() =>
              setReminderNote(null)
            }
          />
        </Modal>
      )}

    </main>
  );
}

export default DashboardPage;
