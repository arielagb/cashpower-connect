import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Modal,
  Animated,
  Dimensions,
} from "react-native";
import { useRef, useState } from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../constants/colors";
import { mockMeters, mockUser, Meter } from "../../data/mockData";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(-width * 0.75)).current;

  const openDrawer = () => {
    setDrawerOpen(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 280,
      useNativeDriver: true,
    }).start();
  };

  const closeDrawer = () => {
    Animated.timing(slideAnim, {
      toValue: -width * 0.75,
      duration: 250,
      useNativeDriver: true,
    }).start(() => setDrawerOpen(false));
  };

  const lowMeters = mockMeters.filter(
    (m) => m.kwhRemaining <= m.alertThreshold
  );

  const getKwhColor = (meter: Meter) => {
    const pct = meter.kwhRemaining / meter.kwhTotal;
    if (pct <= 0.1) return Colors.danger;
    if (pct <= 0.25) return Colors.accent;
    return Colors.primary;
  };

  const getStatusLabel = (meter: Meter) => {
    const pct = meter.kwhRemaining / meter.kwhTotal;
    if (pct <= 0.1) return { label: "Critique", color: Colors.danger, bg: Colors.dangerLight };
    if (pct <= 0.25) return { label: "Bas", color: Colors.accent, bg: Colors.accentLight };
    return { label: "Actif", color: Colors.primary, bg: Colors.primaryLight };
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* DRAWER MENU */}
      {drawerOpen && (
        <Modal transparent animationType="none" onRequestClose={closeDrawer}>
          <TouchableOpacity style={styles.drawerOverlay} onPress={closeDrawer} activeOpacity={1}>
            <Animated.View style={[styles.drawer, { transform: [{ translateX: slideAnim }] }]}>
              <TouchableOpacity activeOpacity={1}>
                {/* User info */}
                <View style={styles.drawerHeader}>
                  <View style={styles.drawerAvatar}>
                    <Text style={styles.drawerAvatarText}>{mockUser.initials}</Text>
                  </View>
                  <View>
                    <Text style={styles.drawerName}>{mockUser.name}</Text>
                    <Text style={styles.drawerPhone}>{mockUser.phone}</Text>
                  </View>
                </View>
                {/* Menu items */}
                {[
                  { icon: "home-outline", label: "Accueil" },
                  { icon: "flash-outline", label: "Recharger" },
                  { icon: "add-circle-outline", label: "Ajouter un compteur" },
                  { icon: "bar-chart-outline", label: "Consommation" },
                  { icon: "time-outline", label: "Historique" },
                  { icon: "notifications-outline", label: "Alertes" },
                  { icon: "settings-outline", label: "Paramètres" },
                  { icon: "help-circle-outline", label: "Aide" },
                ].map((item, i) => (
                  <TouchableOpacity key={i} style={styles.drawerItem} onPress={closeDrawer}>
                    <Ionicons name={item.icon as any} size={20} color={Colors.primary} />
                    <Text style={styles.drawerItemText}>{item.label}</Text>
                  </TouchableOpacity>
                ))}
              </TouchableOpacity>
            </Animated.View>
          </TouchableOpacity>
        </Modal>
      )}

      {/* NOTIF PANEL */}
      {notifOpen && (
        <Modal transparent animationType="fade" onRequestClose={() => setNotifOpen(false)}>
          <TouchableOpacity style={styles.notifOverlay} onPress={() => setNotifOpen(false)} activeOpacity={1}>
            <View style={styles.notifPanel}>
              <Text style={styles.notifTitle}>Alertes</Text>
              {lowMeters.length === 0 ? (
                <Text style={styles.notifEmpty}>Aucune alerte pour le moment</Text>
              ) : (
                lowMeters.map((m) => (
                  <View key={m.id} style={styles.notifItem}>
                    <Ionicons name="warning-outline" size={18} color={Colors.accent} />
                    <Text style={styles.notifText}>
                      <Text style={{ fontWeight: "600" }}>{m.name}</Text> — il ne reste que{" "}
                      <Text style={{ color: Colors.accent, fontWeight: "600" }}>
                        {m.kwhRemaining} kWh
                      </Text>
                    </Text>
                  </View>
                ))
              )}
            </View>
          </TouchableOpacity>
        </Modal>
      )}

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerGreeting}>Bonjour 👋</Text>
            <Text style={styles.headerName}>{mockUser.name}</Text>
          </View>
          <View style={styles.headerIcons}>
            <TouchableOpacity onPress={() => setNotifOpen(true)} style={styles.iconBtn}>
              <Ionicons name="notifications-outline" size={22} color={Colors.white} />
              {lowMeters.length > 0 && <View style={styles.badge} />}
            </TouchableOpacity>
            <TouchableOpacity onPress={openDrawer} style={styles.iconBtn}>
              <Ionicons name="menu-outline" size={26} color={Colors.white} />
            </TouchableOpacity>
          </View>
        </View>

        {/* HERO CARD */}
        <View style={styles.heroCard}>
          <Text style={styles.heroLabel}>Compteur principal</Text>
          <Text style={styles.heroMeterName}>{mockMeters[0].name}</Text>
          <View style={styles.heroKwhRow}>
            <Text style={styles.heroKwh}>{mockMeters[0].kwhRemaining}</Text>
            <Text style={styles.heroKwhUnit}> kWh restants</Text>
          </View>
          <Text style={styles.heroRef}># {mockMeters[0].reference}</Text>
          {/* Progress bar */}
          <View style={styles.progressBg}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${(mockMeters[0].kwhRemaining / mockMeters[0].kwhTotal) * 100}%`,
                  backgroundColor: getKwhColor(mockMeters[0]),
                },
              ]}
            />
          </View>
        </View>

        <View style={styles.body}>
          {/* QUICK ACTIONS */}
          <Text style={styles.sectionTitle}>Actions rapides</Text>
          <View style={styles.actionGrid}>
            {[
              { icon: "flash", label: "Recharger", color: Colors.primary, bg: Colors.primaryLight, route: "/recharge" },
              { icon: "add-circle", label: "Ajouter\ncompteur", color: Colors.primary, bg: Colors.primaryLight, route: "/add-meter" },
              { icon: "time", label: "Historique", color: Colors.accent, bg: Colors.accentLight, route: "/(tabs)/conso" },
              { icon: "bar-chart", label: "Conso", color: Colors.accent, bg: Colors.accentLight, route: "/(tabs)/conso" },
            ].map((action, i) => (
              <TouchableOpacity
                key={i}
                style={styles.actionBtn}
                onPress={() => router.push(action.route as any)}
              >
                <View style={[styles.actionIcon, { backgroundColor: action.bg }]}>
                  <Ionicons name={action.icon as any} size={24} color={action.color} />
                </View>
                <Text style={styles.actionLabel}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* METERS LIST */}
          <Text style={styles.sectionTitle}>Mes compteurs</Text>
          {mockMeters.map((meter) => {
            const status = getStatusLabel(meter);
            const pct = (meter.kwhRemaining / meter.kwhTotal) * 100;
            return (
              <TouchableOpacity
                key={meter.id}
                style={styles.meterCard}
                onPress={() => router.push({ pathname: "/recharge", params: { meterId: meter.id } })}
              >
                <View style={styles.meterCardTop}>
                  <View>
                    <Text style={styles.meterName}>{meter.name}</Text>
                    <Text style={styles.meterRef}># {meter.reference}</Text>
                    <Text style={styles.meterLoc}>{meter.location}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
                    <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
                  </View>
                </View>
                <View style={styles.meterKwhRow}>
                  <Text style={[styles.meterKwh, { color: getKwhColor(meter) }]}>
                    {meter.kwhRemaining}
                  </Text>
                  <Text style={styles.meterKwhUnit}> kWh</Text>
                  <Text style={styles.meterKwhTotal}> / {meter.kwhTotal} kWh</Text>
                </View>
                <View style={styles.progressBg}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${pct}%`, backgroundColor: getKwhColor(meter) },
                    ]}
                  />
                </View>
                <Text style={styles.meterTap}>Appuyer pour recharger →</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.primary },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: Colors.primary,
  },
  headerGreeting: { color: "rgba(255,255,255,0.75)", fontSize: 13 },
  headerName: { color: Colors.white, fontSize: 18, fontWeight: "600" },
  headerIcons: { flexDirection: "row", gap: 8 },
  iconBtn: { padding: 6, position: "relative" },
  badge: {
    position: "absolute", top: 6, right: 6,
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: Colors.accent, borderWidth: 1, borderColor: Colors.primary,
  },
  heroCard: {
    marginHorizontal: 16,
    marginBottom: 4,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  heroLabel: { color: "rgba(255,255,255,0.7)", fontSize: 11 },
  heroMeterName: { color: Colors.white, fontSize: 15, fontWeight: "600", marginTop: 2 },
  heroKwhRow: { flexDirection: "row", alignItems: "baseline", marginTop: 8 },
  heroKwh: { color: Colors.white, fontSize: 32, fontWeight: "700" },
  heroKwhUnit: { color: "rgba(255,255,255,0.8)", fontSize: 14 },
  heroRef: { color: "rgba(255,255,255,0.6)", fontSize: 11, marginTop: 4, marginBottom: 10 },
  body: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: 16,
    padding: 20,
    minHeight: 500,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.muted,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 12,
    marginTop: 4,
  },
  actionGrid: { flexDirection: "row", justifyContent: "space-between", marginBottom: 24 },
  actionBtn: { alignItems: "center", width: "23%" },
  actionIcon: {
    width: 52, height: 52, borderRadius: 16,
    alignItems: "center", justifyContent: "center", marginBottom: 6,
  },
  actionLabel: { fontSize: 11, color: Colors.muted, textAlign: "center", lineHeight: 15 },
  meterCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 0.5,
    borderColor: Colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  meterCardTop: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  meterName: { fontSize: 15, fontWeight: "600", color: Colors.dark },
  meterRef: { fontSize: 11, color: Colors.muted, marginTop: 2 },
  meterLoc: { fontSize: 11, color: Colors.muted },
  statusBadge: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, alignSelf: "flex-start" },
  statusText: { fontSize: 11, fontWeight: "600" },
  meterKwhRow: { flexDirection: "row", alignItems: "baseline", marginBottom: 8 },
  meterKwh: { fontSize: 24, fontWeight: "700" },
  meterKwhUnit: { fontSize: 13, color: Colors.muted },
  meterKwhTotal: { fontSize: 11, color: Colors.muted },
  progressBg: { height: 6, backgroundColor: Colors.border, borderRadius: 4, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 4 },
  meterTap: { fontSize: 11, color: Colors.muted, marginTop: 8, textAlign: "right" },
  // Drawer
  drawerOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", flexDirection: "row" },
  drawer: {
    width: width * 0.75,
    backgroundColor: Colors.white,
    height: "100%",
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  drawerHeader: {
    flexDirection: "row", alignItems: "center", gap: 12,
    marginBottom: 28, paddingBottom: 20,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  drawerAvatar: {
    width: 46, height: 46, borderRadius: 23,
    backgroundColor: Colors.primary,
    alignItems: "center", justifyContent: "center",
  },
  drawerAvatarText: { color: Colors.white, fontWeight: "700", fontSize: 16 },
  drawerName: { fontSize: 15, fontWeight: "600", color: Colors.dark },
  drawerPhone: { fontSize: 12, color: Colors.muted, marginTop: 2 },
  drawerItem: {
    flexDirection: "row", alignItems: "center", gap: 14,
    paddingVertical: 14, borderBottomWidth: 0.5, borderBottomColor: Colors.border,
  },
  drawerItemText: { fontSize: 15, color: Colors.dark },
  // Notif
  notifOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.3)", justifyContent: "flex-start", alignItems: "flex-end", paddingTop: 60, paddingRight: 16 },
  notifPanel: {
    backgroundColor: Colors.white, borderRadius: 16, padding: 16,
    width: 280, shadowColor: "#000", shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15, shadowRadius: 12, elevation: 8,
  },
  notifTitle: { fontSize: 15, fontWeight: "700", color: Colors.dark, marginBottom: 12 },
  notifEmpty: { fontSize: 13, color: Colors.muted, textAlign: "center", paddingVertical: 8 },
  notifItem: { flexDirection: "row", gap: 8, alignItems: "flex-start", paddingVertical: 8, borderBottomWidth: 0.5, borderBottomColor: Colors.border },
  notifText: { fontSize: 13, color: Colors.dark, flex: 1, lineHeight: 18 },
});
