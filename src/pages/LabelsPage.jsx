
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";

import { getNotes } from "../services/noteService";

import {
  createLabel,
  getLabels,
  renameLabel,
  deleteLabel,
  getNotesByLabel,
  assignLabelToNote,
  removeLabelFromNote
} from "../services/labelService";

import { getApiError } from "../utils/getApiError";
import { removeToken } from "../utils/token";

function LabelsPage() {
  const navigate = useNavigate();

  // Labels from Spring Boot
  const [labels, setLabels] = useState([]);
  const [selectedLabelId, setSelectedLabelId] = useState(null);

  // Notes from Spring Boot
  const [allNotes, setAllNotes] = useState([]);
  const [labelNotes, setLabelNotes] = useState([]);

  // Form values
  const [newLabelName, setNewLabelName] = useState("");
  const [editingLabelId, setEditingLabelId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [selectedNoteId, setSelectedNoteId] = useState("");

  // UI state
  const [loading, setLoading] = useState(true);
  const [notesLoading, setNotesLoading] = useState(false);
  const [busy, setBusy] = useState(false);
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

  // Load labels and available active notes.
  const loadInitialData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [labelsData, notesData] = await Promise.all([
        getLabels(),
        getNotes()
      ]);

      setLabels(labelsData);
      setAllNotes(notesData);
    } catch (err) {
      handleError(err, "Unable to load labels.");
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Load the actual notes belonging to one label.
  const loadLabelNotes = useCallback(
    async (labelId) => {
      if (labelId == null) {
        setLabelNotes([]);
        return;
      }

      try {
        setNotesLoading(true);
        setError("");

        const notes = await getNotesByLabel(labelId);
        setLabelNotes(notes);
      } catch (err) {
        handleError(err, "Unable to load notes for this label.");
      } finally {
        setNotesLoading(false);
      }
    },
    [handleError]
  );

  useEffect(() => {
    if (selectedLabelId != null) {
      loadLabelNotes(selectedLabelId);
    } else {
      setLabelNotes([]);
    }
  }, [selectedLabelId, loadLabelNotes]);

  // Create Label
  async function handleCreateLabel(event) {
    event.preventDefault();

    const name = newLabelName.trim();

    if (!name || name.length > 100) {
      setError("Enter a label name of 1 to 100 characters.");
      return;
    }

    try {
      setBusy(true);
      setError("");
      setMessage("");

      const created = await createLabel(name);

      const refreshed = await getLabels();
      setLabels(refreshed);

      setNewLabelName("");
      setSelectedLabelId(created.id);
      setMessage("Label created successfully.");
    } catch (err) {
      handleError(err, "Unable to create label.");
    } finally {
      setBusy(false);
    }
  }

  // Start editing a label
  function startRename(label) {
    setEditingLabelId(label.id);
    setEditingName(label.name);
    setError("");
    setMessage("");
  }

  // Save updated label name
  async function handleRenameLabel(event) {
    event.preventDefault();

    const name = editingName.trim();

    if (!name || name.length > 100) {
      setError("Enter a label name of 1 to 100 characters.");
      return;
    }

    try {
      setBusy(true);
      setError("");
      setMessage("");

      await renameLabel(editingLabelId, name);

      setLabels(await getLabels());
      setEditingLabelId(null);
      setEditingName("");

      setMessage("Label renamed successfully.");
    } catch (err) {
      handleError(err, "Unable to rename label.");
    } finally {
      setBusy(false);
    }
  }

  // Delete Label
  async function handleDeleteLabel(label) {
    const confirmed = window.confirm(
      `Delete the label "${label.name}"?\n\n` +
      "The notes themselves will not be deleted."
    );

    if (!confirmed) return;

    try {
      setBusy(true);
      setError("");
      setMessage("");

      await deleteLabel(label.id);

      setLabels(await getLabels());

      if (selectedLabelId === label.id) {
        setSelectedLabelId(null);
        setLabelNotes([]);
        setSelectedNoteId("");
      }

      if (editingLabelId === label.id) {
        setEditingLabelId(null);
      }

      setMessage("Label deleted. Its notes are preserved.");
    } catch (err) {
      handleError(err, "Unable to delete label.");
    } finally {
      setBusy(false);
    }
  }

  // Assign selected label to a note
  async function handleAssignLabel(event) {
    event.preventDefault();

    if (selectedLabelId == null || !selectedNoteId) {
      setError("Select a note to assign.");
      return;
    }

    try {
      setBusy(true);
      setError("");
      setMessage("");

      await assignLabelToNote(
        selectedNoteId,
        selectedLabelId
      );

      await loadLabelNotes(selectedLabelId);

      setSelectedNoteId("");
      setMessage("Label assigned to note.");
    } catch (err) {
      handleError(err, "Unable to assign label.");
    } finally {
      setBusy(false);
    }
  }

  // Remove selected label from a note
  async function handleRemoveLabel(note) {
    if (selectedLabelId == null) return;

    try {
      setBusy(true);
      setError("");
      setMessage("");

      await removeLabelFromNote(
        note.id,
        selectedLabelId
      );

      await loadLabelNotes(selectedLabelId);

      setMessage("Label removed from note.");
    } catch (err) {
      handleError(err, "Unable to remove label.");
    } finally {
      setBusy(false);
    }
  }

  const selectedLabel = labels.find(
    label => label.id === selectedLabelId
  );

  // Do not offer notes already assigned to the label.
  const assignedNoteIds = new Set(
    labelNotes.map(note => note.id)
  );

  const availableNotes = allNotes.filter(
    note =>
      !note.archived &&
      !note.trashed &&
      !assignedNoteIds.has(note.id)
  );

  return (
    <main className="dashboard-page">
      <header className="dashboard-header">
        <h1>Fundoo Notes</h1>

        <div className="dashboard-actions">
          <Link to="/dashboard" className="profile-link">
            My Notes
          </Link>

          <Link to="/archive" className="profile-link">
            Archive
          </Link>

          <Link to="/trash" className="profile-link">
            Trash
          </Link>
        </div>
      </header>

      <section className="dashboard-content">
        <h2>Manage Labels</h2>

        <p>
          Create labels and organize your existing notes.
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

        {/* Create Label */}
        <form
          className="label-create-form"
          onSubmit={handleCreateLabel}
        >
          <input
            type="text"
            placeholder="Enter label name..."
            maxLength={100}
            value={newLabelName}
            onChange={event =>
              setNewLabelName(event.target.value)
            }
            disabled={busy}
            aria-label="New label name"
          />

          <button
            type="submit"
            disabled={busy || !newLabelName.trim()}
          >
            Add Label
          </button>
        </form>

        {loading ? (
          <p>Loading labels...</p>
        ) : (
          <div className="label-layout">

            {/* Labels list */}
            <section className="labels-panel">
              <h3>Your Labels</h3>

              {labels.length === 0 ? (
                <p>No labels yet. Create your first label.</p>
              ) : (
                <div className="labels-list">
                  {labels.map(label => (
                    <div
                      key={label.id}
                      className="label-list-item"
                    >
                      {editingLabelId === label.id ? (
                        <form
                          className="label-rename-form"
                          onSubmit={handleRenameLabel}
                        >
                          <input
                            type="text"
                            value={editingName}
                            maxLength={100}
                            onChange={event =>
                              setEditingName(event.target.value)
                            }
                            aria-label="Rename label"
                          />

                          <button
                            type="submit"
                            disabled={busy}
                          >
                            Save
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              setEditingLabelId(null)
                            }
                            disabled={busy}
                          >
                            Cancel
                          </button>
                        </form>
                      ) : (
                        <>
                          <button
                            type="button"
                            className={
                              selectedLabelId === label.id
                                ? "label-name-button selected"
                                : "label-name-button"
                            }
                            onClick={() => {
                              setSelectedLabelId(label.id);
                              setSelectedNoteId("");
                              setMessage("");
                            }}
                          >
                            {label.name}
                          </button>

                          <div className="label-item-actions">
                            <button
                              type="button"
                              onClick={() => startRename(label)}
                              disabled={busy}
                            >
                              Rename
                            </button>

                            <button
                              type="button"
                              className="delete-button"
                              onClick={() =>
                                handleDeleteLabel(label)
                              }
                              disabled={busy}
                            >
                              Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Notes belonging to a label */}
            <section className="labels-panel">
              {!selectedLabel ? (
                <>
                  <h3>Label Notes</h3>
                  <p>
                    Select a label to view or assign notes.
                  </p>
                </>
              ) : (
                <>
                  <h3>
                    Notes with label: {selectedLabel.name}
                  </h3>

                  {/* Assign a note */}
                  <form
                    className="label-assign-form"
                    onSubmit={handleAssignLabel}
                  >
                    <select
                      value={selectedNoteId}
                      onChange={event =>
                        setSelectedNoteId(event.target.value)
                      }
                      disabled={busy || notesLoading}
                      aria-label="Select note"
                    >
                      <option value="">
                        Select a note...
                      </option>

                      {availableNotes.map(note => (
                        <option
                          key={note.id}
                          value={note.id}
                        >
                          {note.title || "Untitled Note"}
                          {" (ID: "}{note.id}{")"}
                        </option>
                      ))}
                    </select>

                    <button
                      type="submit"
                      disabled={
                        busy ||
                        notesLoading ||
                        !selectedNoteId
                      }
                    >
                      Assign Label
                    </button>
                  </form>

                  {notesLoading ? (
                    <p>Loading assigned notes...</p>
                  ) : labelNotes.length === 0 ? (
                    <p>
                      No active notes assigned to this label.
                    </p>
                  ) : (
                    <div className="label-notes-grid">
                      {labelNotes.map(note => (
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

                          <button
                            type="button"
                            disabled={busy}
                            onClick={() =>
                              handleRemoveLabel(note)
                            }
                          >
                            Remove Label
                          </button>
                        </article>
                      ))}
                    </div>
                  )}
                </>
              )}
            </section>
          </div>
        )}
      </section>
    </main>
  );
}

export default LabelsPage;
