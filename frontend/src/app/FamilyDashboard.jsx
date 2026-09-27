import React from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";

function FamilyDashboard() {
  /*
   * Temporary data.
   *
   * Later this will come from Django:
   *
   * GET /api/family/glasses/
   */
  const linkedGlasses = [
    {
      id: "VB-001",
      name: "VisionBridge Glasses",
      user: "Dad",
      status: "Connected",
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.greeting}>Welcome back</Text>

            <Text
              style={styles.title}
              accessibilityRole="header"
            >
              Family Dashboard
            </Text>
          </View>

          <Pressable
            style={styles.profileButton}
            accessibilityRole="button"
            accessibilityLabel="Open family account"
          >
            <Text
              style={styles.profileInitial}
              accessibilityElementsHidden
            >
              F
            </Text>
          </Pressable>
        </View>

        <View style={styles.introCard}>
          <Text style={styles.introTitle}>
            Your VisionBridge glasses
          </Text>

          <Text style={styles.introText}>
            Manage the glasses linked to your family account.
          </Text>
        </View>

        <View style={styles.sectionHeader}>
          <Text
            style={styles.sectionTitle}
            accessibilityRole="header"
          >
            Linked Glasses
          </Text>

          <Text style={styles.glassCount}>
            {linkedGlasses.length} linked
          </Text>
        </View>

        <View style={styles.glassesList}>
          {linkedGlasses.map((glass) => (
            <Pressable
              key={glass.id}
              style={({ pressed }) => [
                styles.glassCard,
                pressed && styles.cardPressed,
              ]}
              onPress={() => {
                /*
                 * Later:
                 * router.push(`/GlassDetails?id=${glass.id}`);
                 */
              }}
              accessibilityRole="button"
              accessibilityLabel={`${glass.name}, linked to ${glass.user}, ${glass.status}`}
              accessibilityHint="Open this VisionBridge glass"
            >
              <View style={styles.glassIcon}>
                <Text
                  style={styles.glassIconText}
                  accessibilityElementsHidden
                >
                  V
                </Text>
              </View>

              <View style={styles.glassInfo}>
                <Text style={styles.glassName}>
                  {glass.name}
                </Text>

                <Text style={styles.glassOwner}>
                  Linked to {glass.user}
                </Text>

                <View style={styles.statusRow}>
                  <View
                    style={styles.statusDot}
                    accessibilityElementsHidden
                  />

                  <Text style={styles.statusText}>
                    {glass.status}
                  </Text>
                </View>
              </View>

              <Text
                style={styles.arrow}
                accessibilityElementsHidden
              >
                ›
              </Text>
            </Pressable>
          ))}
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.addButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => {
            /*
             * Later:
             * router.push("/LinkGlass");
             */
          }}
          accessibilityRole="button"
          accessibilityLabel="Link another VisionBridge glass"
          accessibilityHint="Add another pair of VisionBridge glasses to your family account"
        >
          <Text
            style={styles.addButtonIcon}
            accessibilityElementsHidden
          >
            +
          </Text>

          <Text style={styles.addButtonText}>
            Link Another Glass
          </Text>
        </Pressable>

        <View style={styles.bottomActions}>
          <Pressable
            style={styles.actionButton}
            accessibilityRole="button"
            accessibilityLabel="Family settings"
          >
            <Text style={styles.actionText}>
              Settings
            </Text>
          </Pressable>

          <Pressable
            style={styles.actionButton}
            onPress={() => router.replace("/FamilyLogin")}
            accessibilityRole="button"
            accessibilityLabel="Log out"
          >
            <Text style={styles.logoutText}>
              Log Out
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#071A33",
  },

  container: {
    flexGrow: 1,
    paddingHorizontal: 22,
    paddingTop: 24,
    paddingBottom: 40,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 26,
  },

  headerText: {
    flex: 1,
    paddingRight: 16,
  },

  greeting: {
    color: "#AFC6DE",
    fontSize: 14,
    marginBottom: 5,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "800",
  },

  profileButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#1D8BFF",
    justifyContent: "center",
    alignItems: "center",
  },

  profileInitial: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
  },

  introCard: {
    backgroundColor: "#0D2747",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "#23476D",
    marginBottom: 28,
  },

  introTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 7,
  },

  introText: {
    color: "#C8D8E9",
    fontSize: 14,
    lineHeight: 21,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },

  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "800",
  },

  glassCount: {
    color: "#8FC8FF",
    fontSize: 13,
    fontWeight: "700",
  },

  glassesList: {
    gap: 12,
  },

  glassCard: {
    minHeight: 92,
    backgroundColor: "#0D2747",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#315679",
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },

  cardPressed: {
    opacity: 0.75,
  },

  glassIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "#183B5F",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  glassIconText: {
    color: "#6CB7FF",
    fontSize: 20,
    fontWeight: "800",
  },

  glassInfo: {
    flex: 1,
  },

  glassName: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 4,
  },

  glassOwner: {
    color: "#B9CDE1",
    fontSize: 13,
    marginBottom: 7,
  },

  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },

  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#52D273",
  },

  statusText: {
    color: "#BDE9C8",
    fontSize: 12,
    fontWeight: "700",
  },

  arrow: {
    color: "#8FB1D2",
    fontSize: 30,
    marginLeft: 8,
  },

  addButton: {
    minHeight: 54,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: "#5EAFFF",
    backgroundColor: "#102F50",
    marginTop: 18,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    gap: 10,
  },

  addButtonIcon: {
    color: "#6CB7FF",
    fontSize: 25,
    fontWeight: "400",
  },

  addButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },

  bottomActions: {
    marginTop: 28,
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },

  actionButton: {
    minHeight: 44,
    justifyContent: "center",
    paddingHorizontal: 16,
  },

  actionText: {
    color: "#BFD5EC",
    fontSize: 14,
    fontWeight: "600",
  },

  logoutText: {
    color: "#FFB4B4",
    fontSize: 14,
    fontWeight: "700",
  },

  buttonPressed: {
    opacity: 0.75,
  },
});

export default FamilyDashboard;