import { createSlice } from "@reduxjs/toolkit";
import { loadFromStorage } from "../utils/storage";

const MAX_QUANTITY = 10;
const isMongoId = (id) => typeof id === "string" && /^[a-f0-9]{24}$/i.test(id);

function loadItems() {
  const saved = loadFromStorage("art-dz:cart", []);
  if (!Array.isArray(saved)) return [];

  return saved.filter(
    (item) =>
      isMongoId(item?.id) &&
      Number.isInteger(item?.quantity) &&
      item.quantity >= 1 &&
      item.quantity <= MAX_QUANTITY
  );
}

const cartSlice = createSlice({
  name: "cart",
  initialState: { items: loadItems() },
  reducers: {
    addItem(state, action) {
      const { id, quantity } = action.payload;
      const existing = state.items.find((item) => item.id === id);

      if (existing) {
        existing.quantity = Math.min(existing.quantity + quantity, MAX_QUANTITY);
      } else {
        state.items.push({ id, quantity: Math.min(quantity, MAX_QUANTITY) });
      }
    },

    removeItem(state, action) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },

    setQuantity(state, action) {
      const { id, quantity } = action.payload;
      const item = state.items.find((i) => i.id === id);
      if (item) item.quantity = Math.min(Math.max(quantity, 1), MAX_QUANTITY);
    },

    pruneInvalidItems(state, action) {
      const validIds = new Set(action.payload);
      state.items = state.items.filter((item) => validIds.has(item.id));
    },

    clearCart(state) {
      state.items = [];
    },
  },
});

export const { addItem, removeItem, setQuantity, pruneInvalidItems, clearCart } = cartSlice.actions;

export const selectCartItems = (state) => state.cart.items;

export const selectCartCount = (state) =>
  state.cart.items.reduce((total, item) => total + item.quantity, 0);

export default cartSlice.reducer;
