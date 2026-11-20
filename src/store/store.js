import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import favoritesReducer from "./favoritesSlice";
import { api } from "../api/api";
import { saveToStorage } from "../utils/storage";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    favorites: favoritesReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

store.subscribe(() => {
  const state = store.getState();
  saveToStorage("art-dz:cart", state.cart.items);
  saveToStorage("art-dz:favorites", state.favorites.ids);
});
