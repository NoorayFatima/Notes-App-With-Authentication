import { apiRequest, setToken, clearToken, getToken } from "./client";

export async function signup({ username, email, password }) {
  const { user, token } = await apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify({ username, email, password }),
  });
  setToken(token);
  return user;
}

export async function login({ email, password }) {
  const { user, token } = await apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  setToken(token);
  return user;
}

export async function fetchCurrentUser() {
  const { user } = await apiRequest("/auth/me", { method: "GET" });
  return user;
}

export function logout() {
  clearToken();
}

export function hasStoredToken() {
  return Boolean(getToken());
}
