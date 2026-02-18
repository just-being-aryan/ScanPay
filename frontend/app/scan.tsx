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
  const [quickAdd, setQuickAdd] = useState(false);
  const [toast, setToast] = useState<null | { name: string }>(null);
  const [scanLocked, setScanLocked] = useState(false);

  const rotation = useSharedValue(0);

  const spinStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

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
      <View style={styles.header}>
        <Text style={styles.headerTitle}>ScanPay</Text>
        <Ionicons name="home-outline" size={22} color="#fff" />
      </View>

      <View style={styles.cameraSection}>
        <CameraView
          style={StyleSheet.absoluteFill}
          barcodeScannerSettings={{
            barcodeTypes: ["qr", "ean13", "code128"],
          }}
          onBarcodeScanned={({ data }) => {
            if (scanned || selectedProduct || scanLocked) return;

            setScanned(true);
            setIsCapturing(true);

            rotation.value = withRepeat(
              withTiming(360, { duration: 600 }),
              -1
            );

            setTimeout(() => {
              const product = PRODUCTS[data];
              if (!product) return;

              if (quickAdd) {
                addToCart({ ...product, qty: 1 });
                setToast({ name: product.name });
                setScanLocked(true);

                setTimeout(() => {
                  setToast(null);
                  setScanLocked(false);
                }, 2000);
              } else {
                setSelectedProduct(product);
              }
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

      <View style={styles.bottomSection}>
        {!selectedProduct ? (
          <View style={styles.bottomContent}>
            <Pressable
              style={styles.articleRow}
              onPress={() => router.push("/enter-article")}
            >
              <Ionicons name="keypad-outline" size={18} color="#fff" />
              <Text style={styles.articleText}>
                Can't scan? Enter Article No.
              </Text>
            </Pressable>

            <Pressable
              style={styles.quickAddRow}
              onPress={() => setQuickAdd((v) => !v)}
            >
              <View
                style={[
                  styles.checkbox,
                  quickAdd && styles.checkboxActive,
                ]}
              />
              <Text style={styles.quickAddText}>
                Enable Quick Add to Cart
              </Text>
            </Pressable>

            {toast && (
              <View style={styles.toastSpacer}>
                <Animated.View
                  entering={FadeIn}
                  exiting={FadeOut}
                  style={styles.toast}
                >
                  <View style={styles.toastIcon}>
                    <Ionicons name="checkmark" size={16} color="#fff" />
                  </View>
                  <View>
                    <Text style={styles.toastTitle}>
                      {toast.name} added
                    </Text>
                    <Text style={styles.toastSub}>
                      Successfully added to cart
                    </Text>
                  </View>
                </Animated.View>
              </View>
            )}
          </View>
        ) : (
          <ProductPreviewSheet
            product={selectedProduct}
            onAdd={(item) => {
              addToCart(item);
              setSelectedProduct(null);
              setToast({ name: item.name });
              setScanLocked(true);

              setTimeout(() => {
                setToast(null);
                setScanLocked(false);
              }, 2000);
            }}
            onClose={() => setSelectedProduct(null)}
          />
        )}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Internet required only for payment
        </Text>

        <Pressable
          style={styles.cartBtn}
          onPress={() => router.push("/cart")}
        >
          <Text style={styles.cartLeft}>View Cart</Text>
          <Text style={styles.cartRight}>View</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },

  header: {
    height: 56,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  headerTitle: { color: "#fff", fontSize: 22, fontWeight: "600" },

  cameraSection: { flex: 6, justifyContent: "center", alignItems: "center" },

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

  scanText: { color: "#fff", fontSize: 14 },

  bottomSection: {
    flex: 4,
    paddingHorizontal: 20,
    paddingTop: 32,
  },

  bottomContent: {
    alignItems: "center",
    gap: 24,
  },

  articleRow: {
    flexDirection: "row",
    alignItems: "center",
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

  checkboxActive: {
    backgroundColor: "#2563eb",
    borderColor: "#2563eb",
  },

  quickAddText: { color: "#aaa", fontSize: 14 },

  toastSpacer: { marginTop: 35 },

  toast: {
    width: "100%",
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

  toastTitle: { color: "#fff", fontSize: 14, fontWeight: "600" },
  toastSub: { color: "#cbd5f5", fontSize: 12, marginTop: 2 },

  footer: { paddingHorizontal: 20, paddingBottom: 20 },

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

  cartLeft: { color: "#888", fontSize: 16 },
  cartRight: { color: "#888", fontSize: 14 },

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
