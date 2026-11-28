
function EmptyState({
    title = "Nothing here yet",
    description = ""
  }) {
    return (
      <div className="ui-empty-state">
        <div className="ui-empty-icon" aria-hidden="true">
          📝
        </div>
  
        <h3>{title}</h3>
  
        {description && <p>{description}</p>}
      </div>
    );
  }
  
  export default EmptyState;
  