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

function FamilyRegister() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [relationship, setRelationship] = useState("");
  const [glassId, setGlassId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showQrModal, setShowQrModal] = useState(false);

  const handleRegister = () => {
    if (
      !fullName.trim() ||
      !email.trim() ||
      !phoneNumber.trim() ||
      !relationship.trim() ||
      !glassId.trim() ||
      !password ||
      !confirmPassword
    ) {
      Alert.alert(
        "Missing information",
        "Please complete all required fields."
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert(
        "Passwords do not match",
        "Please make sure both passwords are the same."
      );
      return;
    }

    /*
     * Temporary registration flow.
     *
     * Later this will:
     * 1. Send the registration information to Django.
     * 2. Create the family account.
     * 3. Link the VisionBridge glasses.
     * 4. Receive authentication tokens.
     * 5. Navigate to FamilyDashboard.
     */

    router.replace("/FamilyDashboard");
  };

  const handleScanGlass = () => {
    setShowQrModal(true);
  };

  const handleCloseQrModal = () => {
    setShowQrModal(false);
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
          <View style={styles.card}>
            <Pressable
              style={styles.backButton}
              onPress={() => router.back()}
              accessibilityRole="button"
              accessibilityLabel="Go back"
              accessibilityHint="Return to the previous screen"
            >
              <Text style={styles.backButtonText}>‹ Back</Text>
            </Pressable>

            <View
              style={styles.logo}
              accessible
              accessibilityLabel="VisionBridge"
            >
              <Text style={styles.logoText}>VB</Text>
            </View>

            <Text
              style={styles.title}
              accessibilityRole="header"
            >
              Create Family Account
            </Text>

            <Text style={styles.subtitle}>
              Create an account to connect and manage your VisionBridge
              glasses.
            </Text>

            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Full Name</Text>

                <TextInput
                  style={styles.input}
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="Enter your full name"
                  placeholderTextColor="#7E8CA3"
                  autoCapitalize="words"
                  textContentType="name"
                  accessibilityLabel="Full name"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>

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
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Phone Number</Text>

                <TextInput
                  style={styles.input}
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  placeholder="Enter your phone number"
                  placeholderTextColor="#7E8CA3"
                  keyboardType="phone-pad"
                  textContentType="telephoneNumber"
                  accessibilityLabel="Phone number"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  Relationship to Glass User
                </Text>

                <TextInput
                  style={styles.input}
                  value={relationship}
                  onChangeText={setRelationship}
                  placeholder="e.g. Parent, Sibling, Guardian"
                  placeholderTextColor="#7E8CA3"
                  autoCapitalize="sentences"
                  accessibilityLabel="Relationship to glass user"
                />
              </View>

              <View style={styles.glassSection}>
                <View style={styles.sectionHeading}>
                  <View style={styles.sectionHeadingText}>
                    <Text style={styles.sectionTitle}>
                      Connect VisionBridge Glasses
                    </Text>

                    <Text style={styles.sectionDescription}>
                      Enter the glass ID or scan the QR code shown by the
                      VisionBridge glasses.
                    </Text>
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Glass ID</Text>

                  <TextInput
                    style={styles.input}
                    value={glassId}
                    onChangeText={setGlassId}
                    placeholder="Enter glass ID"
                    placeholderTextColor="#7E8CA3"
                    autoCapitalize="characters"
                    autoCorrect={false}
                    accessibilityLabel="VisionBridge glass ID"
                  />
                </View>

                <Pressable
                  style={({ pressed }) => [
                    styles.scanButton,
                    pressed && styles.buttonPressed,
                  ]}
                  onPress={handleScanGlass}
                  accessibilityRole="button"
                  accessibilityLabel="Scan VisionBridge glass QR code"
                  accessibilityHint="Open the QR code scanner"
                >
                  <Text
                    style={styles.scanButtonIcon}
                    accessibilityElementsHidden
                  >
                    ▣
                  </Text>

                  <Text style={styles.scanButtonText}>
                    Scan QR Code
                  </Text>
                </Pressable>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>

                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Create a password"
                  placeholderTextColor="#7E8CA3"
                  secureTextEntry
                  textContentType="newPassword"
                  accessibilityLabel="Password"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Confirm Password</Text>

                <TextInput
                  style={styles.input}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm your password"
                  placeholderTextColor="#7E8CA3"
                  secureTextEntry
                  textContentType="newPassword"
                  accessibilityLabel="Confirm password"
                />
              </View>

              <Pressable
                style={({ pressed }) => [
                  styles.createButton,
                  pressed && styles.buttonPressed,
                ]}
                onPress={handleRegister}
                accessibilityRole="button"
                accessibilityLabel="Create family account"
                accessibilityHint="Create your VisionBridge family account"
              >
                <Text style={styles.createButtonText}>
                  Create Family Account
                </Text>
              </Pressable>

              <Pressable
                style={styles.loginLink}
                onPress={() => router.replace("/FamilyLogin")}
                accessibilityRole="button"
                accessibilityLabel="Already have an account"
              >
                <Text style={styles.loginLinkText}>
                  Already have an account?{" "}
                  <Text style={styles.loginLinkStrong}>
                    Log In
                  </Text>
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>

        <Modal
          visible={showQrModal}
          transparent
          animationType="fade"
          onRequestClose={handleCloseQrModal}
        >
          <View style={styles.modalOverlay}>
            <View
              style={styles.modalCard}
              accessibilityViewIsModal
              accessible
              accessibilityLabel="Scan VisionBridge QR code"
            >
              <View style={styles.modalHeader}>
                <View style={styles.modalHeaderText}>
                  <Text
                    style={styles.modalTitle}
                    accessibilityRole="header"
                  >
                    Scan QR Code
                  </Text>

                  <Text style={styles.modalSubtitle}>
                    Scan the QR code displayed by your VisionBridge
                    glasses.
                  </Text>
                </View>

                <Pressable
                  style={styles.closeButton}
                  onPress={handleCloseQrModal}
                  accessibilityRole="button"
                  accessibilityLabel="Close QR scanner"
                >
                  <Text
                    style={styles.closeButtonText}
                    accessibilityElementsHidden
                  >
                    ×
                  </Text>
                </Pressable>
              </View>

              <View style={styles.qrPlaceholder}>
                <Text
                  style={styles.qrPlaceholderIcon}
                  accessibilityElementsHidden
                >
                  QR
                </Text>

                <Text style={styles.qrPlaceholderTitle}>
                  QR Scanner
                </Text>

                <Text style={styles.qrPlaceholderText}>
                  The camera-based QR scanner will be connected here.
                </Text>
              </View>

              <Pressable
                style={({ pressed }) => [
                  styles.closeModalButton,
                  pressed && styles.buttonPressed,
                ]}
                onPress={handleCloseQrModal}
                accessibilityRole="button"
                accessibilityLabel="Close QR scanner"
              >
                <Text style={styles.closeModalButtonText}>
                  Close
                </Text>
              </Pressable>
            </View>
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
    alignItems: "center",
    paddingHorizontal: 22,
    paddingVertical: 28,
  },

  card: {
    width: "100%",
    maxWidth: 520,
    backgroundColor: "#0D2747",
    borderRadius: 26,
    borderWidth: 1,
    borderColor: "#23476D",
    paddingHorizontal: 24,
    paddingVertical: 28,
  },

  backButton: {
    minHeight: 44,
    alignSelf: "flex-start",
    justifyContent: "center",
    paddingHorizontal: 4,
    marginBottom: 18,
  },

  backButtonText: {
    color: "#BFD5EC",
    fontSize: 15,
    fontWeight: "600",
  },

  logo: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#1D8BFF",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },

  logoText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: 1,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 9,
  },

  subtitle: {
    color: "#C8D8E9",
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
    marginBottom: 28,
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

  glassSection: {
    backgroundColor: "#102F50",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#315679",
    padding: 18,
    gap: 16,
  },

  sectionHeading: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  sectionHeadingText: {
    flex: 1,
  },

  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 6,
  },

  sectionDescription: {
    color: "#B9CDE1",
    fontSize: 13,
    lineHeight: 19,
  },

  scanButton: {
    minHeight: 50,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#5EAFFF",
    backgroundColor: "#183B5F",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    gap: 9,
  },

  scanButtonIcon: {
    color: "#6CB7FF",
    fontSize: 19,
    fontWeight: "700",
  },

  scanButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },

  createButton: {
    minHeight: 54,
    borderRadius: 16,
    backgroundColor: "#1D8BFF",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 2,
  },

  createButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },

  buttonPressed: {
    opacity: 0.75,
  },

  loginLink: {
    minHeight: 44,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
  },

  loginLinkText: {
    color: "#C8D8E9",
    fontSize: 14,
    textAlign: "center",
  },

  loginLinkStrong: {
    color: "#6CB7FF",
    fontWeight: "800",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.72)",
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  modalCard: {
    width: "100%",
    maxWidth: 500,
    alignSelf: "center",
    backgroundColor: "#0D2747",
    borderRadius: 26,
    borderWidth: 1,
    borderColor: "#315679",
    padding: 24,
  },

  modalHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 22,
  },

  modalHeaderText: {
    flex: 1,
    paddingRight: 12,
  },

  modalTitle: {
    color: "#FFFFFF",
    fontSize: 24,
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
  },

  qrPlaceholder: {
    minHeight: 240,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#4A6785",
    backgroundColor: "#081E37",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    marginBottom: 18,
  },

  qrPlaceholderIcon: {
    color: "#6CB7FF",
    fontSize: 34,
    fontWeight: "800",
    marginBottom: 12,
  },

  qrPlaceholderTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 7,
  },

  qrPlaceholderText: {
    color: "#B9CDE1",
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
  },

  closeModalButton: {
    minHeight: 50,
    borderRadius: 14,
    backgroundColor: "#1D8BFF",
    justifyContent: "center",
    alignItems: "center",
  },

  closeModalButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
});

export default FamilyRegister;