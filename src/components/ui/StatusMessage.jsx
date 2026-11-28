
function StatusMessage({ type = "info", children }) {
    if (!children) return null;
  
    const isError = type === "error";
  
    return (
      <div
        className={`ui-status-message ui-status-${type}`}
        role={isError ? "alert" : "status"}
      >
        <span aria-hidden="true">
          {isError ? "⚠️" : type === "success" ? "✓" : "ℹ"}
        </span>
  
        <span>{children}</span>
      </div>
    );
  }
  
  export default StatusMessage;
  