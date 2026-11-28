
function NoteCard({
  note,
  onView,
  onEdit,
  onPin,
  onArchive,
  onTrash,
  onReminder
}) {
  return (
    <article className="note-card">
      {note.pinned && (
        <span className="note-pinned-label">
          Pinned
        </span>
      )}

      <h3>{note.title || "Untitled Note"}</h3>

      {note.content && (
        <p className="note-content">
          {note.content.length > 100
            ? note.content.substring(0, 100) + "..."
            : note.content}
        </p>
      )}

      <div className="note-card-actions">
        <button
          type="button"
          onClick={() => onView(note)}
        >
          View
        </button>

        <button
          type="button"
          onClick={() => onEdit(note)}
        >
          Edit
        </button>

        <button
          type="button"
          onClick={() => onReminder(note)}
        >
          Reminder
        </button>

        <button
          type="button"
          onClick={() => onPin(note)}
        >
          {note.pinned ? "Unpin" : "Pin"}
        </button>

        <button
          type="button"
          onClick={() => onArchive(note)}
        >
          Archive
        </button>

        <button
          type="button"
          className="delete-button"
          onClick={() => onTrash(note)}
        >
          Trash
        </button>
      </div>
    </article>
  );
}

export default NoteCard;
