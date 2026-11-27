
function NoteCard({
    note,
    onView,
    onEdit,
    onPin,
    onArchive,
    onTrash
  }) {
    return (
      <article className="note-card">
  
        {note.pinned && (
          <span className="note-pinned-label">
            Pinned
          </span>
        )}
  
        {note.title && <h3>{note.title}</h3>}
  
        {note.content && (
          <p className="note-content">
            {note.content.length > 100
              ? note.content.substring(0, 100) + "..."
              : note.content}
          </p>
        )}
  
        <div className="note-card-actions">
          <button onClick={() => onView(note)}>
            View
          </button>
  
          <button onClick={() => onEdit(note)}>
            Edit
          </button>
  
          <button onClick={() => onPin(note)}>
            {note.pinned ? "Unpin" : "Pin"}
          </button>
  
          <button onClick={() => onArchive(note)}>
            Archive
          </button>
  
          <button
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
  