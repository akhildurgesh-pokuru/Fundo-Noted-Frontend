
import apiClient from "../utils/apiClient";
import { fromNoteResponse } from "../utils/noteContract";

// UC5: Create a label
export async function createLabel(name) {
  const response = await apiClient.post("/labels", {
    name: name.trim()
  });

  return response.data;
}

// UC5: Get all labels
export async function getLabels() {
  const response = await apiClient.get("/labels");

  if (!Array.isArray(response.data)) {
    throw new Error("Unexpected labels response.");
  }

  return response.data;
}

// UC5: Rename a label
export async function renameLabel(labelId, name) {
  const response = await apiClient.put(
    `/labels/${labelId}`,
    {
      name: name.trim()
    }
  );

  return response.data;
}

// UC5: Delete a label
export async function deleteLabel(labelId) {
  await apiClient.delete(`/labels/${labelId}`);
}

// UC5: Fetch active notes assigned to a label
export async function getNotesByLabel(labelId) {
  const response = await apiClient.get(
    `/labels/${labelId}/notes`
  );

  if (!Array.isArray(response.data)) {
    throw new Error("Unexpected label notes response.");
  }

  return response.data.map(fromNoteResponse);
}

// UC5: Assign a label to a note
export async function assignLabelToNote(noteId, labelId) {
  await apiClient.put(
    `/notes/${noteId}/labels/${labelId}`
  );
}

// UC5: Remove a label from a note
export async function removeLabelFromNote(noteId, labelId) {
  await apiClient.delete(
    `/notes/${noteId}/labels/${labelId}`
  );
}
