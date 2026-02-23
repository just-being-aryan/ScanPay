import { View, Text, TextInput, Pressable, StyleSheet, Keyboard } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { useCart } from "../context/CartContext";
import { getProductByArticle } from "../db/database";
import ProductPreviewSheet from "../components/ProductPreviewSheet";
import { PRODUCTS } from "../data/seedProducts";
export default function EnterArticle() {
  const { addToCart } = useCart();
  const [article, setArticle] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [toast, setToast] = useState<null | { name: string }>(null);
  const [locked, setLocked] = useState(false);

  const handleFind = async () => {
    if (locked || article.trim().length < 3) return;

    const product = await getProductByArticle(article.trim());
    if (!product) return;
    Keyboard.dismiss();

    const fullProduct = PRODUCTS.find(
  (p) => p.productId === product.productId
);

setSelectedProduct({
  productId: product.productId,
  sku: product.sku,
  articleNumber: product.articleNumber,
  barcode: product.barcode,
  name: product.name,
  size: product.size,
  price: product.price,
  mrp: product.mrp,
  image: fullProduct?.image ?? require("../assets/products/shirt.jpg"),
});
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={() => router.back()}>
        <Text style={styles.back}>←</Text>
      </Pressable>

      <Text style={styles.title}>Enter Article Number</Text>

      <View style={styles.card}>
        <Text style={styles.label}>
          Enter the article number found on the price tag.
        </Text>

        <TextInput
          placeholder="e.g. A1001"
          keyboardType="default"
          style={styles.input}
          value={article}
          onChangeText={setArticle}
          maxLength={12}
        />

        <Pressable style={styles.findBtn} onPress={handleFind}>
          <Text style={styles.findText}>Find Product</Text>
        </Pressable>
      </View>

      {toast && (
        <View style={styles.toastSpacer}>
          <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.toast}>
            <View style={styles.toastIcon}>
              <Ionicons name="checkmark" size={16} color="#fff" />
            </View>
            <View>
              <Text style={styles.toastTitle}>{toast.name} added</Text>
              <Text style={styles.toastSub}>
                Successfully added to cart
              </Text>
            </View>
          </Animated.View>
        </View>
      )}

      {selectedProduct && (
        <ProductPreviewSheet
          product={selectedProduct}
          onAdd={(item) => {
            addToCart({ ...item, qty: 1 });
            setSelectedProduct(null);
            setToast({ name: item.name });
            setLocked(true);

            setTimeout(() => {
              setToast(null);
              setLocked(false);
            }, 2000);
          }}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  back: {
    fontSize: 22,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 20,
    elevation: 3,
  },
  label: {
    color: "#555",
    marginBottom: 12,
    fontSize: 14,
  },
  input: {
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  findBtn: {
    backgroundColor: "#2563eb",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  findText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  toastSpacer: {
    marginTop: 40,
  },
  toast: {
    backgroundColor: "#0f172a",
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  toastIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#22c55e",
    alignItems: "center",
    justifyContent: "center",
  },
  toastTitle: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  toastSub: {
    color: "#cbd5f5",
    fontSize: 12,
    marginTop: 2,
  },
});