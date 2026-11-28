
import apiClient from "../utils/apiClient";

// UC7: Import notes from a CSV file.
export async function importNotesCsv(file) {
    const formData = new FormData();
  
    formData.append("file", file);
  
    const response = await apiClient.post(
      "/notes/import",
      formData,
      {
        headers: {
          "Content-Type": undefined
        }
      }
    );
  
    return response.data;
  }

// UC7: Export notes from the backend as CSV.
export async function exportNotesCsv() {
  const response = await apiClient.get("/notes/export", {
    responseType: "blob"
  });

  const csvBlob = new Blob(
    [response.data],
    { type: "text/csv;charset=utf-8" }
  );

  const url = URL.createObjectURL(csvBlob);

  try {
    const link = document.createElement("a");

    link.href = url;
    link.download = "fundoo-notes.csv";

    document.body.appendChild(link);
    link.click();
    link.remove();
  } finally {
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}
