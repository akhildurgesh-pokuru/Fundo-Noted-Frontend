import {
  BrowserRouter,
  Navigate,
  Route,
  Routes
} from "react-router";

import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/ProfilePage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import ResendVerificationPage from "./pages/ResendVerificationPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ArchivePage from "./pages/ArchivePage";
import TrashPage from "./pages/TrashPage";

import ProtectedRoute from "./components/ProtectedRoute";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/verify-email"
          element={<VerifyEmailPage />}
        />

        <Route
          path="/resend-verification"
          element={<ResendVerificationPage />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPasswordPage />}
        />

        <Route
          path="/reset-password"
          element={<ResetPasswordPage />}
        />

        <Route element={<ProtectedRoute />}>
          <Route
            path="/dashboard"
            element={<DashboardPage />}
          />

          <Route
            path="/profile"
            element={<ProfilePage />}
          />
        </Route>

        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />

        <Route path="/archive" 
        element={<ArchivePage />} 
        />

        <Route path="/trash" 
        element={<TrashPage />} 
        />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;