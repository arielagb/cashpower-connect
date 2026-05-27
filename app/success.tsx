import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../constants/colors";
import { mockMeters } from "../data/mockData";

export default function SuccessScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const meter = mockMeters.find((m) => m.id === params.meterId) ?? mockMeters[0];
  const amount = parseInt(params.amount as string) || 5000;
  const token = Array.from({length: 24}, () => Math.floor(Math.random() * 10)).join('');
  const kwh = Math.round(amount / 120);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.body}>
        {/* Success icon */}
        <View style={styles.iconWrap}>
          <Ionicons name="checkmark-circle" size={64} color={Colors.primary} />
        </View>

        <Text style={styles.title}>Recharge réussie !</Text>
        <Text style={styles.sub}>
          {amount.toLocaleString("fr")} FCFA ont été crédités sur{"\n"}
          <Text style={{ fontWeight: "700", color: Colors.primary }}>{meter.name}</Text>
        </Text>

        {/* Token card */}
        <View style={styles.tokenCard}>
          <View style={styles.tokenHeader}>
            <Ionicons name="key-outline" size={18} color={Colors.primary} />
            <Text style={styles.tokenLabel}>Code entré sur le compteur</Text>
          </View>
          <Text style={styles.tokenCode}>
            {token.match(/.{1,4}/g)?.join(' ')}
          </Text>
        </View>

        {/* Summary */}
        <View style={styles.summaryCard}>
          {[
            { label: "Compteur", value: meter.name },
            { label: "Référence", value: `# ${meter.reference}` },
            { label: "Montant payé", value: `${(amount + Math.round(amount * 0.1)).toLocaleString("fr")} FCFA` },
            { label: "kWh crédités", value: `≈ ${kwh} kWh` },
          ].map((row, i) => (
            <View key={i} style={[styles.summaryRow, i > 0 && styles.summaryRowBorder]}>
              <Text style={styles.summaryLabel}>{row.label}</Text>
              <Text style={styles.summaryVal}>{row.value}</Text>
            </View>
          ))}
        </View>

        {/* Actions */}
        <TouchableOpacity
          style={styles.btnPrimary}
          onPress={() => router.replace("/(tabs)")}
        >
          <Ionicons name="home-outline" size={18} color={Colors.white} />
          <Text style={styles.btnText}>Retour à l'accueil</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnSecondary}
          onPress={() => router.replace("/(tabs)/conso")}
        >
          <Text style={styles.btnSecondaryText}>Voir l'historique</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.surface },
  body: { flex: 1, padding: 24, alignItems: "center", justifyContent: "center" },
  iconWrap: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: Colors.primaryLight,
    alignItems: "center", justifyContent: "center", marginBottom: 20,
  },
  title: { fontSize: 24, fontWeight: "700", color: Colors.dark, marginBottom: 8 },
  sub: { fontSize: 15, color: Colors.muted, textAlign: "center", lineHeight: 22, marginBottom: 24 },
  tokenCard: {
    backgroundColor: Colors.primaryLight, borderRadius: 16,
    padding: 20, width: "100%", alignItems: "center",
    marginBottom: 16, borderWidth: 1.5,
    borderStyle: "dashed", borderColor: Colors.primary,
  },
  tokenHeader: { flexDirection: "row", gap: 6, alignItems: "center", marginBottom: 10 },
  tokenLabel: { fontSize: 13, color: Colors.primary, fontWeight: "600" },
  tokenCode: { fontSize: 18, fontWeight: "800", color: Colors.primary, letterSpacing: 3 },  tokenNote: { fontSize: 11, color: Colors.primary, opacity: 0.7, marginTop: 8 },
  summaryCard: {
    backgroundColor: Colors.white, borderRadius: 14,
    width: "100%", marginBottom: 24,
    borderWidth: 0.5, borderColor: Colors.border,
    overflow: "hidden",
  },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", padding: 12 },
  summaryRowBorder: { borderTopWidth: 0.5, borderTopColor: Colors.border },
  summaryLabel: { fontSize: 13, color: Colors.muted },
  summaryVal: { fontSize: 13, color: Colors.dark, fontWeight: "600" },
  btnPrimary: {
    backgroundColor: Colors.primary, borderRadius: 14,
    padding: 16, width: "100%", alignItems: "center",
    flexDirection: "row", justifyContent: "center", gap: 8, marginBottom: 10,
  },
  btnText: { color: Colors.white, fontSize: 16, fontWeight: "600" },
  btnSecondary: {
    padding: 16, width: "100%", alignItems: "center",
    borderRadius: 14, borderWidth: 1.5, borderColor: Colors.border,
  },
  btnSecondaryText: { color: Colors.muted, fontSize: 15, fontWeight: "500" },
});
