import { createContext, useContext, useState, ReactNode } from "react";
import { Product } from "../types/product";

type CartItem = Product & { qty: number };

type CartContextType = {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (sku: string) => void;
  updateQty: (sku: string, qty: number) => void;
  totalItems: number;
  totalAmount: number;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (item: CartItem) => {
    setItems((prev) => {
      const existing = prev.find((p) => p.sku === item.sku);
      if (existing) {
        return prev.map((p) =>
          p.sku === item.sku ? { ...p, qty: p.qty + item.qty } : p
        );
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (sku: string) => {
    setItems((prev) => prev.filter((p) => p.sku !== sku));
  };

  const updateQty = (sku: string, qty: number) => {
    if (qty < 1) return;
    setItems((prev) =>
      prev.map((p) => (p.sku === sku ? { ...p, qty } : p))
    );
  };

  const totalItems = items.reduce((sum, i) => sum + i.qty, 0);
  const totalAmount = items.reduce((sum, i) => sum + i.price * i.qty, 0);

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
