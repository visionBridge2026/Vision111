import React, { useState } from "react";
import {
  ActivityIndicator,
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

// Use your computer's LAN IP when testing on a physical phone.
// Example:
// const API_URL = "http://192.168.1.3:8000";

const API_URL = "http://192.168.1.142:8000";

function FamilyLogin() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert(
        "Missing information",
        "Please enter your email address and password."
      );
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/users/family/login/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        const message =
          data?.message ||
          data?.detail ||
          "Login failed. Please check your email and password.";

        Alert.alert("Login failed", message);
        return;
      }

      /*
       * Successful Django response contains:
       *
       * tokens.access
       * tokens.refresh
       * family_member
       */

      if (data.tokens?.access) {
        // Temporary token storage for testing.
        // We will replace this with expo-secure-store
        // when we build the proper authentication layer.
        global.familyAccessToken = data.tokens.access;
      }

      if (data.tokens?.refresh) {
        global.familyRefreshToken = data.tokens.refresh;
      }

      setShowLoginModal(false);

      router.replace("/FamilyDashboard");
    } catch (error) {
      console.error("Family login error:", error);

      Alert.alert(
        "Connection error",
        "Could not connect to the VisionBridge server. Make sure Django is running and the API address is correct."
      );
    } finally {
      setIsLoading(false);
    }
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
            <View
              style={styles.logoPlaceholder}
              accessible
              accessibilityLabel="VisionBridge"
            >
              <Text
                style={styles.logoText}
                accessibilityElementsHidden
              >
                VB
              </Text>
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
                  isLoading && styles.buttonDisabled,
                ]}
                onPress={() => setShowLoginModal(true)}
                accessibilityRole="button"
                accessibilityLabel="I already have an account"
                accessibilityHint="Opens the family member login form"
                disabled={isLoading}
              >
                <Text style={styles.primaryButtonText}>
                  I Have an Account
                </Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.secondaryButton,
                  pressed && styles.buttonPressed,
                  isLoading && styles.buttonDisabled,
                ]}
                onPress={handleCreateAccount}
                accessibilityRole="button"
                accessibilityLabel="Create a new family member account"
                accessibilityHint="Opens the registration form"
                disabled={isLoading}
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
                isLoading && styles.buttonDisabled,
              ]}
              onPress={() => router.back()}
              accessibilityRole="button"
              accessibilityLabel="Go back"
              disabled={isLoading}
            >
              <Text style={styles.backButtonText}>Back</Text>
            </Pressable>
          </View>
        </ScrollView>

        <Modal
          visible={showLoginModal}
          transparent
          animationType="fade"
          onRequestClose={() => {
            if (!isLoading) {
              setShowLoginModal(false);
            }
          }}
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
                    disabled={isLoading}
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
                  {/* EMAIL */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>
                      Email Address
                    </Text>

                    <TextInput
                      style={styles.input}
                      value={email}
                      onChangeText={setEmail}
                      placeholder="Enter your email"
                      placeholderTextColor="#7E8CA3"
                      autoCapitalize="none"
                      autoCorrect={false}
                      keyboardType="email-address"
                      textContentType="emailAddress"
                      accessibilityLabel="Email address"
                      accessibilityHint="Enter the email address used to create your family account"
                      editable={!isLoading}
                    />
                  </View>

                  {/* PASSWORD */}
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
                      accessibilityHint="Enter your family account password"
                      editable={!isLoading}
                    />
                  </View>

                  {/* LOGIN */}
                  <Pressable
                    style={({ pressed }) => [
                      styles.loginButton,
                      pressed && styles.buttonPressed,
                      isLoading && styles.buttonDisabled,
                    ]}
                    onPress={handleLogin}
                    accessibilityRole="button"
                    accessibilityLabel="Log in"
                    accessibilityHint="Sign in to your VisionBridge family account"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <ActivityIndicator
                          size="small"
                          color="#FFFFFF"
                          accessibilityLabel="Logging in"
                        />

                        <Text style={styles.loginButtonText}>
                          Logging In...
                        </Text>
                      </>
                    ) : (
                      <Text style={styles.loginButtonText}>
                        Log In
                      </Text>
                    )}
                  </Pressable>

                  {/* REGISTER */}
                  <Pressable
                    style={styles.switchButton}
                    onPress={() => {
                      if (isLoading) {
                        return;
                      }

                      setShowLoginModal(false);
                      router.push("/FamilyRegister");
                    }}
                    accessibilityRole="button"
                    accessibilityLabel="Create a new family account"
                    disabled={isLoading}
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
  },

  buttonDisabled: {
    opacity: 0.6,
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
    flexDirection: "row",
    gap: 10,
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