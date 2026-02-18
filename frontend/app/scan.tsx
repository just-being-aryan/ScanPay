import { View, Text, Pressable, StyleSheet } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import Animated, {
  FadeIn,
  FadeOut,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
} from "react-native-reanimated";
import { useCart } from "../context/CartContext";

import ProductPreviewSheet from "../components/ProductPreviewSheet";
import { PRODUCTS } from "../data/products";

export default function ScanScreen() {
  const { addToCart } = useCart();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const rotation = useSharedValue(0);

  const spinStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  if (!permission) {
    return <View style={{ flex: 1, backgroundColor: "#000" }} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "#fff", marginBottom: 10 }}>
          Camera permission is required
        </Text>
        <Pressable style={styles.btn} onPress={requestPermission}>
          <Text style={{ color: "#fff" }}>Grant Permission</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>ScanPay</Text>
        <Ionicons name="home-outline" size={22} color="#fff" />
      </View>

      {/* CAMERA */}
      <View style={styles.cameraSection}>
        <CameraView
          style={StyleSheet.absoluteFill}
          barcodeScannerSettings={{
            barcodeTypes: ["qr", "ean13", "code128"],
          }}
          onBarcodeScanned={({ data }) => {
            if (scanned || selectedProduct) return;

            setScanned(true);
            setIsCapturing(true);

            rotation.value = withRepeat(
              withTiming(360, { duration: 600 }),
              -1
            );

            setTimeout(() => {
              const product = PRODUCTS[data];
              if (product) setSelectedProduct(product);
            }, 500);

            setTimeout(() => {
              rotation.value = 0;
              setIsCapturing(false);
              setScanned(false);
            }, 600);
          }}
        />

        {!selectedProduct && (
          <Animated.View
            entering={FadeIn}
            exiting={FadeOut}
            style={styles.capturePill}
          >
            {isCapturing && (
              <Animated.View style={spinStyle}>
                <Ionicons name="reload" size={18} color="#fff" />
              </Animated.View>
            )}

            <Text style={styles.scanText}>
              {isCapturing
                ? "Capturing… hold steady"
                : "SCAN A BARCODE OR QR CODE"}
            </Text>
          </Animated.View>
        )}
      </View>

      {/* BOTTOM */}
      <View style={styles.bottomSection}>
        {!selectedProduct ? (
          <>
            <Pressable
              style={styles.articleRow}
              onPress={() => router.push("/enter-article")}
            >
              <Ionicons name="keypad-outline" size={18} color="#fff" />
              <Text style={styles.articleText}>
                Can't scan? Enter Article No.
              </Text>
            </Pressable>

            <View style={styles.quickAddRow}>
              <View style={styles.checkbox} />
              <Text style={styles.quickAddText}>
                Enable Quick Add to Cart
              </Text>
            </View>
          </>
        ) : (
          <ProductPreviewSheet
            product={selectedProduct}
            onAdd={(item) => {
              addToCart(item);
              setSelectedProduct(null);
            }}
            onClose={() => {
              setSelectedProduct(null);
            }}
          />
        )}
      </View>

      {/* FOOTER */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Internet required only for payment
        </Text>

        <Pressable style={styles.cartBtn} onPress={() => router.push("/cart")}>
          <Text style={styles.cartLeft}>View Cart</Text>
          <Text style={styles.cartRight}>View</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },

  header: {
    height: 56,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  headerTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "600",
  },

  cameraSection: {
    flex: 6,
    justifyContent: "center",
    alignItems: "center",
  },

  capturePill: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "rgba(0,0,0,0.65)",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 30,
  },

  scanText: {
    color: "#fff",
    fontSize: 14,
  },

  bottomSection: {
    flex: 4,
    paddingHorizontal: 20,
    paddingTop: 40,
    alignItems: "center",
  },

  articleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 10,
  },

  articleText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "500",
  },

  quickAddRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#777",
    marginRight: 10,
  },

  quickAddText: {
    color: "#aaa",
    fontSize: 14,
  },

  footer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  footerText: {
    color: "#aaa",
    textAlign: "center",
    fontSize: 12,
    marginBottom: 10,
  },

  cartBtn: {
    backgroundColor: "#1f2937",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 18,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  cartLeft: {
    color: "#888",
    fontSize: 16,
  },

  cartRight: {
    color: "#888",
    fontSize: 14,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },

  btn: {
    backgroundColor: "#1f2937",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
});
