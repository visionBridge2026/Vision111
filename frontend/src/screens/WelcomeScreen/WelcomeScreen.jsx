import React, { useEffect, useState } from "react";
import {
  Image,
  Pressable,
  Text,
  View,
  StyleSheet,
  AccessibilityInfo,
} from "react-native";
import { useRouter } from "expo-router";

import visionBridgeLogo from "../../assests/images/visionbridge-logo.png";

const SPLASH_DURATION = 2000;

function WelcomeScreen() {
  const [showSplash, setShowSplash] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, SPLASH_DURATION);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!showSplash) {
      AccessibilityInfo.announceForAccessibility(
        "Welcome to VisionBridge. Choose how you want to continue."
      );
    }
  }, [showSplash]);

  const handleGlassUserPress = () => {
    router.push("/ScanGlass");
  };

  const handleFamilyMemberPress = () => {
    router.push("/FamilyLogin");
  };

  const handleAgentPress = () => {
    // Navigation will be added when Agent is implemented.
    console.log("Agent selected");
  };

  if (showSplash) {
    return (
      <View
        style={styles.splash}
        accessible={true}
        accessibilityLabel="VisionBridge loading"
        accessibilityRole="progressbar"
      >
        <View style={styles.splashContent}>
          <Image
            source={visionBridgeLogo}
            style={styles.splashLogo}
            resizeMode="contain"
            accessible={true}
            accessibilityLabel="VisionBridge logo"
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.page}>
      <View
        style={styles.card}
        accessible={true}
        accessibilityLabel="VisionBridge welcome"
      >
        <View style={styles.content}>
          <Image
            source={visionBridgeLogo}
            style={styles.logo}
            resizeMode="contain"
            accessible={true}
            accessibilityLabel="VisionBridge logo"
          />

          <Text
            style={styles.heading}
            accessibilityRole="header"
            accessible={true}
          >
            Welcome to VisionBridge
          </Text>

          <Text style={styles.description}>
            Choose how you want to continue.
          </Text>

          <View
            style={styles.options}
            accessible={true}
            accessibilityLabel="Account type options"
          >
            <Pressable
              style={({ pressed }) => [
                styles.roleButton,
                pressed && styles.roleButtonPressed,
              ]}
              onPress={handleGlassUserPress}
              accessibilityRole="button"
              accessibilityLabel="Glass User"
              accessibilityHint="Opens the Glass User device scanning screen"
            >
              <Text style={styles.roleButtonText}>Glass User</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.roleButton,
                pressed && styles.roleButtonPressed,
              ]}
              onPress={handleFamilyMemberPress}
              accessibilityRole="button"
              accessibilityLabel="Family Member"
              accessibilityHint="Continue as a family member"
            >
              <Text style={styles.roleButtonText}>Family Member</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.roleButton,
                pressed && styles.roleButtonPressed,
              ]}
              onPress={handleAgentPress}
              accessibilityRole="button"
              accessibilityLabel="Agent"
              accessibilityHint="Continue as an agent"
            >
              <Text style={styles.roleButtonText}>Agent</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    backgroundColor: "#071A33",
    alignItems: "center",
    justifyContent: "center",
  },

  splashContent: {
    alignItems: "center",
    justifyContent: "center",
  },

  splashLogo: {
    width: 220,
    height: 220,
  },

  page: {
    flex: 1,
    backgroundColor: "#071A33",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 32,
  },

  card: {
    width: "100%",
    maxWidth: 500,
    alignItems: "center",
    justifyContent: "center",
  },

  content: {
    width: "100%",
    alignItems: "center",
  },

  logo: {
    width: 180,
    height: 100,
    marginBottom: 28,
  },

  heading: {
    fontSize: 30,
    lineHeight: 38,
    fontWeight: "700",
    textAlign: "center",
    color: "#FFFFFF",
    marginBottom: 12,
  },

  description: {
    fontSize: 17,
    lineHeight: 26,
    textAlign: "center",
    color: "#7a818c",
    marginBottom: 32,
  },

  options: {
    width: "100%",
    gap: 16,
  },

  roleButton: {
    minHeight: 52,
    width: "100%",
    borderRadius: 12,
    backgroundColor: "#111827",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  roleButtonPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.98 }],
  },

  roleButtonText: {
    fontSize: 17,
    lineHeight: 24,
    fontWeight: "600",
    color: "#FFFFFF",
    textAlign: "center",
  },
});

export default WelcomeScreen;