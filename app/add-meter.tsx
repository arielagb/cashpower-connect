import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, TextInput, Alert, ScrollView,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../constants/colors";

export default function AddMeterScreen() {
  const router = useRouter();
  const [reference, setReference] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [found, setFound] = useState(false);

  // Simulated meter lookup
  const handleSearch = () => {
    if (reference.replace(/\D/g, "").length < 10) {
      Alert.alert("Référence invalide", "Veuillez entrer un numéro de référence valide (13-14 chiffres).");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setFound(true);
    }, 1500);
  };

  const handleAdd = () => {
    Alert.alert("Compteur ajouté !", `Le compteur "${name || "Mon compteur"}" a été enregistré.`, [
      { text: "OK", onPress: () => router.replace("/(tabs)") },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <TouchableOpacity style={styles.back} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={22} color={Colors.white} />
        <Text style={styles.backText}>Ajouter un compteur</Text>
      </TouchableOpacity>

      <ScrollView>
        <View style={styles.body}>
          <View style={styles.infoBox}>
            <Ionicons name="information-circle-outline" size={20} color={Colors.primary} />
            <Text style={styles.infoText}>
              Votre numéro de référence se trouve sur votre compteur physique. Il contient 13 à 14 chiffres.
            </Text>
          </View>

          <Text style={styles.label}>Numéro de référence *</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={reference}
              onChangeText={setReference}
              placeholder="Ex: 1402-8831-5694"
              placeholderTextColor={Colors.muted}
              keyboardType="numeric"
            />
            <TouchableOpacity
              style={[styles.searchBtn, loading && styles.btnDisabled]}
              onPress={handleSearch}
              disabled={loading}
            >
              {loading
                ? <Text style={styles.searchBtnText}>...</Text>
                : <Ionicons name="search" size={20} color={Colors.white} />
              }
            </TouchableOpacity>
          </View>

          {found && (
            <View style={styles.foundCard}>
              <View style={styles.foundHeader}>
                <Ionicons name="checkmark-circle" size={20} color={Colors.primary} />
                <Text style={styles.foundTitle}>Compteur trouvé !</Text>
              </View>
              <View style={styles.foundRow}>
                <Text style={styles.foundLabel}>Référence</Text>
                <Text style={styles.foundVal}>{reference}</Text>
              </View>
              <View style={styles.foundRow}>
                <Text style={styles.foundLabel}>Type</Text>
                <Text style={styles.foundVal}>CEET CashPower</Text>
              </View>
              <View style={styles.foundRow}>
                <Text style={styles.foundLabel}>Solde actuel</Text>
                <Text style={[styles.foundVal, { color: Colors.primary, fontWeight: "700" }]}>12.0 kWh</Text>
              </View>

              <Text style={[styles.label, { marginTop: 16 }]}>Nom du compteur (optionnel)</Text>
              <TextInput
                style={[styles.input, { marginBottom: 0 }]}
                value={name}
                onChangeText={setName}
                placeholder="Ex: Maison principale, Village..."
                placeholderTextColor={Colors.muted}
              />

              <TouchableOpacity style={styles.btnPrimary} onPress={handleAdd}>
                <Ionicons name="add-circle-outline" size={18} color={Colors.white} />
                <Text style={styles.btnText}>Ajouter ce compteur</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.primary },
  back: {
    flexDirection: "row", alignItems: "center", gap: 10,
    padding: 20, paddingBottom: 16,
  },
  backText: { color: Colors.white, fontSize: 18, fontWeight: "600" },
  body: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 24, minHeight: 600,
  },
  infoBox: {
    flexDirection: "row", gap: 10, alignItems: "flex-start",
    backgroundColor: Colors.primaryLight, borderRadius: 12,
    padding: 14, marginBottom: 20,
    borderWidth: 1, borderColor: "rgba(13,92,58,0.2)",
  },
  infoText: { flex: 1, fontSize: 13, color: Colors.dark, lineHeight: 18 },
  label: { fontSize: 13, fontWeight: "600", color: Colors.dark, marginBottom: 8 },
  inputRow: { flexDirection: "row", gap: 10, marginBottom: 16 },
  input: {
    flex: 1, backgroundColor: Colors.white,
    borderRadius: 12, padding: 14, fontSize: 15,
    color: Colors.dark, borderWidth: 1.5, borderColor: Colors.border,
  },
  searchBtn: {
    width: 52, backgroundColor: Colors.primary,
    borderRadius: 12, alignItems: "center", justifyContent: "center",
  },
  searchBtnText: { color: Colors.white, fontSize: 18, fontWeight: "700" },
  btnDisabled: { opacity: 0.5 },
  foundCard: {
    backgroundColor: Colors.white, borderRadius: 16,
    padding: 16, borderWidth: 0.5, borderColor: Colors.border,
  },
  foundHeader: { flexDirection: "row", gap: 8, alignItems: "center", marginBottom: 12 },
  foundTitle: { fontSize: 15, fontWeight: "700", color: Colors.primary },
  foundRow: {
    flexDirection: "row", justifyContent: "space-between",
    paddingVertical: 8, borderBottomWidth: 0.5, borderBottomColor: Colors.border,
  },
  foundLabel: { fontSize: 13, color: Colors.muted },
  foundVal: { fontSize: 13, color: Colors.dark },
  btnPrimary: {
    backgroundColor: Colors.primary, borderRadius: 12,
    padding: 14, alignItems: "center", flexDirection: "row",
    justifyContent: "center", gap: 8, marginTop: 20,
  },
  btnText: { color: Colors.white, fontSize: 15, fontWeight: "600" },
});
