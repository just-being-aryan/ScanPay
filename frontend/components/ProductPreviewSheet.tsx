import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import { useState, useEffect } from "react";
import { Product } from "../types/product";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  runOnJS,
} from "react-native-reanimated";

type Props = {
  product: Product;
  onAdd: (item: Product & { qty: number }) => void;
  onClose: () => void;
};

export default function ProductPreviewSheet({
  product,
  onAdd,
  onClose,
}: Props) {
  const [qty, setQty] = useState(1);

  const translateY = useSharedValue(40);
  const scale = useSharedValue(0.94);
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 120 });
    translateY.value = withTiming(0, { duration: 180 });
    scale.value = withSpring(1, {
      damping: 12,
      stiffness: 180,
      mass: 0.6,
    });
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [
        { translateY: translateY.value },
        { scale: scale.value },
      ],
    };
  });

  const closeWithAnimation = () => {
    opacity.value = withTiming(0, { duration: 120 });
    translateY.value = withTiming(40, { duration: 160 });
    scale.value = withTiming(0.94, { duration: 160 }, () => {
      runOnJS(onClose)();
    });
  };

  return (
    <Animated.View style={[styles.wrapper, animatedStyle]}>
      <View style={styles.card}>
        <View style={styles.imageWrap}>
          <Image source={product.image} style={styles.image} />
        </View>

        <View style={styles.info}>
          <View style={styles.topBlock}>
            <View style={styles.titleRow}>
              <Text style={styles.name}>{product.name}</Text>
              <View style={styles.priceCol}>
                <Text style={styles.price}>₹{product.price}</Text>
                <Text style={styles.oldPrice}>₹2240</Text>
              </View>
            </View>

            <View style={styles.metaRow}>
              <View style={styles.metaPill}>
                <Text style={styles.metaText}>{product.size}</Text>
              </View>
              <Text style={styles.metaMuted}>Art. {product.sku}</Text>
            </View>
          </View>

          <View style={styles.qtyBlock}>
            <Text style={styles.qtyLabel}>QTY</Text>

            <View style={styles.qtyControls}>
              <Pressable
                style={styles.qtyBtn}
                onPress={() => setQty(Math.max(1, qty - 1))}
              >
                <Text style={styles.qtyText}>−</Text>
              </Pressable>

              <Text style={styles.qtyValue}>{qty}</Text>

              <Pressable
                style={styles.qtyBtn}
                onPress={() => setQty(qty + 1)}
              >
                <Text style={styles.qtyText}>+</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.actions}>
            <Pressable style={styles.cancelBtn} onPress={closeWithAnimation}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>

            <Pressable
              style={styles.addBtn}
              onPress={() => {
                onAdd({ ...product, qty });
                closeWithAnimation();
              }}
            >
              <Text style={styles.addText}>Add to Cart</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 20,
    paddingHorizontal: 16,
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 20,
    overflow: "hidden",
    elevation: 12,
  },

  imageWrap: {
    padding: 2,
    backgroundColor: "#fff",
  },

  image: {
    width: 120,
    height: "100%",
    borderRadius: 16,
    resizeMode: "cover",
  },

  info: {
    flex: 1,
    padding: 14,
    justifyContent: "space-between",
  },

  topBlock: {
    gap: 6,
  },

  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  name: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111",
    flexShrink: 1,
  },

  priceCol: {
    alignItems: "flex-end",
  },

  price: {
    fontSize: 17,
    fontWeight: "700",
    color: "#16a34a",
  },

  oldPrice: {
    fontSize: 12,
    color: "#9ca3af",
    textDecorationLine: "line-through",
  },

  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  metaPill: {
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },

  metaText: {
    fontSize: 11,
    color: "#374151",
  },

  metaMuted: {
    fontSize: 11,
    color: "#6b7280",
  },

  qtyBlock: {
    marginTop: 8,
  },

  qtyLabel: {
    fontSize: 11,
    color: "#6b7280",
    marginBottom: 6,
  },

  qtyControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  qtyBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
  },

  qtyText: {
    fontSize: 18,
    color: "#111",
  },

  qtyValue: {
    fontSize: 13,
    width: 20,
    textAlign: "center",
  },

  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },

  cancelBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    alignItems: "center",
  },

  cancelText: {
    fontSize: 13,
    color: "#374151",
    fontWeight: "500",
  },

  addBtn: {
    flex: 1.2,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "#2563eb",
    alignItems: "center",
  },

  addText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#fff",
  },
});
