import { createSlice } from "@reduxjs/toolkit";

const STORAGE_KEY = "art-dz:auth";

function loadAuthState() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return { token: null, user: null };
    const parsed = JSON.parse(raw);
    if (typeof parsed?.token === "string" && parsed.token.length > 0) {
      return { token: parsed.token, user: parsed.user ?? null };
    }
  } catch {
    // Ignore les erreurs de lecture JSON
  }
  return { token: null, user: null };
}

const authSlice = createSlice({
  name: "auth",
  initialState: loadAuthState(),
  reducers: {
    setCredentials(state, action) {
      const { token, user } = action.payload;
      if (token !== undefined) state.token = token;
      if (user !== undefined) state.user = user;
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ token: state.token, user: state.user })
      );
    },
    logout(state) {
      state.token = null;
      state.user = null;
      sessionStorage.removeItem(STORAGE_KEY);
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export const selectToken = (state) => state.auth.token;
export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => Boolean(state.auth.token);
export const selectIsAdmin = (state) => state.auth.user?.role === "admin";

export default authSlice.reducer;
