
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router";

import {
  importNotesCsv,
  exportNotesCsv
} from "../services/csvService";

import { getApiError } from "../utils/getApiError";
import { removeToken } from "../utils/token";

const MAX_CSV_SIZE = 2 * 1024 * 1024;

function CsvPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);

  const [importResult, setImportResult] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  function handleError(err, fallback) {
    if (err.response?.status === 401) {
      removeToken();
      navigate("/login", { replace: true });
      return;
    }

    setError(getApiError(err, fallback));
  }

  function handleFileChange(event) {
    const file = event.target.files?.[0] ?? null;

    setSelectedFile(null);
    setImportResult(null);
    setError("");
    setMessage("");

    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".csv")) {
      setError("Please select a .csv file.");
      event.target.value = "";
      return;
    }

    if (file.size === 0) {
      setError("CSV file cannot be empty.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_CSV_SIZE) {
      setError("CSV file must be 2 MB or smaller.");
      event.target.value = "";
      return;
    }

    setSelectedFile(file);
  }

  async function handleImport() {
    if (!selectedFile) {
      setError("Please choose a CSV file first.");
      return;
    }

    try {
      setImporting(true);
      setError("");
      setMessage("");
      setImportResult(null);

      const result = await importNotesCsv(selectedFile);

      setImportResult(result);

      if (result.status === "COMPLETED") {
        setMessage("CSV import completed successfully.");

        setSelectedFile(null);

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        setError(
          `Import finished with status: ${
            result.status || "UNKNOWN"
          }`
        );
      }
    } catch (err) {
      handleError(err, "Unable to import CSV.");
    } finally {
      setImporting(false);
    }
  }

  async function handleExport() {
    try {
      setExporting(true);
      setError("");
      setMessage("");

      await exportNotesCsv();

      setMessage("CSV export completed successfully.");
    } catch (err) {
      handleError(err, "Unable to export notes.");
    } finally {
      setExporting(false);
    }
  }

  return (
    <main className="dashboard-page">
      <header className="dashboard-header">
        <h1>Fundoo Notes</h1>

        <div className="dashboard-actions">
          <Link
            to="/dashboard"
            className="profile-link"
          >
            My Notes
          </Link>
        </div>
      </header>

      <section className="dashboard-content">
        <h2>CSV Import and Export</h2>

        <p>
          Import notes into your account or export
          your saved notes as a CSV file.
        </p>

        {error && (
          <p className="error-message" role="alert">
            {error}
          </p>
        )}

        {message && (
          <p className="success-message" role="status">
            {message}
          </p>
        )}

        <div className="csv-layout">

          {/* Import Notes */}
          <section className="csv-panel">
            <h3>Import Notes</h3>

            <p>
              Choose a CSV file containing the columns
              title and description.
            </p>

            <p>
              Maximum file size: 2 MB.
            </p>

            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,text/csv"
              onChange={handleFileChange}
              disabled={importing || exporting}
              aria-label="Choose CSV file"
            />

            {selectedFile && (
              <p>
                Selected: {selectedFile.name}
              </p>
            )}

            <button
              type="button"
              onClick={handleImport}
              disabled={
                !selectedFile ||
                importing ||
                exporting
              }
            >
              {importing
                ? "Importing..."
                : "Import Notes"}
            </button>

            {importResult && (
              <div
                className="csv-import-result"
                role="status"
              >
                <h4>Import Results</h4>

                <p>
                  Status: {importResult.status}
                </p>

                <p>
                  Rows read: {importResult.readCount}
                </p>

                <p>
                  Notes imported: {importResult.importedCount}
                </p>

                <p>
                  Rows filtered: {importResult.filteredCount}
                </p>

                <p>
                  Job ID: {importResult.jobId}
                </p>

                <Link to="/dashboard">
                  View Imported Notes
                </Link>
              </div>
            )}
          </section>

          {/* Export Notes */}
          <section className="csv-panel">
            <h3>Export Notes</h3>

            <p>
              Download the notes belonging to your
              account as a CSV file.
            </p>

            <button
              type="button"
              onClick={handleExport}
              disabled={importing || exporting}
            >
              {exporting
                ? "Exporting..."
                : "Export Notes to CSV"}
            </button>
          </section>
        </div>
      </section>
    </main>
  );
}

export default CsvPage;
