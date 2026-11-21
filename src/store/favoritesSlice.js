import { createSlice } from "@reduxjs/toolkit";
import { loadFromStorage } from "../utils/storage";

const isMongoId = (id) => typeof id === "string" && /^[a-f0-9]{24}$/i.test(id);

function loadIds() {
  const saved = loadFromStorage("art-dz:favorites", []);
  if (!Array.isArray(saved)) return [];
  return saved.filter(isMongoId);
}

const favoritesSlice = createSlice({
  name: "favorites",
  initialState: { ids: loadIds() },
  reducers: {
    toggleFavorite(state, action) {
      const id = action.payload;
      if (state.ids.includes(id)) {
        state.ids = state.ids.filter((i) => i !== id);
      } else {
        state.ids.push(id);
      }
    },
    pruneInvalidFavorites(state, action) {
      const validIds = new Set(action.payload);
      state.ids = state.ids.filter((id) => validIds.has(id));
    },
  },
});

export const { toggleFavorite, pruneInvalidFavorites } = favoritesSlice.actions;
export const selectFavoriteIds = (state) => state.favorites.ids;
export default favoritesSlice.reducer;
