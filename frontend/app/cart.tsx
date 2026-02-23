import { View, Text, Image, Pressable, StyleSheet, ScrollView } from "react-native";
import { useCart } from "../context/CartContext";
import { router } from "expo-router";
import OrderSummaryCard from "../components/OrderSummaryCard";


export default function CartPage() {
  const { items, updateQty, removeFromCart, totalAmount } = useCart();
 
  const subtotal = items.reduce(
    (sum, item) => sum + item.mrp * item.qty,
    0
  );

  const total = items.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const discount = subtotal - total;

  return (
    <View style={styles.container}>
      
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.back}>←</Text>
        </Pressable>
        <Text style={styles.title}>Shopping Cart</Text>
      </View>

    
      <ScrollView
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      >
        {items.map((item) => (
          <View key={item.sku} style={styles.card}>
            <Image source={item.image} style={styles.image} />

            <View style={styles.info}>
              <View style={styles.row}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.price}>₹{item.price}</Text>
              </View>

              <Text style={styles.meta}>
                {item.size} · Art. {item.sku}
              </Text>

              <View style={styles.qtyRow}>
                <Pressable
                  style={styles.qtyBtn}
                  onPress={() => updateQty(item.productId, item.qty - 1)}
                >
                  <Text style={styles.qtyText}>−</Text>
                </Pressable>

                <Text style={styles.qtyValue}>{item.qty}</Text>

                <Pressable
                  style={styles.qtyBtn}
                  onPress={() => updateQty(item.productId, item.qty + 1)}
                >
                  <Text style={styles.qtyText}>+</Text>
                </Pressable>

                <Pressable onPress={() => removeFromCart(item.sku)}>
                  <Text style={styles.remove}>Remove</Text>
                </Pressable>
              </View>
            </View>
          </View>
        ))}

       
        <OrderSummaryCard
          subtotal={subtotal}
          discount={discount}
          total={total}
        />
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalAmount}>₹{totalAmount}</Text>
        </View>

        <Pressable
          style={[
            styles.payBtn,
            items.length === 0 && { opacity: 0.5 },
          ]}
          disabled={items.length === 0}
        >
          <Text style={styles.payText}>Proceed to Pay</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },



  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },

  back: {
    fontSize: 22,
    marginRight: 10,
  },

  title: {
    fontSize: 18,
    fontWeight: "600",
  },

  list: {
    padding: 16,
    gap: 14,
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
  },

  image: {
    width: 100,
    height: "100%",
  },

  info: {
    flex: 1,
    padding: 12,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  name: {
    fontSize: 14,
    fontWeight: "600",
  },

  price: {
    fontSize: 15,
    fontWeight: "700",
    color: "#16a34a",
  },

  meta: {
    fontSize: 11,
    color: "#6b7280",
    marginTop: 4,
  },

  qtyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 10,
  },

  qtyBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
  },

  qtyText: {
    fontSize: 16,
  },

  qtyValue: {
    fontSize: 13,
    width: 20,
    textAlign: "center",
  },

  remove: {
    marginLeft: "auto",
    fontSize: 12,
    color: "#ef4444",
  },

  footer: {
    padding: 20,
    backgroundColor: "#fff",
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },

  totalLabel: {
    fontSize: 14,
    color: "#555",
  },

  totalAmount: {
    fontSize: 18,
    fontWeight: "700",
  },

  payBtn: {
    backgroundColor: "#2563eb",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },

  payText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
