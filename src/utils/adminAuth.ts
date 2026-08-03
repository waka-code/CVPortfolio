export const ADMIN_TOKEN_KEY = 'admin_token';

/**
 * Whether this browser has unlocked the admin panel. This only hides UI — the
 * database rules are what actually protect writes.
 */
export function isAdminUnlocked(): boolean {
  try {
    const stored = localStorage.getItem(ADMIN_TOKEN_KEY);
    const expected = import.meta.env.VITE_ADMIN_PASSWORD;
    return Boolean(stored && expected && stored === expected);
  } catch {
    return false;
  }
}
