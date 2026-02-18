import { View, Text, StyleSheet } from "react-native";

type Props = {
  subtotal: number;
  discount: number;
  total: number;
};

export default function OrderSummaryCard({
  subtotal,
  discount,
  total,
}: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Order Summary</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Subtotal (Incl. GST)</Text>
        <Text style={styles.value}>₹{subtotal}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Product Discount</Text>
        <Text style={[styles.value, styles.discount]}>
          − ₹{discount}
        </Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.row}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>₹{total}</Text>
      </View>

      {discount > 0 && (
        <View style={styles.savings}>
          <Text style={styles.savingsText}>
            You save ₹{discount} on this order
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  label: {
    fontSize: 13,
    color: "#555",
  },
  value: {
    fontSize: 13,
    color: "#111",
  },
  discount: {
    color: "#16a34a",
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 10,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
  totalValue: {
    fontSize: 15,
    fontWeight: "700",
  },
  savings: {
    marginTop: 10,
    backgroundColor: "#ecfdf5",
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  savingsText: {
    fontSize: 12,
    color: "#15803d",
    fontWeight: "500",
  },
});
