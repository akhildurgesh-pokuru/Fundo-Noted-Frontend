
export const NOTE_ACTIONS = {
  pin: {
    method: "PATCH",
    path: (id) => `/notes/${id}/pin`
  },

  unpin: {
    method: "PATCH",
    path: (id) => `/notes/${id}/unpin`
  },

  archive: {
    method: "PATCH",
    path: (id) => `/notes/${id}/archive`
  },

  unarchive: {
    method: "PATCH",
    path: (id) => `/notes/${id}/unarchive`
  },

  trash: {
    method: "PATCH",
    path: (id) => `/notes/${id}/trash`
  },

  restore: {
    method: "PATCH",
    path: (id) => `/notes/${id}/restore`
  },

  deleteForever: {
    method: "DELETE",
    path: (id) => `/notes/${id}/permanent`
  }
};

export const NOTE_LIST_PATHS = {
  archived: "/notes/archived",
  trashed: "/notes/trash"
};
