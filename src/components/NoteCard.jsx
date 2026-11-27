function NoteCard({ note, onView, onEdit, onDelete }) {
    return (
      <article className="note-card">
        {note.title && <h3>{note.title}</h3>}
  
        <p className="note-content">
          {note.content?.length > 100
            ? note.content.substring(0, 100) + "..."
            : note.content}
        </p>
  
        <div className="note-card-actions">
          <button
            type="button"
            onClick={() => onView(note)}
          >
            View Note
          </button>
  
          <button
            type="button"
            onClick={() => onEdit(note)}
          >
            Edit
          </button>
  
          <button
            type="button"
            className="delete-button"
            onClick={() => onDelete(note)}
          >
            Delete
          </button>
        </div>
      </article>
    );
  }
  
  export default NoteCard;