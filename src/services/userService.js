import apiClient from "../utils/apiClient";
import {
  ACCOUNT_PATHS,
  ACCOUNT_FIELDS
} from "../utils/accountContract";

// GET: View logged-in user's profile
export async function getUserProfile() {
  const response = await apiClient.get(ACCOUNT_PATHS.profile);
  return response.data;
}

// PUT: Update logged-in user's profile
export async function updateUserProfile(formData) {
  const fields = ACCOUNT_FIELDS.updateProfile;

  const body = {
    [fields.firstName]: formData.firstName,
    [fields.lastName]: formData.lastName
  };

  const response = await apiClient.put(
    ACCOUNT_PATHS.profile,
    body
  );

  return response.data;
}

// GET: Verify an email using a verification token
export async function verifyUserEmail(token) {
  const response = await apiClient.get(
    ACCOUNT_PATHS.verifyEmail,
    {
      params: {
        [ACCOUNT_FIELDS.verifyEmailTokenParam]: token
      }
    }
  );

  return response.data;
}

// POST: Request another verification email
export async function resendVerificationEmail(email) {
  const body = {
    [ACCOUNT_FIELDS.resendVerification.email]: email
  };

  const response = await apiClient.post(
    ACCOUNT_PATHS.resendVerification,
    body
  );

  return response.data;
}

// POST: Request password reset
export async function forgotPassword(email) {
  const body = {
    [ACCOUNT_FIELDS.forgotPassword.email]: email
  };

  const response = await apiClient.post(
    ACCOUNT_PATHS.forgotPassword,
    body
  );

  return response.data;
}

// POST: Set a new password using a reset token
export async function resetPassword(token, password) {
  const fields = ACCOUNT_FIELDS.resetPassword;

  const body = {
    [fields.token]: token,
    [fields.password]: password
  };

  const response = await apiClient.post(
    ACCOUNT_PATHS.resetPassword,
    body
  );

  return response.data;
}