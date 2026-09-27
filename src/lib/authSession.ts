/**
 * The staff session lives in memory only — never in localStorage or
 * sessionStorage. Reloading the page, opening a new tab, or typing /dashboard
 * into the address bar therefore always leads to the login page, and a
 * shared or unattended computer holds no saved sign-in.
 *
 * The trade-off is deliberate: refreshing the dashboard asks for the password
 * again.
 */

let token: string | null = null;

export const getAuthToken = (): string | null => token;

export const setAuthToken = (value: string | null) => {
  token = value;
};

// Earlier builds kept the session in localStorage for an hour. Wipe whatever a
// browser still holds from then, so an old saved session cannot be used.
const LEGACY_KEYS = [
  'authToken', 'auth_token', 'user', 'staffUser', 'sessionTimestamp',
  'staffAuthTimestamp', 'staffSessionExpiry', 'staffLoginAttempts',
];
try {
  for (const key of LEGACY_KEYS) localStorage.removeItem(key);
} catch {
  // Storage unavailable (private mode, blocked site data): nothing to wipe.
}
