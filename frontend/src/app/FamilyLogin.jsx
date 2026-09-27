import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { router } from "expo-router";

function FamilyLogin() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (!username.trim() || !password) {
      Alert.alert(
        "Missing information",
        "Please enter your username and password."
      );
      return;
    }

    /*
     * Temporary navigation.
     *
     * Later this will:
     * 1. Send username/password to Django.
     * 2. Receive JWT access/refresh tokens.
     * 3. Store the tokens securely.
     * 4. Navigate to FamilyDashboard.
     */

    setShowLoginModal(false);
    router.replace("/FamilyDashboard");
  };

  const handleCreateAccount = () => {
    router.push("/FamilyRegister");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View
            style={styles.card}
            accessible
            accessibilityLabel="Family member login"
          >
            <View style={styles.logoPlaceholder}>
              <Text style={styles.logoText}>VB</Text>
            </View>

            <Text
              style={styles.title}
              accessibilityRole="header"
            >
              Family Member
            </Text>

            <Text style={styles.subtitle}>
              Connect and manage your VisionBridge glasses.
            </Text>

            <View style={styles.optionsContainer}>
              <Pressable
                style={({ pressed }) => [
                  styles.primaryButton,
                  pressed && styles.buttonPressed,
                ]}
                onPress={() => setShowLoginModal(true)}
                accessibilityRole="button"
                accessibilityLabel="I already have an account"
                accessibilityHint="Opens the family member login form"
              >
                <Text style={styles.primaryButtonText}>
                  I Have an Account
                </Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.secondaryButton,
                  pressed && styles.buttonPressed,
                ]}
                onPress={handleCreateAccount}
                accessibilityRole="button"
                accessibilityLabel="Create a new family member account"
                accessibilityHint="Opens the registration form"
              >
                <Text style={styles.secondaryButtonText}>
                  I'm New Here
                </Text>
              </Pressable>
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.backButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={() => router.back()}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <Text style={styles.backButtonText}>Back</Text>
            </Pressable>
          </View>
        </ScrollView>

        <Modal
          visible={showLoginModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowLoginModal(false)}
        >
          <View style={styles.modalOverlay}>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : undefined}
              style={styles.modalKeyboard}
            >
              <View
                style={styles.modalCard}
                accessible
                accessibilityViewIsModal
                accessibilityLabel="Family member login form"
              >
                <View style={styles.modalHeader}>
                  <View style={styles.modalHeaderText}>
                    <Text
                      style={styles.modalTitle}
                      accessibilityRole="header"
                    >
                      Welcome Back
                    </Text>

                    <Text style={styles.modalSubtitle}>
                      Enter your VisionBridge family account details.
                    </Text>
                  </View>

                  <Pressable
                    style={styles.closeButton}
                    onPress={() => setShowLoginModal(false)}
                    accessibilityRole="button"
                    accessibilityLabel="Close login"
                  >
                    <Text
                      style={styles.closeButtonText}
                      accessibilityElementsHidden
                    >
                      ×
                    </Text>
                  </Pressable>
                </View>

                <View style={styles.form}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Username</Text>

                    <TextInput
                      style={styles.input}
                      value={username}
                      onChangeText={setUsername}
                      placeholder="Enter your username"
                      placeholderTextColor="#7E8CA3"
                      autoCapitalize="none"
                      autoCorrect={false}
                      textContentType="username"
                      accessibilityLabel="Username"
                      accessibilityHint="Enter your VisionBridge username"
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Password</Text>

                    <TextInput
                      style={styles.input}
                      value={password}
                      onChangeText={setPassword}
                      placeholder="Enter your password"
                      placeholderTextColor="#7E8CA3"
                      secureTextEntry
                      textContentType="password"
                      accessibilityLabel="Password"
                      accessibilityHint="Enter your VisionBridge password"
                    />
                  </View>

                  <Pressable
                    style={({ pressed }) => [
                      styles.loginButton,
                      pressed && styles.buttonPressed,
                    ]}
                    onPress={handleLogin}
                    accessibilityRole="button"
                    accessibilityLabel="Log in"
                  >
                    <Text style={styles.loginButtonText}>
                      Log In
                    </Text>
                  </Pressable>

                  <Pressable
                    style={styles.switchButton}
                    onPress={() => {
                      setShowLoginModal(false);
                      router.push("/FamilyRegister");
                    }}
                    accessibilityRole="button"
                    accessibilityLabel="Create a new family account"
                  >
                    <Text style={styles.switchButtonText}>
                      Don't have an account?{" "}
                      <Text style={styles.switchButtonStrong}>
                        Create one
                      </Text>
                    </Text>
                  </Pressable>
                </View>
              </View>
            </KeyboardAvoidingView>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },

  safeArea: {
    flex: 1,
    backgroundColor: "#071A33",
  },

  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
  },

  card: {
    width: "100%",
    maxWidth: 500,
    alignItems: "center",
    backgroundColor: "#0D2747",
    borderRadius: 28,
    paddingHorizontal: 28,
    paddingVertical: 36,
    borderWidth: 1,
    borderColor: "#23476D",
  },

  logoPlaceholder: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: "#1D8BFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 22,
  },

  logoText: {
    color: "#FFFFFF",
    fontSize: 25,
    fontWeight: "800",
    letterSpacing: 1,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 10,
  },

  subtitle: {
    color: "#D9E6F5",
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    maxWidth: 360,
    marginBottom: 34,
  },

  optionsContainer: {
    width: "100%",
    gap: 14,
  },

  primaryButton: {
    minHeight: 52,
    borderRadius: 16,
    backgroundColor: "#1D8BFF",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  secondaryButton: {
    minHeight: 52,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#5EAFFF",
    backgroundColor: "#102F50",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  secondaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  buttonPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.98 }],
  },

  backButton: {
    minHeight: 44,
    marginTop: 20,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  backButtonText: {
    color: "#BFD5EC",
    fontSize: 15,
    fontWeight: "600",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.72)",
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  modalKeyboard: {
    width: "100%",
  },

  modalCard: {
    width: "100%",
    maxWidth: 500,
    alignSelf: "center",
    backgroundColor: "#0D2747",
    borderRadius: 26,
    padding: 26,
    borderWidth: 1,
    borderColor: "#315679",
  },

  modalHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 26,
  },

  modalHeaderText: {
    flex: 1,
    paddingRight: 12,
  },

  modalTitle: {
    color: "#FFFFFF",
    fontSize: 25,
    fontWeight: "800",
    marginBottom: 7,
  },

  modalSubtitle: {
    color: "#C8D8E9",
    fontSize: 14,
    lineHeight: 21,
  },

  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#183B5F",
    justifyContent: "center",
    alignItems: "center",
  },

  closeButtonText: {
    color: "#FFFFFF",
    fontSize: 28,
    lineHeight: 30,
    fontWeight: "400",
  },

  form: {
    gap: 18,
  },

  inputGroup: {
    gap: 8,
  },

  label: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },

  input: {
    minHeight: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#4A6785",
    backgroundColor: "#081E37",
    color: "#FFFFFF",
    paddingHorizontal: 16,
    fontSize: 16,
  },

  loginButton: {
    minHeight: 52,
    borderRadius: 15,
    backgroundColor: "#1D8BFF",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 4,
  },

  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },

  switchButton: {
    minHeight: 44,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
  },

  switchButtonText: {
    color: "#C8D8E9",
    fontSize: 14,
    textAlign: "center",
  },

  switchButtonStrong: {
    color: "#6CB7FF",
    fontWeight: "800",
  },
});

export default FamilyLogin;