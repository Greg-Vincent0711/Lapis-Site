/**
 * Check if the JWT is expired.
 * If it is, we refresh.
 * File also provides an api call wrapper that auto handles
 * refresh token issues.
 */
import { fetchAuthSession } from "@aws-amplify/auth";

/**
 * Error thrown for any non-2xx API response. `message` is the server's
 * user-facing error text; `status` lets callers branch (e.g. 403 = Discord not linked).
 */
export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

/** Pull a user-facing message out of anything thrown by checkTokensAndFetch. */
export function errorMessage(error: unknown, fallback: string): string {
  return error instanceof Error && error.message ? error.message : fallback;
}

function isTokenExpired(idToken: string): boolean {
  if (!idToken) return true;
  const payload = JSON.parse(atob(idToken.split('.')[1]));
  return payload.exp * 1000 < Date.now();
}

/**
 * Get a valid ID token from Cognito, refreshing if expired
 */
async function getValidIdToken(): Promise<string | null> {
  try {
    // Fetch current session, refresh=true ensures token is refreshed if expired
    const session = await fetchAuthSession({ forceRefresh: true });
    const idToken = session.tokens?.idToken?.toString() ?? "";

    if (isTokenExpired(idToken)) {
      // Extra safety: force refresh
      const refreshedSession = await fetchAuthSession({ forceRefresh: true });
      return refreshedSession.tokens?.idToken?.toString() ?? "";
    }

    return idToken;
  } catch (err) {
    console.error("User may need to login again. Failed to get ID token:", err);
    return null;
  }
}

/**
 * Generic API fetch helper that automatically attaches a valid ID token
 * 
 * Usage example for your future self:
 * 
 *  const newLocation = { name: "MyPlace", xCoord: 0, yCoord: 64, zCoord: 0 };
 * // in a try, catch of course
    const data = await checkTokensAndFetch(`${API_ENDPOINT}/locations`, {
        method: "POST",
        body: JSON.stringify(newLocation),
    });
 */
export default async function checkTokensAndFetch(url: string, options: RequestInit = {}) {
  const idToken = await getValidIdToken();
  if (!idToken) {
    console.error("No valid ID token, redirecting to home");
    window.location.href = "/";
    return null;
  }
  const headers = {
    // keep headers passed in
    ...options.headers,
    "Authorization": `Bearer ${idToken}`,
    "Content-Type": "application/json",
  };

  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new ApiError(response.status, body.error ?? body.message ?? `Request failed: ${response.status}`);
  }
  return await response.json();
}
