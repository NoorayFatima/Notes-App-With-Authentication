import { useCallback, useEffect, useState } from "react";
import {
  signup as signupRequest,
  login as loginRequest,
  logout as logoutRequest,
  fetchCurrentUser,
  hasStoredToken,
} from "../api/auth";

// Centralizes everything about "who is logged in right now": the user
// object, whether we're still checking a stored token, and the actions
// (signup/login/logout) that change that state.
export function useAuth() {
  const [user, setUser] = useState(null);
  // checking | signed-out | signed-in
  const [status, setStatus] = useState("checking");

  // On first load, if a token is already in localStorage from a previous
  // session, verify it's still valid by asking the API who it belongs to
  // — rather than trusting it blindly until the first notes request fails.
  useEffect(() => {
    if (!hasStoredToken()) {
      setStatus("signed-out");
      return;
    }

    fetchCurrentUser()
      .then((currentUser) => {
        setUser(currentUser);
        setStatus("signed-in");
      })
      .catch(() => {
        setStatus("signed-out");
      });
  }, []);

  const signup = useCallback(async (fields) => {
    const newUser = await signupRequest(fields);
    setUser(newUser);
    setStatus("signed-in");
  }, []);

  const login = useCallback(async (fields) => {
    const loggedInUser = await loginRequest(fields);
    setUser(loggedInUser);
    setStatus("signed-in");
  }, []);

  const logout = useCallback(() => {
    logoutRequest();
    setUser(null);
    setStatus("signed-out");
  }, []);

  return { user, status, signup, login, logout };
}
