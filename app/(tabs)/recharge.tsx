import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, TextInput, Alert,
} from "react-native";
import { useState, useEffect } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "../../constants/colors";
import { dataStore } from "../../data/mockData";
import { Image } from "react-native";

const QUICK_AMOUNTS = [1000, 2000, 5000, 10000, 20000];

export default function RechargeTab() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();

  const [meters, setMeters] = useState(dataStore.getMeters());
  const defaultMeter = params.meterId
    ? dataStore.getMeterById(params.meterId as string)
    : meters[0];
  const [selectedMeter, setSelectedMeter] = useState(defaultMeter);
  const [amount, setAmount] = useState("5000");

  useEffect(() => {
    const unsubscribe = dataStore.subscribe(() => {
      setMeters([...dataStore.getMeters()]);
    });
    return unsubscribe;
  }, []);

  const currentSelectedMeter = meters.find((m) => m.id === selectedMeter.id) || selectedMeter;

  const numAmount = parseInt(amount) || 0;
  const fee = Math.round(numAmount * 0.1);
  const total = numAmount + fee;
  const kwhEstimate = Math.round(numAmount / 120);

  const handleConfirmRecharge = () => {
    if (numAmount < 500) {
      Alert.alert("Montant insuffisant", "Le minimum est 500 FCFA.");
      return;
    }
    dataStore.rechargeMeter(currentSelectedMeter.id, numAmount);
    router.push({
      pathname: "/otp",
      params: { amount, meterId: currentSelectedMeter.id },
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: Colors.primary }]}>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Recharger</Text>
        </View>

        <View style={styles.body}>
          {/* Meter selector */}
          <Text style={styles.sectionTitle}>Choisir un compteur</Text>
          {meters.map((m) => {
            const isSelected = currentSelectedMeter.id === m.id;
            return (
              <TouchableOpacity
                key={m.id}
                style={[styles.meterOption, isSelected && styles.meterOptionSelected]}
                onPress={() => setSelectedMeter(m)}
              >
                <View style={styles.meterOptionLeft}>
                  <View style={[styles.meterOptionRadio, isSelected && styles.meterOptionRadioSelected]}>
                    {isSelected && <View style={styles.meterOptionRadioDot} />}
                  </View>
                  <View>
                    <Text style={styles.meterOptionName}>{m.name}</Text>
                    <Text style={styles.meterOptionRef}># {m.reference}</Text>
                  </View>
                </View>
                <Text style={[styles.meterOptionKwh, { color: m.kwhRemaining <= 5 ? Colors.accent : Colors.primary }]}>
                  {m.kwhRemaining} kWh
                </Text>
              </TouchableOpacity>
            );
          })}

          {/* Amount */}
          <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Montant de recharge</Text>
          <View style={styles.amountInput}>
            <Ionicons name="cash-outline" size={20} color={Colors.primary} />
            <TextInput
              style={styles.amountTextInput}
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              placeholder="Ex: 5000"
              placeholderTextColor={Colors.muted}
            />
            <Text style={styles.amountCurrency}>FCFA</Text>
          </View>
          <View style={styles.chipsRow}>
            {QUICK_AMOUNTS.map((a) => (
              <TouchableOpacity
                key={a}
                style={[styles.chip, amount === String(a) && styles.chipSelected]}
                onPress={() => setAmount(String(a))}
              >
                <Text style={[styles.chipText, amount === String(a) && styles.chipTextSelected]}>
                  {a >= 1000 ? `${a / 1000}k` : a}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Fee breakdown */}
          <View style={styles.feeBox}>
            <View style={styles.feeRow}>
              <Text style={styles.feeLabel}>Montant recharge</Text>
              <Text style={styles.feeVal}>{numAmount.toLocaleString("fr")} FCFA</Text>
            </View>
            <View style={styles.feeRow}>
              <Text style={styles.feeLabel}>Frais de service (10%)</Text>
              <Text style={[styles.feeVal, { color: Colors.accent }]}>{fee.toLocaleString("fr")} FCFA</Text>
            </View>
            <View style={[styles.feeRow, styles.feeTotalRow]}>
              <Text style={styles.feeTotalLabel}>Total à payer</Text>
              <Text style={styles.feeTotalVal}>{total.toLocaleString("fr")} FCFA</Text>
            </View>
            <View style={styles.feeRow}>
              <Text style={styles.feeLabel}>kWh estimés</Text>
              <Text style={[styles.feeVal, { color: Colors.primary, fontWeight: "600" }]}>≈ {kwhEstimate} kWh</Text>
            </View>
          </View>

          {/* Payment method — Yas */}
          <Text style={[styles.sectionTitle, { marginTop: 8 }]}>Méthode de paiement</Text>
          <View style={styles.paymentCard}>
            <View style={styles.paymentIcon}>
              <Image
                source={require("../../assets/images/yas-logo.png")}
                style={{ width: 32, height: 32, borderRadius: 6 }}
                resizeMode="contain"
              />
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <Text style={styles.paymentName}>Mix by Yas</Text>
              </View>
              <Text style={styles.paymentSub}>+228 99 45 67 89</Text>
            </View>
            <Ionicons name="checkmark-circle" size={22} color={Colors.primary} />
          </View>

          {/* CTA */}
          <TouchableOpacity
            style={[styles.btnPrimary, numAmount < 500 && styles.btnDisabled]}
            onPress={handleConfirmRecharge}
          >
            <Ionicons name="flash" size={18} color={Colors.white} />
            <Text style={styles.btnPrimaryText}>Confirmer la recharge</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingTop: 48,  // ← augmente ici (était 12)
    paddingBottom: 20,
    backgroundColor: Colors.primary,
  },  headerTitle: { color: Colors.white, fontSize: 20, fontWeight: "700" },
  body: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 20, minHeight: 600,
  },
  sectionTitle: {
    fontSize: 12, fontWeight: "600", color: Colors.muted,
    textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 10,
  },
  meterOption: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    padding: 14, borderRadius: 12, borderWidth: 1.5,
    borderColor: Colors.border, marginBottom: 8, backgroundColor: Colors.white,
  },
  meterOptionSelected: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight },
  meterOptionLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  meterOptionRadio: {
    width: 20, height: 20, borderRadius: 10, borderWidth: 2,
    borderColor: Colors.muted, alignItems: "center", justifyContent: "center",
  },
  meterOptionRadioSelected: { borderColor: Colors.primary },
  meterOptionRadioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.primary },
  meterOptionName: { fontSize: 14, fontWeight: "600", color: Colors.dark },
  meterOptionRef: { fontSize: 11, color: Colors.muted, marginTop: 1 },
  meterOptionKwh: { fontSize: 13, fontWeight: "600" },
  amountInput: {
    flexDirection: "row", alignItems: "center", gap: 10,
    borderWidth: 1.5, borderColor: Colors.border,
    borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12,
    backgroundColor: Colors.white, marginBottom: 10,
  },
  amountTextInput: { flex: 1, fontSize: 18, color: Colors.dark, fontWeight: "600" },
  amountCurrency: { fontSize: 14, color: Colors.muted },
  chipsRow: { flexDirection: "row", gap: 8, flexWrap: "wrap", marginBottom: 16 },
  chip: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
    borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.white,
  },
  chipSelected: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: { fontSize: 13, color: Colors.muted, fontWeight: "500" },
  chipTextSelected: { color: Colors.white },
  feeBox: {
    backgroundColor: Colors.white, borderRadius: 12,
    padding: 14, marginBottom: 16,
    borderWidth: 0.5, borderColor: Colors.border,
  },
  feeRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 4 },
  feeLabel: { fontSize: 13, color: Colors.muted },
  feeVal: { fontSize: 13, color: Colors.dark },
  feeTotalRow: {
    borderTopWidth: 0.5, borderTopColor: Colors.border,
    marginTop: 6, paddingTop: 10,
  },
  feeTotalLabel: { fontSize: 14, fontWeight: "700", color: Colors.dark },
  feeTotalVal: { fontSize: 14, fontWeight: "700", color: Colors.dark },
  paymentCard: {
    flexDirection: "row", alignItems: "center", gap: 12,
    backgroundColor: Colors.white, borderRadius: 12,
    padding: 14, marginBottom: 20,
    borderWidth: 0.5, borderColor: Colors.border,
  },
  paymentIcon: {
    width: 48, height: 48, borderRadius: 12,
    backgroundColor: "#1D3075",
    alignItems: "center", justifyContent: "center",
  },  paymentName: { fontSize: 14, fontWeight: "600", color: Colors.dark },
  yasBadge: {
    backgroundColor: "#FBBF24", paddingHorizontal: 6,
    paddingVertical: 2, borderRadius: 6,
  },
  yasBadgeText: { fontSize: 9, fontWeight: "700", color: "#1D3A8A" },
  paymentSub: { fontSize: 12, color: Colors.muted, marginTop: 1 },
  btnPrimary: {
    backgroundColor: Colors.primary, borderRadius: 14,
    padding: 16, alignItems: "center", flexDirection: "row",
    justifyContent: "center", gap: 8,
  },
  btnDisabled: { opacity: 0.5 },
  btnPrimaryText: { color: Colors.white, fontSize: 16, fontWeight: "600" },
});
