// Shared fetch wrapper used by both api/auth.js and api/notes.js.
// This is the only file that knows about the token's storage key and how
// to attach it to a request.

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";
const TOKEN_KEY = "notes_app_token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export async function apiRequest(path, options = {}) {
  const token = getToken();
  const headers = { "Content-Type": "application/json", ...options.headers };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  } catch {
    throw new Error(`Can't reach the API. Is the server running on ${BASE_URL}?`);
  }

  const body = await response.json().catch(() => ({}));

  if (response.status === 401) {
    // Token missing, invalid, or expired — clear it so the app doesn't
    // keep sending a dead token, and flag this error as auth-related so
    // the UI can react by logging the user out.
    clearToken();
    const authError = new Error(body.message || "Session expired. Please log in again.");
    authError.isAuthError = true;
    throw authError;
  }

  if (!response.ok) {
    throw new Error(body.message || `Request failed (${response.status})`);
  }

  return body;
}
