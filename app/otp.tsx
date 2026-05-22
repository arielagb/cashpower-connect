import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, TextInput, Alert,
} from "react-native";
import { useState, useRef } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../constants/colors";
import { mockMeters } from "../data/mockData";

export default function OtpScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const meter = mockMeters.find((m) => m.id === params.meterId) ?? mockMeters[0];
  const amount = parseInt(params.amount as string) || 5000;

  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputs = [useRef<TextInput>(null), useRef<TextInput>(null), useRef<TextInput>(null), useRef<TextInput>(null)];

  const handleChange = (val: string, i: number) => {
    if (!/^\d*$/.test(val)) return;
    const newOtp = [...otp];
    newOtp[i] = val;
    setOtp(newOtp);
    if (val && i < 3) inputs[i + 1].current?.focus();
  };

  const handleBackspace = (val: string, i: number) => {
    if (!val && i > 0) {
      inputs[i - 1].current?.focus();
    }
  };

  const isComplete = otp.every((d) => d !== "");

  const handleValidate = () => {
    // Mock: any 4-digit code works
    router.replace({ pathname: "/success", params: { amount: String(amount), meterId: meter.id, token: "4421" } });
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Back */}
      <TouchableOpacity style={styles.back} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={22} color={Colors.white} />
      </TouchableOpacity>

      <View style={styles.body}>
        <View style={styles.iconWrap}>
          <Ionicons name="lock-closed" size={32} color={Colors.primary} />
        </View>
        <Text style={styles.title}>Vérification OTP</Text>
        <Text style={styles.sub}>
          Un code à 4 chiffres a été envoyé au{"\n"}
          <Text style={{ fontWeight: "700", color: Colors.primary }}>+228 99 45 67 89</Text>
        </Text>

        {/* Recap */}
        <View style={styles.recapCard}>
          <View style={styles.recapRow}>
            <Text style={styles.recapLabel}>Compteur</Text>
            <Text style={styles.recapVal}>{meter.name}</Text>
          </View>
          <View style={styles.recapRow}>
            <Text style={styles.recapLabel}>Montant</Text>
            <Text style={[styles.recapVal, { color: Colors.primary, fontWeight: "700" }]}>
              {(amount + Math.round(amount * 0.1)).toLocaleString("fr")} FCFA
            </Text>
          </View>
        </View>

        {/* OTP boxes */}
        <View style={styles.otpRow}>
          {otp.map((digit, i) => (
            <TextInput
              key={i}
              ref={inputs[i]}
              style={[styles.otpBox, digit !== "" && styles.otpBoxFilled]}
              value={digit}
              onChangeText={(v) => handleChange(v, i)}
              onKeyPress={({ nativeEvent }) => {
                if (nativeEvent.key === "Backspace") handleBackspace(digit, i);
              }}
              keyboardType="numeric"
              maxLength={1}
              textAlign="center"
              selectTextOnFocus
            />
          ))}
        </View>

        <Text style={styles.resend}>
          Code valable 5 minutes.{" "}
          <Text style={{ color: Colors.primary, fontWeight: "600" }} onPress={() => Alert.alert("SMS renvoyé !", "Un nouveau code vous a été envoyé.")}>
            Renvoyer
          </Text>
        </Text>

        <TouchableOpacity
          style={[styles.btnPrimary, !isComplete && styles.btnDisabled]}
          onPress={handleValidate}
          disabled={!isComplete}
        >
          <Text style={styles.btnText}>Valider le paiement</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnSecondary} onPress={() => router.back()}>
          <Text style={styles.btnSecondaryText}>Annuler</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.primary },
  back: { padding: 20, paddingBottom: 0 },
  body: {
    flex: 1, backgroundColor: Colors.surface,
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 24, marginTop: 16, alignItems: "center",
  },
  iconWrap: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: Colors.primaryLight,
    alignItems: "center", justifyContent: "center", marginBottom: 16, marginTop: 8,
  },
  title: { fontSize: 22, fontWeight: "700", color: Colors.dark, marginBottom: 8 },
  sub: { fontSize: 14, color: Colors.muted, textAlign: "center", lineHeight: 22, marginBottom: 20 },
  recapCard: {
    backgroundColor: Colors.white, borderRadius: 14,
    padding: 14, width: "100%", marginBottom: 24,
    borderWidth: 0.5, borderColor: Colors.border,
  },
  recapRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 5 },
  recapLabel: { fontSize: 13, color: Colors.muted },
  recapVal: { fontSize: 13, color: Colors.dark },
  otpRow: { flexDirection: "row", gap: 14, marginBottom: 16 },
  otpBox: {
    width: 58, height: 64, borderRadius: 12,
    borderWidth: 2, borderColor: Colors.border,
    fontSize: 24, fontWeight: "700", color: Colors.dark,
    backgroundColor: Colors.white,
  },
  otpBoxFilled: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight },
  resend: { fontSize: 13, color: Colors.muted, marginBottom: 28, textAlign: "center" },
  btnPrimary: {
    backgroundColor: Colors.primary, borderRadius: 14,
    padding: 16, width: "100%", alignItems: "center", marginBottom: 10,
  },
  btnDisabled: { opacity: 0.4 },
  btnText: { color: Colors.white, fontSize: 16, fontWeight: "600" },
  btnSecondary: {
    padding: 16, width: "100%", alignItems: "center",
    borderRadius: 14, borderWidth: 1.5, borderColor: Colors.border,
  },
  btnSecondaryText: { color: Colors.muted, fontSize: 15, fontWeight: "500" },
});
