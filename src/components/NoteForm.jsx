
import { useState } from "react";

function NoteForm({
  initialNote = null,
  onSave,
  onCancel
}) {
  const [title, setTitle] = useState(
    initialNote?.title ?? ""
  );

  const [content, setContent] = useState(
    initialNote?.content ?? ""
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!title.trim() && !content.trim()) {
      setError("Enter a title or some note content.");
      return;
    }

    try {
      setSaving(true);

      await onSave({
        title: title.trim(),
        content: content.trim()
      });

      // For a newly created note, clear the form.
      if (!initialNote) {
        setTitle("");
        setContent("");
      }
    } catch (err) {
      setError(
        err.message || "Unable to save note."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="note-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Title"
        aria-label="Note title"
        value={title}
        onChange={event => setTitle(event.target.value)}
      />

      <textarea
        placeholder="Take a note..."
        aria-label="Note content"
        rows={4}
        value={content}
        onChange={event => setContent(event.target.value)}
      />

      {error && (
        <p className="error-message" role="alert">
          {error}
        </p>
      )}

      <div className="note-form-actions">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
          >
            Cancel
          </button>
        )}

        <button type="submit" disabled={saving}>
          {saving
            ? "Saving..."
            : initialNote
              ? "Update Note"
              : "Add Note"}
        </button>
      </div>
    </form>
  );
}

export default NoteForm;
