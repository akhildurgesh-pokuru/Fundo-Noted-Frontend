// All paths are relative to apiClient's "/api" baseURL.
// Endpoint paths are confirmed from UserController.java.

export const ACCOUNT_PATHS = {
    profile: "/users/me",
    verifyEmail: "/users/verify-email",
    resendVerification: "/users/resend-verification",
    forgotPassword: "/users/forgot-password",
    resetPassword: "/users/reset-password"
  };
  
  // These request shapes are starting assumptions.
  // Match each one to its Java request DTO before testing.
  
  export const ACCOUNT_FIELDS = {
    updateProfile: {
      firstName: "firstName",
      lastName: "lastName"
    },
    resendVerification: {
      email: "email"
    },
    forgotPassword: {
      email: "email"
    },
    resetPassword: {
      token: "token",
      password: "newPassword"
    },
    verifyEmailTokenParam: "token"
  };