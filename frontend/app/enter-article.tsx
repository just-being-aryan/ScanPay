import { View, Text, TextInput, Pressable, StyleSheet, Alert } from "react-native";
import { useState } from "react";
import { router } from "expo-router";

import ProductPreviewSheet from "../components/ProductPreviewSheet";
import { PRODUCTS } from "../data/products";
import { useCart } from "../context/CartContext";

export default function EnterArticle() {
  const [article, setArticle] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const { addToCart } = useCart();

  const handleFindProduct = () => {
    const key = article.trim();

    if (!key) {
      Alert.alert("Invalid Article", "Please enter an article number.");
      return;
    }

    const product = PRODUCTS[key];

    if (!product) {
      Alert.alert("Not Found", "No product found for this article number.");
      return;
    }

    setSelectedProduct(product);
  };

  return (
    <View
      style={[
        styles.container,
        selectedProduct && styles.containerWithPreview,
      ]}
    >
      <Pressable onPress={() => router.back()} style={styles.backRow}>
        <Text style={styles.backArrow}>←</Text>
        <Text style={styles.headerTitle}>Enter Article Number</Text>
      </Pressable>

      <View style={styles.card}>
        <Text style={styles.label}>
          Enter the 6-digit article number found on the price tag.
        </Text>

        <TextInput
          value={article}
          onChangeText={setArticle}
          keyboardType="default"
          maxLength={6}
          style={styles.input}
        />

        <Pressable style={styles.findBtn} onPress={handleFindProduct}>
          <Text style={styles.findText}>Find Product</Text>
        </Pressable>
      </View>

      {selectedProduct && (
        <ProductPreviewSheet
            product={selectedProduct}
            onAdd={(item) => {
            addToCart(item);
            setSelectedProduct(null);
            router.back();
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

  containerWithPreview: {
    paddingBottom: 220,
  },

  backRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },

  backArrow: {
    fontSize: 22,
    marginRight: 8,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    elevation: 3,
  },

  label: {
    color: "#555",
    fontSize: 14,
    marginBottom: 14,
    textAlign: "center",
  },

  input: {
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: 2,
    textAlign: "center",
    marginBottom: 20,
  },

  findBtn: {
    backgroundColor: "#2563eb",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },

  findText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
