import OrganizedNotesPage from "../components/OrganizedNotesPage";

import {
  getArchivedNotes,
  unarchiveNote
} from "../services/noteOrganizationService";

const archiveActions = [
  {
    label: "Unarchive",
    run: unarchiveNote
  }
];

function ArchivePage() {
  return (
    <OrganizedNotesPage
      title="Archive"
      loadNotes={getArchivedNotes}
      actions={archiveActions}
    />
  );
}

export default ArchivePage;