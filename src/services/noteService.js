import apiClient from "../utils/apiClient";

import {
  NOTE_PATHS,
  toNoteRequest,
  fromNoteResponse
} from "../utils/noteContract";

// READ — Get all notes
export async function getNotes() {
  const response = await apiClient.get(NOTE_PATHS.list);

  if (!Array.isArray(response.data)) {
    throw new Error(
      "Unexpected notes response. Check NoteController and its response DTO."
    );
  }

  return response.data.map(fromNoteResponse);
}

// CREATE — Save a new note
export async function createNote(form) {
  const response = await apiClient.post(
    NOTE_PATHS.create,
    toNoteRequest(form)
  );

  return response.data;
}

// UPDATE — Edit an existing note
export async function updateNote(id, form) {
  const response = await apiClient.put(
    NOTE_PATHS.update(id),
    toNoteRequest(form)
  );

  return response.data;
}

// DELETE — Use backend note deletion endpoint
export async function deleteNote(id) {
  const response = await apiClient.delete(
    NOTE_PATHS.remove(id)
  );

  return response.data;
}