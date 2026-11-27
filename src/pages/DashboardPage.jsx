import { useNavigate } from "react-router";
import { logoutUser } from "../services/authService";

function DashboardPage() {
  const navigate = useNavigate();

  function handleLogout() {
    logoutUser();
    navigate("/login", { replace: true });
  }

  return (
    <main className="dashboard-page">
      <header className="dashboard-header">
        <h1>Fundoo Notes</h1>

        <button onClick={handleLogout}>
          Logout
        </button>
      </header>

      <section className="dashboard-content">
        <h2>Dashboard</h2>

        <p>You have completed the frontend login flow.</p>

        <p>
          Notes will be displayed here after
          UC3 backend integration.
        </p>
      </section>
    </main>
  );
}

export default DashboardPage;