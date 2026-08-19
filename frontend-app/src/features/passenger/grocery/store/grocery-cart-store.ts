import { create } from 'zustand';
import type { CartLine, GroceryProduct, GroceryStore } from '@/types/grocery';

interface GroceryCartState {
  store: GroceryStore | null;
  lines: CartLine[];
  addItem: (store: GroceryStore, product: GroceryProduct) => void;
  increment: (productId: string) => void;
  decrement: (productId: string) => void;
  clear: () => void;
}

export const useGroceryCart = create<GroceryCartState>((set) => ({
  store: null,
  lines: [],

  addItem: (store, product) =>
    set((state) => {
      const existing = state.lines.find((line) => line.product.id === product.id);
      if (existing) {
        return {
          store,
          lines: state.lines.map((line) =>
            line.product.id === product.id ? { ...line, quantity: line.quantity + 1 } : line,
          ),
        };
      }
      return { store, lines: [...state.lines, { product, quantity: 1 }] };
    }),

  increment: (productId) =>
    set((state) => ({
      lines: state.lines.map((line) =>
        line.product.id === productId ? { ...line, quantity: line.quantity + 1 } : line,
      ),
    })),

  decrement: (productId) =>
    set((state) => ({
      lines: state.lines
        .map((line) =>
          line.product.id === productId ? { ...line, quantity: line.quantity - 1 } : line,
        )
        .filter((line) => line.quantity > 0),
    })),

  clear: () => ({ store: null, lines: [] }),
}));

export const selectCartSubtotal = (state: GroceryCartState): number =>
  state.lines.reduce((sum, line) => sum + line.product.price * line.quantity, 0);

export const selectCartItemCount = (state: GroceryCartState): number =>
  state.lines.reduce((sum, line) => sum + line.quantity, 0);