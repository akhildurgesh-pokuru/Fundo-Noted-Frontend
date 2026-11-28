
function LoadingState({ message = "Loading..." }) {
    return (
      <div
        className="ui-loading-state"
        role="status"
        aria-live="polite"
      >
        <span
          className="ui-spinner"
          aria-hidden="true"
        />
  
        <p>{message}</p>
      </div>
    );
  }
  
  export default LoadingState;
  