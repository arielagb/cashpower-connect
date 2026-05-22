import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, Switch,
} from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../constants/colors";
import { mockMeters, Meter } from "../../data/mockData";

export default function ConsoScreen() {
  const [selectedMeter, setSelectedMeter] = useState<Meter>(mockMeters[0]);
  const [alerts, setAlerts] = useState<Record<string, boolean>>(
    Object.fromEntries(mockMeters.map((m) => [m.id, m.alertEnabled]))
  );

  const totalWeek = selectedMeter.weeklyConsumption.reduce((a, b) => a + b, 0);
  const maxBar = Math.max(...selectedMeter.weeklyConsumption);
  const lastWeekChange = selectedMeter.weeklyConsumption[3] - selectedMeter.weeklyConsumption[2];

  const getAlertMessages = (m: Meter) => {
    const pct = m.kwhRemaining / m.kwhTotal;
    const msgs = [];
    if (pct >= 0.95) msgs.push({ icon: "checkmark-circle", color: Colors.primary, text: "Compteur plein — recharge effectuée avec succès !" });
    else if (pct >= 0.5) msgs.push({ icon: "information-circle", color: Colors.primary, text: `Vous avez consommé plus de la moitié (${Math.round((1 - pct) * 100)}%). Pensez à surveiller.` });
    else if (pct > 0.1) msgs.push({ icon: "warning", color: Colors.accent, text: `Il ne reste que ${m.kwhRemaining} kWh. Rechargez bientôt.` });
    else msgs.push({ icon: "alert-circle", color: Colors.danger, text: `CRITIQUE — ${m.kwhRemaining} kWh restants. Rechargez maintenant !` });
    return msgs;
  };

  const tips = [
    { icon: "bulb-outline", text: "Éteignez les appareils en veille la nuit — économisez jusqu'à 15%." },
    { icon: "thermometer-outline", text: "Réduisez la climatisation de 2°C — jusqu'à 10% d'économies." },
    { icon: "time-outline", text: "Utilisez les gros appareils (fer à repasser, four) en dehors des heures de pointe." },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Consommation</Text>
        </View>

        <View style={styles.body}>
          {/* Meter selector */}
          <View style={styles.selectorRow}>
            {mockMeters.map((m) => (
              <TouchableOpacity
                key={m.id}
                style={[styles.selectorBtn, selectedMeter.id === m.id && styles.selectorBtnActive]}
                onPress={() => setSelectedMeter(m)}
              >
                <Text style={[styles.selectorText, selectedMeter.id === m.id && styles.selectorTextActive]}>
                  {m.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Stats cards */}
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Ce mois</Text>
              <Text style={styles.statVal}>{totalWeek} kWh</Text>
              <Text style={[styles.statSub, { color: lastWeekChange > 0 ? Colors.accent : Colors.primary }]}>
                {lastWeekChange > 0 ? "↑" : "↓"} {Math.abs(lastWeekChange)} kWh vs S3
              </Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Durée estimée</Text>
              <Text style={styles.statVal}>
                ~{Math.round(selectedMeter.kwhRemaining / (totalWeek / 28))} j
              </Text>
              <Text style={styles.statSub}>Au rythme actuel</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Restant</Text>
              <Text style={[styles.statVal, { color: selectedMeter.kwhRemaining <= 5 ? Colors.accent : Colors.primary }]}>
                {selectedMeter.kwhRemaining} kWh
              </Text>
              <Text style={styles.statSub}>{Math.round((selectedMeter.kwhRemaining / selectedMeter.kwhTotal) * 100)}% du total</Text>
            </View>
          </View>

          {/* Weekly bar chart */}
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Consommation hebdomadaire (kWh)</Text>
            <View style={styles.chartBars}>
              {selectedMeter.weeklyConsumption.map((val, i) => (
                <View key={i} style={styles.barWrapper}>
                  <Text style={styles.barValue}>{val}</Text>
                  <View style={styles.barBg}>
                    <View
                      style={[
                        styles.barFill,
                        {
                          height: `${(val / maxBar) * 100}%`,
                          backgroundColor: i === selectedMeter.weeklyConsumption.length - 1 ? Colors.accent : Colors.primary,
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.barLabel}>S{i + 1}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Alerts panel */}
          <Text style={styles.sectionTitle}>Alertes intelligentes</Text>
          {getAlertMessages(selectedMeter).map((msg, i) => (
            <View key={i} style={[styles.alertCard, { borderLeftColor: msg.color }]}>
              <Ionicons name={msg.icon as any} size={20} color={msg.color} />
              <Text style={styles.alertText}>{msg.text}</Text>
            </View>
          ))}

          {/* Alert toggles */}
          <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Paramétrer les alertes</Text>
          {mockMeters.map((m) => (
            <View key={m.id} style={styles.toggleCard}>
              <View style={styles.toggleLeft}>
                <Ionicons name="notifications-outline" size={20} color={Colors.accent} />
                <View>
                  <Text style={styles.toggleLabel}>Alerte à {m.alertThreshold} kWh</Text>
                  <Text style={styles.toggleSub}>{m.name}</Text>
                </View>
              </View>
              <Switch
                value={alerts[m.id]}
                onValueChange={(v) => setAlerts((prev) => ({ ...prev, [m.id]: v }))}
                trackColor={{ false: Colors.border, true: Colors.primaryLight }}
                thumbColor={alerts[m.id] ? Colors.primary : Colors.muted}
              />
            </View>
          ))}

          {/* Tips */}
          <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Conseils d'optimisation</Text>
          {tips.map((tip, i) => (
            <View key={i} style={styles.tipCard}>
              <Ionicons name={tip.icon as any} size={20} color={Colors.accent} />
              <Text style={styles.tipText}>{tip.text}</Text>
            </View>
          ))}

          {/* History */}
          <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Historique des recharges</Text>
          {selectedMeter.history.map((h) => (
            <View key={h.id} style={styles.histCard}>
              <View style={styles.histIcon}>
                <Ionicons name="flash" size={16} color={Colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.histTitle}>{h.amount.toLocaleString("fr")} FCFA — {h.kwh} kWh</Text>
                <Text style={styles.histDate}>{h.date}</Text>
              </View>
              <Text style={styles.histToken}>Token: {h.token}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.primary },
  header: {
    paddingHorizontal: 20, paddingTop: 16, paddingBottom: 20,
    backgroundColor: Colors.primary,
  },
  headerTitle: { color: Colors.white, fontSize: 20, fontWeight: "700" },
  body: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 20, minHeight: 600,
  },
  selectorRow: { flexDirection: "row", gap: 8, marginBottom: 16 },
  selectorBtn: {
    flex: 1, padding: 10, borderRadius: 10,
    borderWidth: 1.5, borderColor: Colors.border,
    backgroundColor: Colors.white, alignItems: "center",
  },
  selectorBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  selectorText: { fontSize: 13, color: Colors.muted, fontWeight: "500" },
  selectorTextActive: { color: Colors.white },
  statsRow: { flexDirection: "row", gap: 8, marginBottom: 16 },
  statCard: {
    flex: 1, backgroundColor: Colors.white, borderRadius: 12,
    padding: 12, borderWidth: 0.5, borderColor: Colors.border,
  },
  statLabel: { fontSize: 10, color: Colors.muted, marginBottom: 4 },
  statVal: { fontSize: 16, fontWeight: "700", color: Colors.dark },
  statSub: { fontSize: 10, color: Colors.muted, marginTop: 2 },
  chartCard: {
    backgroundColor: Colors.white, borderRadius: 14,
    padding: 16, marginBottom: 16,
    borderWidth: 0.5, borderColor: Colors.border,
  },
  chartTitle: { fontSize: 12, color: Colors.muted, marginBottom: 14 },
  chartBars: { flexDirection: "row", gap: 10, height: 100, alignItems: "flex-end" },
  barWrapper: { flex: 1, alignItems: "center", gap: 4, height: "100%" },
  barValue: { fontSize: 11, color: Colors.muted, fontWeight: "600" },
  barBg: { flex: 1, width: "100%", backgroundColor: Colors.surface, borderRadius: 4, overflow: "hidden", justifyContent: "flex-end" },
  barFill: { width: "100%", borderRadius: 4 },
  barLabel: { fontSize: 11, color: Colors.muted },
  sectionTitle: {
    fontSize: 12, fontWeight: "600", color: Colors.muted,
    textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 10,
  },
  alertCard: {
    flexDirection: "row", gap: 10, alignItems: "flex-start",
    backgroundColor: Colors.white, borderRadius: 12, padding: 12,
    marginBottom: 8, borderLeftWidth: 3,
    borderWidth: 0.5, borderColor: Colors.border,
  },
  alertText: { flex: 1, fontSize: 13, color: Colors.dark, lineHeight: 18 },
  toggleCard: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    backgroundColor: Colors.white, borderRadius: 12, padding: 14,
    marginBottom: 8, borderWidth: 0.5, borderColor: Colors.border,
  },
  toggleLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  toggleLabel: { fontSize: 14, color: Colors.dark, fontWeight: "500" },
  toggleSub: { fontSize: 11, color: Colors.muted, marginTop: 1 },
  tipCard: {
    flexDirection: "row", gap: 10, alignItems: "flex-start",
    backgroundColor: Colors.accentLight, borderRadius: 12, padding: 12,
    marginBottom: 8, borderWidth: 1, borderColor: "rgba(249,115,22,0.2)",
  },
  tipText: { flex: 1, fontSize: 13, color: Colors.dark, lineHeight: 18 },
  histCard: {
    flexDirection: "row", alignItems: "center", gap: 12,
    backgroundColor: Colors.white, borderRadius: 12, padding: 12,
    marginBottom: 8, borderWidth: 0.5, borderColor: Colors.border,
  },
  histIcon: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: Colors.primaryLight, alignItems: "center", justifyContent: "center",
  },
  histTitle: { fontSize: 13, fontWeight: "600", color: Colors.dark },
  histDate: { fontSize: 11, color: Colors.muted, marginTop: 1 },
  histToken: { fontSize: 11, color: Colors.muted, fontWeight: "600" },
});
