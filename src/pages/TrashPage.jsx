import OrganizedNotesPage from "../components/OrganizedNotesPage";

import {
  getTrashedNotes,
  restoreNote,
  permanentlyDeleteNote
} from "../services/noteOrganizationService";

const trashActions = [
  {
    label: "Restore",
    run: restoreNote
  },
  {
    label: "Delete Forever",
    run: permanentlyDeleteNote,
    confirm: true
  }
];

function TrashPage() {
  return (
    <OrganizedNotesPage
      title="Trash"
      loadNotes={getTrashedNotes}
      actions={trashActions}
    />
  );
}

export default TrashPage;