
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

function Modal({
  title,
  onClose,
  children
}) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    const previousFocus = document.activeElement;

    const focusableSelector =
      'button:not([disabled]), input:not([disabled]), ' +
      'textarea:not([disabled]), select:not([disabled]), ' +
      'a[href], [tabindex]:not([tabindex="-1"])';

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    // Focus the first interactive control, or the dialog.
    const firstFocusable =
      dialog?.querySelector(focusableSelector);

    (firstFocusable || dialog)?.focus();

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }

      if (event.key !== "Tab" || !dialog) {
        return;
      }

      const controls = Array.from(
        dialog.querySelectorAll(focusableSelector)
      );

      if (controls.length === 0) {
        event.preventDefault();
        dialog.focus();
        return;
      }

      const first = controls[0];
      const last = controls[controls.length - 1];

      if (
        event.shiftKey &&
        (document.activeElement === first ||
          document.activeElement === dialog)
      ) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        document.activeElement === last
      ) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );

      document.body.style.overflow = previousOverflow;

      if (previousFocus?.isConnected) {
        previousFocus.focus();
      }
    };
  }, [onClose]);

  return createPortal(
    <div className="note-modal-backdrop">
      <div
        ref={dialogRef}
        className="note-modal"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}

export default Modal;
