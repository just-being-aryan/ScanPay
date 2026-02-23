import { createContext, useContext, useState, ReactNode } from "react";
import { Product } from "../types/product";

type CartItem = Product & { qty: number };

type CartContextType = {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string) => void;
  updateQty: (productId: string, qty: number) => void;
  totalItems: number;
  totalAmount: number;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (item: CartItem) => {
    setItems((prev) => {
      const existing = prev.find(
        (p) => p.productId === item.productId
      );

      if (existing) {
        return prev.map((p) =>
          p.productId === item.productId
            ? { ...p, qty: p.qty + item.qty }
            : p
        );
      }

      return [...prev, item];
    });
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) =>
      prev.filter((p) => p.productId !== productId)
    );
  };

  const updateQty = (productId: string, qty: number) => {
    if (qty < 1) return;
    setItems((prev) =>
      prev.map((p) =>
        p.productId === productId ? { ...p, qty } : p
      )
    );
  };

  const totalItems = items.reduce((sum, i) => sum + i.qty, 0);
  const totalAmount = items.reduce(
    (sum, i) => sum + i.price * i.qty,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQty,
        totalItems,
        totalAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
};