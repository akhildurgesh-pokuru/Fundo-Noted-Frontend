export const NOTE_PATHS = {
    list: "/notes",
    create: "/notes",
    update: (id) => `/notes/${id}`,
    remove: (id) => `/notes/${id}`
  };
  
  export const NOTE_FIELDS = {
    id: "id",
    title: "title",
    content: "description"
  };
  
  // Convert React form data into backend request data.
  export function toNoteRequest(form) {
    return {
      title: form.title,
      description: form.content
    };
  }
  
  // Convert backend response into the format React uses.
  export function fromNoteResponse(note) {
    return {
      id: note.id,
      title: note.title ?? "",
      content: note.description ?? ""
    };
  }