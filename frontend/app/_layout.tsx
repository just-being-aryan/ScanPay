import { Stack } from "expo-router";
import { CartProvider } from "@/context/CartContext";
import { useEffect } from "react";
import { initDB, seedProducts, initCartTable } from "../db/database";
export default function RootLayout() {

  useEffect(() => {
  initDB();
  seedProducts();
  initCartTable();
}, []);

  return (
      <CartProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </CartProvider>
  );
}
