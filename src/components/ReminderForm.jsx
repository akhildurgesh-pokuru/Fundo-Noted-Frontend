
import { useState } from "react";

import { setNoteReminder } from "../services/reminderService";
import { getApiError } from "../utils/getApiError";

// Convert a UTC timestamp to a value suitable for
// a browser's datetime-local input.
function toLocalDateTimeValue(isoDate) {
  if (!isoDate) return "";

  const date = new Date(isoDate);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const localDate = new Date(
    date.getTime() - date.getTimezoneOffset() * 60000
  );

  return localDate.toISOString().slice(0, 16);
}

function ReminderForm({
  note,
  initialReminderAt = null,
  onSuccess,
  onCancel
}) {
  const [dateTime, setDateTime] = useState(() =>
    toLocalDateTimeValue(initialReminderAt)
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const isEditing = Boolean(initialReminderAt);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!dateTime) {
      setError("Please select a date and time.");
      return;
    }

    const selectedDate = new Date(dateTime);

    if (
      Number.isNaN(selectedDate.getTime()) ||
      selectedDate.getTime() <= Date.now()
    ) {
      setError("Reminder time must be in the future.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const reminderAt = selectedDate.toISOString();

      await setNoteReminder(note.id, reminderAt);

      if (onSuccess) {
        await onSuccess();
      }
    } catch (err) {
      setError(
        getApiError(err, "Unable to save reminder.")
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      className="reminder-form"
      onSubmit={handleSubmit}
    >
      <h3>
        {isEditing
          ? "Update Reminder"
          : "Set Reminder"}
      </h3>

      <p>
        Note: {note.title || "Untitled Note"}
      </p>

      <label htmlFor="reminder-date-time">
        Reminder Date and Time
      </label>

      <input
        id="reminder-date-time"
        type="datetime-local"
        value={dateTime}
        onChange={event =>
          setDateTime(event.target.value)
        }
        required
      />

      {error && (
        <p className="error-message" role="alert">
          {error}
        </p>
      )}

      <div className="note-form-actions">
        <button
          type="submit"
          disabled={saving}
        >
          {saving
            ? "Saving..."
            : isEditing
              ? "Update Reminder"
              : "Save Reminder"}
        </button>

        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default ReminderForm;
