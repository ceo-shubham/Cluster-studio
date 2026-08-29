"use client";
// Safe Clerk auth — works whether or not Clerk keys are configured

export const IS_CLERK_CONFIGURED = (() => {
  const key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";
  return key.startsWith("pk_test_") || key.startsWith("pk_live_");
})();

export interface SafeAuthState {
  isLoaded: boolean;
  isSignedIn: boolean;
  userId: string | null;
  userEmail: string | null;
  userName: string | null;
  openSignIn: () => void;
  signOut: () => void;
}

// Neutral fallback when Clerk is not configured
export const noAuthState: SafeAuthState = {
  isLoaded: true,
  isSignedIn: false,
  userId: null,
  userEmail: null,
  userName: null,
  openSignIn: () => {},
  signOut: () => {},
};
