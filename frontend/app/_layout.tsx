import { Stack } from "expo-router";
import { CartProvider } from "@/context/CartContext";
import { useEffect } from "react";
import { initDB, seedProducts } from "../db/database";

export default function RootLayout() {

  useEffect(() => {
  initDB();
  seedProducts();
}, []);

  return (
      <CartProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </CartProvider>
  );
}
