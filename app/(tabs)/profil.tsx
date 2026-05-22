import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../constants/colors";
import { mockUser, mockMeters } from "../../data/mockData";

const menuItems = [
  { icon: "person-outline", label: "Mes informations", sub: "Nom, téléphone" },
  { icon: "shield-checkmark-outline", label: "Sécurité", sub: "Code PIN, authentification" },
  { icon: "time-outline", label: "Historique des transactions", sub: "Toutes vos recharges" },
  { icon: "notifications-outline", label: "Mes alertes", sub: "Gérer les notifications" },
  { icon: "star-outline", label: "Mes compteurs favoris", sub: `${mockMeters.length} compteur(s) enregistré(s)` },
  { icon: "help-circle-outline", label: "Aide et support", sub: "FAQ, nous contacter" },
  { icon: "information-circle-outline", label: "À propos", sub: "CashPower Connect v1.0.0" },
];

export default function ProfilScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profil</Text>
        </View>

        <View style={styles.body}>
          {/* User card */}
          <View style={styles.userCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{mockUser.initials}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.userName}>{mockUser.name}</Text>
              <Text style={styles.userPhone}>{mockUser.phone}</Text>
            </View>
            <TouchableOpacity style={styles.editBtn}>
              <Text style={styles.editBtnText}>Modifier</Text>
            </TouchableOpacity>
          </View>

          {/* Stats summary */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statVal}>{mockMeters.length}</Text>
              <Text style={styles.statLabel}>Compteurs</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statVal}>
                {mockMeters.reduce((a, m) => a + m.history.length, 0)}
              </Text>
              <Text style={styles.statLabel}>Recharges</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statVal}>
                {(mockMeters.reduce((a, m) => a + m.history.reduce((b, h) => b + h.amount, 0), 0) / 1000).toFixed(0)}k
              </Text>
              <Text style={styles.statLabel}>FCFA total</Text>
            </View>
          </View>

          {/* Menu */}
          <View style={styles.menuCard}>
            {menuItems.map((item, i) => (
              <TouchableOpacity
                key={i}
                style={[styles.menuItem, i < menuItems.length - 1 && styles.menuItemBorder]}
              >
                <View style={styles.menuItemLeft}>
                  <View style={styles.menuIconWrap}>
                    <Ionicons name={item.icon as any} size={18} color={Colors.primary} />
                  </View>
                  <View>
                    <Text style={styles.menuLabel}>{item.label}</Text>
                    <Text style={styles.menuSub}>{item.sub}</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={16} color={Colors.muted} />
              </TouchableOpacity>
            ))}
          </View>

          {/* Logout */}
          <TouchableOpacity style={styles.logoutBtn}>
            <Ionicons name="log-out-outline" size={18} color={Colors.danger} />
            <Text style={styles.logoutText}>Se déconnecter</Text>
          </TouchableOpacity>

          <Text style={styles.version}>CashPower Connect • v1.0.0</Text>
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
  userCard: {
    flexDirection: "row", alignItems: "center", gap: 14,
    backgroundColor: Colors.white, borderRadius: 16,
    padding: 16, marginBottom: 14,
    borderWidth: 0.5, borderColor: Colors.border,
  },
  avatar: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: Colors.primary,
    alignItems: "center", justifyContent: "center",
  },
  avatarText: { color: Colors.white, fontSize: 18, fontWeight: "700" },
  userName: { fontSize: 16, fontWeight: "700", color: Colors.dark },
  userPhone: { fontSize: 13, color: Colors.muted, marginTop: 2 },
  editBtn: {
    paddingHorizontal: 14, paddingVertical: 7,
    borderRadius: 20, backgroundColor: Colors.primaryLight,
  },
  editBtnText: { fontSize: 12, color: Colors.primary, fontWeight: "600" },
  statsRow: {
    flexDirection: "row", backgroundColor: Colors.white,
    borderRadius: 14, padding: 16, marginBottom: 16,
    borderWidth: 0.5, borderColor: Colors.border,
  },
  statItem: { flex: 1, alignItems: "center" },
  statVal: { fontSize: 20, fontWeight: "700", color: Colors.primary },
  statLabel: { fontSize: 11, color: Colors.muted, marginTop: 2 },
  statDivider: { width: 1, backgroundColor: Colors.border, marginVertical: 4 },
  menuCard: {
    backgroundColor: Colors.white, borderRadius: 16,
    marginBottom: 14, borderWidth: 0.5, borderColor: Colors.border,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    padding: 14,
  },
  menuItemBorder: { borderBottomWidth: 0.5, borderBottomColor: Colors.border },
  menuItemLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  menuIconWrap: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: Colors.primaryLight, alignItems: "center", justifyContent: "center",
  },
  menuLabel: { fontSize: 14, fontWeight: "500", color: Colors.dark },
  menuSub: { fontSize: 11, color: Colors.muted, marginTop: 1 },
  logoutBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 8, backgroundColor: Colors.dangerLight,
    borderRadius: 14, padding: 14, marginBottom: 20,
    borderWidth: 0.5, borderColor: "rgba(220,38,38,0.2)",
  },
  logoutText: { fontSize: 15, fontWeight: "600", color: Colors.danger },
  version: { textAlign: "center", fontSize: 11, color: Colors.muted, marginBottom: 10 },
});
