export const getAuthStatus = (user: { isEmailVerified: boolean }) => {
  if (!user.isEmailVerified) {
    return {
      message: 'Email not verified. Please verify your email.',
      status: { isEmailVerified: false },
    };
  }

  return null;
};
