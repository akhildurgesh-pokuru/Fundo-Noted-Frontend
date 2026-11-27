
import apiClient from "../utils/apiClient";

import { fromNoteResponse } from "../utils/noteContract";

import {
  NOTE_ACTIONS,
  NOTE_LIST_PATHS
} from "../utils/noteOrganizationContract";

// Perform a real backend action.
async function performAction(actionName, id) {
  const action = NOTE_ACTIONS[actionName];

  if (!action || !action.path) {
    throw new Error(
      `Backend endpoint not configured for: ${actionName}`
    );
  }

  const path =
    typeof action.path === "function"
      ? action.path(id)
      : action.path;

  const response = await apiClient.request({
    method: action.method,
    url: path
  });

  return response.data;
}

// Get actual notes for Archive / Trash pages.
async function fetchNotes(path, category) {
  if (!path) {
    throw new Error(
      `Backend list endpoint not configured for: ${category}`
    );
  }

  const response = await apiClient.get(path);

  if (!Array.isArray(response.data)) {
    throw new Error(
      `Unexpected ${category} response. Expected an array.`
    );
  }

  return response.data.map(fromNoteResponse);
}

export function pinNote(id) {
  return performAction("pin", id);
}

export function unpinNote(id) {
  return performAction("unpin", id);
}

export function archiveNote(id) {
  return performAction("archive", id);
}

export function unarchiveNote(id) {
  return performAction("unarchive", id);
}

export function trashNote(id) {
  return performAction("trash", id);
}

export function restoreNote(id) {
  return performAction("restore", id);
}

export function permanentlyDeleteNote(id) {
  return performAction("deleteForever", id);
}

export function getArchivedNotes() {
  return fetchNotes(
    NOTE_LIST_PATHS.archived,
    "archived notes"
  );
}

export function getTrashedNotes() {
  return fetchNotes(
    NOTE_LIST_PATHS.trashed,
    "trashed notes"
  );
}
