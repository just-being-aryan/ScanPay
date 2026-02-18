import { View, Text, Pressable } from "react-native";
import { router } from "expo-router";
export default function ScanScreen() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#000",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ color: "#fff", fontSize: 22 }}>ScanPay</Text>

        <Pressable
        style={{
          marginTop: 20,
          backgroundColor: "#1f2937",
          paddingVertical: 12,
          paddingHorizontal: 20,
          borderRadius: 12,
        }}
        onPress={() => router.push("/scan")}
      >
        <Text style={{ color: "#fff" }}>
          Scan a Barcode or QR Code
        </Text>
      </Pressable>
      
    </View>
  );
}
