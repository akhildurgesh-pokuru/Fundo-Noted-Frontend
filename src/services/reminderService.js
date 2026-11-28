
import apiClient from "../utils/apiClient";

// UC6: Create or update a reminder for a note.
export async function setNoteReminder(noteId, reminderAt) {
  const response = await apiClient.put(
    `/notes/${noteId}/reminder`,
    {
      reminderAt
    }
  );

  return response.data;
}

// UC6: Retrieve upcoming reminders.
export async function getUpcomingReminders() {
  const response = await apiClient.get(
    "/notes/reminders"
  );

  if (!Array.isArray(response.data)) {
    throw new Error(
      "Unexpected reminders response from backend."
    );
  }

  return response.data;
}

// UC6: Remove an existing reminder.
export async function removeNoteReminder(noteId) {
  await apiClient.delete(
    `/notes/${noteId}/reminder`
  );
}
