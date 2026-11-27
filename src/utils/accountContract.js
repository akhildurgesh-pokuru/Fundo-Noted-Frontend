export const ACCOUNT_PATHS = {
    profile: "/users/me",
    verifyEmail: "/users/verify-email",
    resendVerification: "/users/resend-verification",
    forgotPassword: "/users/forgot-password",
    resetPassword: "/users/reset-password"
  };
  
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