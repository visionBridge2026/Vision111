import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  AccessibilityInfo,
  Alert,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

import visionBridgeLogo from "../assests/images/visionbridge-logo.png";

const API_URL = "http://172.30.18.5:8000/api";

export default function ScanGlass() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();

  const [permission, requestPermission] = useCameraPermissions();

  const [showQrModal, setShowQrModal] = useState(false);
  const [scannerError, setScannerError] = useState("");
  const [apiError, setApiError] = useState("");
  const [scanStatus, setScanStatus] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [hasScanned, setHasScanned] = useState(false);

  const isSmallScreen = width <= 600;

  /*
   * Announce important scanner states to screen readers.
   */
  useEffect(() => {
    const message =
      apiError ||
      scannerError ||
      scanStatus;

    if (message) {
      AccessibilityInfo.announceForAccessibility(message);
    }
  }, [apiError, scannerError, scanStatus]);

  /*
   * Request camera permission and open scanner.
   */
  const openScanner = async () => {
    setScannerError("");
    setApiError("");
    setScanStatus("");
    setHasScanned(false);
    setIsVerifying(false);

    if (!permission?.granted) {
      const result = await requestPermission();

      if (!result.granted) {
        setScannerError(
          "Camera permission is required to scan your VisionBridge QR code."
        );
        setShowQrModal(true);
        return;
      }
    }

    setShowQrModal(true);
    setScanStatus("Camera ready. Point it at the VisionBridge QR code.");
  };

  /*
   * Close scanner.
   */
  const closeScanner = () => {
    setShowQrModal(false);
    setScannerError("");
    setApiError("");
    setScanStatus("");
    setIsVerifying(false);
    setHasScanned(false);
  };

  /*
   * Verify QR data with Django backend.
   */
  const verifyDevice = async (decodedText) => {
    setIsVerifying(true);
    setScanStatus("QR code scanned. Verifying VisionBridge device...");
    setApiError("");

    let qrData;

    try {
      qrData = JSON.parse(decodedText);
    } catch {
      setApiError(
        "This QR code is not a valid VisionBridge device QR code."
      );
      setScanStatus("");
      setIsVerifying(false);
      setHasScanned(false);
      return;
    }

    if (!qrData.device_id || !qrData.pairing_token) {
      setApiError(
        "This QR code is missing the required VisionBridge device information."
      );
      setScanStatus("");
      setIsVerifying(false);
      setHasScanned(false);
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/users/devices/verify/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            device_id: qrData.device_id,
            pairing_token: qrData.pairing_token,
          }),
        }
      );

      let data;

      try {
        data = await response.json();
      } catch {
        throw new Error(
          "The VisionBridge server returned an invalid response."
        );
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.detail ||
            "The VisionBridge device could not be verified."
        );
      }

      /*
       * Store authentication/session information.
       */
      await AsyncStorage.multiSet([
        [
          "visionbridge_access_token",
          data.tokens.access,
        ],
        [
          "visionbridge_refresh_token",
          data.tokens.refresh,
        ],
        [
          "visionbridge_user",
          JSON.stringify(data.user),
        ],
        [
          "visionbridge_device",
          JSON.stringify(data.device),
        ],
      ]);

      setScanStatus(
        "VisionBridge device verified successfully."
      );

      /*
       * Give the user a moment to hear the success message.
       */
      setTimeout(() => {
        setShowQrModal(false);
        router.replace("/GlassUser");
      }, 700);
    } catch (error) {
      console.error(
        "Device verification failed:",
        error
      );

      setApiError(
        error.message ||
          "Unable to connect to the VisionBridge server."
      );

      setScanStatus("");
      setIsVerifying(false);
      setHasScanned(false);
    }
  };

  /*
   * Called automatically when CameraView detects a QR code.
   */
  const handleBarcodeScanned = async ({ data, type }) => {
    if (hasScanned || isVerifying) {
      return;
    }

    if (type !== "qr") {
      return;
    }

    setHasScanned(true);

    await verifyDevice(data);
  };

  /*
   * Retry after camera error.
   */
  const retryScanner = async () => {
    setScannerError("");
    setApiError("");
    setScanStatus("");
    setHasScanned(false);
    setIsVerifying(false);

    if (!permission?.granted) {
      const result = await requestPermission();

      if (!result.granted) {
        setScannerError(
          "Camera permission is required to scan your VisionBridge QR code."
        );
        return;
      }
    }

    setScanStatus(
      "Ready to scan another VisionBridge QR code."
    );
  };

  /*
   * Scan another QR code after an API/QR error.
   */
  const scanAgain = () => {
    setApiError("");
    setScannerError("");
    setScanStatus(
      "Ready to scan another VisionBridge QR code."
    );
    setHasScanned(false);
    setIsVerifying(false);
  };

  return (
    <View style={styles.page}>
      <View
        style={[
          styles.card,
          isSmallScreen && styles.cardSmall,
        ]}
      >
        {/* Logo */}
        <Image
          source={visionBridgeLogo}
          style={styles.logo}
          resizeMode="contain"
          accessible
          accessibilityLabel="VisionBridge logo"
        />

        {/* Title */}
        <Text
          style={styles.title}
          accessibilityRole="header"
        >
          Glass User Login
        </Text>

        {/* Description */}
        <Text style={styles.description}>
          Scan the QR code on your VisionBridge glasses to
          securely connect your device.
        </Text>

        {/* Scan button */}
        <Pressable
          style={({ pressed }) => [
            styles.scanButton,
            pressed && styles.scanButtonPressed,
          ]}
          onPress={openScanner}
          accessibilityRole="button"
          accessibilityLabel="Scan QR Code"
          accessibilityHint="Opens the camera to scan your VisionBridge glasses QR code"
        >
          <Text style={styles.scanButtonText}>
            Scan QR Code
          </Text>
        </Pressable>

        {/* Back button */}
        <Pressable
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.backButtonPressed,
          ]}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Back"
          accessibilityHint="Returns to the previous screen"
        >
          <Text style={styles.backButtonText}>
            Back
          </Text>
        </Pressable>
      </View>

      {/* QR Scanner Modal */}
      <Modal
        visible={showQrModal}
        transparent
        animationType="fade"
        onRequestClose={closeScanner}
        accessibilityViewIsModal
      >
        <View style={styles.modalBackdrop}>
          <View
            style={[
              styles.modal,
              isSmallScreen && styles.modalSmall,
            ]}
          >
            {/* Close */}
            <Pressable
              style={({ pressed }) => [
                styles.closeButton,
                pressed && styles.closeButtonPressed,
              ]}
              onPress={closeScanner}
              accessibilityRole="button"
              accessibilityLabel="Close QR scanner"
              accessibilityHint="Closes the QR scanner"
            >
              <Text
                style={styles.closeButtonText}
                accessibilityElementsHidden
              >
                ×
              </Text>
            </Pressable>

            {/* Modal title */}
            <Text
              style={styles.modalTitle}
              accessibilityRole="header"
            >
              Scan VisionBridge QR Code
            </Text>

            {/* Modal description */}
            <Text style={styles.modalDescription}>
              Point your phone camera at the QR code on your
              VisionBridge glasses.
            </Text>

            {/* Camera */}
            <View
              style={[
                styles.scannerContainer,
                isSmallScreen &&
                  styles.scannerContainerSmall,
              ]}
              accessible
              accessibilityLabel="QR code scanner camera"
            >
              {permission?.granted && !scannerError ? (
                <CameraView
                  style={StyleSheet.absoluteFillObject}
                  facing="back"
                  barcodeScannerSettings={{
                    barcodeTypes: ["qr"],
                  }}
                  onBarcodeScanned={
                    hasScanned
                      ? undefined
                      : handleBarcodeScanned
                  }
                />
              ) : (
                <View style={styles.cameraPlaceholder}>
                  <Text style={styles.cameraPlaceholderText}>
                    Camera unavailable
                  </Text>
                </View>
              )}

              {/* Scanner frame */}
              {!scannerError &&
                permission?.granted && (
                  <View
                    pointerEvents="none"
                    style={styles.qrFrame}
                  />
                )}

              {/* Verifying overlay */}
              {isVerifying && (
                <View style={styles.scannerOverlay}>
                  <ActivityIndicator
                    size="large"
                    color="#ffffff"
                  />

                  <Text style={styles.overlayText}>
                    Verifying device...
                  </Text>
                </View>
              )}
            </View>

            {/* Status */}
            {scanStatus && !isVerifying && (
              <Text
                style={styles.status}
                accessibilityLiveRegion="polite"
              >
                {scanStatus}
              </Text>
            )}

            {/* Camera error */}
            {scannerError && (
              <View
                style={styles.errorBox}
                accessibilityRole="alert"
                accessibilityLiveRegion="assertive"
              >
                <Text style={styles.errorText}>
                  {scannerError}
                </Text>

                <Pressable
                  style={({ pressed }) => [
                    styles.retryButton,
                    pressed &&
                      styles.retryButtonPressed,
                  ]}
                  onPress={retryScanner}
                  disabled={isVerifying}
                  accessibilityRole="button"
                  accessibilityLabel="Try Again"
                >
                  <Text style={styles.retryButtonText}>
                    Try Again
                  </Text>
                </Pressable>
              </View>
            )}

            {/* API / QR error */}
            {apiError && (
              <View
                style={styles.errorBox}
                accessibilityRole="alert"
                accessibilityLiveRegion="assertive"
              >
                <Text style={styles.errorText}>
                  {apiError}
                </Text>

                <Pressable
                  style={({ pressed }) => [
                    styles.retryButton,
                    pressed &&
                      styles.retryButtonPressed,
                  ]}
                  onPress={scanAgain}
                  disabled={isVerifying}
                  accessibilityRole="button"
                  accessibilityLabel="Scan Again"
                >
                  <Text style={styles.retryButtonText}>
                    Scan Again
                  </Text>
                </Pressable>
              </View>
            )}

            {/* Verification status */}
            {isVerifying && (
              <Text
                style={styles.verification}
                accessibilityLiveRegion="assertive"
              >
                Verifying device...
              </Text>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

/*
 * Native styles.
 *
 * These reproduce the visual values from ScanGlass.css.
 * The .css file cannot directly style Android/iOS in plain Expo.
 */
const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#030816",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 32,
  },

  card: {
    width: "100%",
    maxWidth: 520,
    minHeight: 650,
    backgroundColor: "#071020",
    borderRadius: 24,
    paddingHorizontal: 40,
    paddingVertical: 48,
    alignItems: "center",
    justifyContent: "center",
  },

  cardSmall: {
    minHeight: 0,
    flex: 1,
    maxHeight: "100%",
    paddingHorizontal: 24,
    paddingVertical: 36,
    borderRadius: 18,
  },

  logo: {
    width: 230,
    height: 120,
    marginBottom: 32,
  },

  title: {
    color: "#ffffff",
    fontSize: 32,
    lineHeight: 40,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 16,
  },

  description: {
    width: "100%",
    maxWidth: 390,
    color: "#c9d4e5",
    fontSize: 16,
    lineHeight: 26,
    textAlign: "center",
    marginBottom: 32,
  },

  scanButton: {
    width: "100%",
    maxWidth: 360,
    minHeight: 64,
    paddingHorizontal: 24,
    borderRadius: 999,
    backgroundColor: "#3f82f1",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },

  scanButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },

  scanButtonText: {
    color: "#ffffff",
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "600",
    textAlign: "center",
  },

  backButton: {
    minWidth: 100,
    minHeight: 44,
    paddingHorizontal: 24,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },

  backButtonPressed: {
    opacity: 0.7,
  },

  backButtonText: {
    color: "#c9d4e5",
    fontSize: 16,
    fontWeight: "500",
  },

  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.78)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 24,
  },

  modal: {
    width: "100%",
    maxWidth: 480,
    maxHeight: "95%",
    backgroundColor: "#071020",
    borderRadius: 24,
    paddingHorizontal: 28,
    paddingVertical: 28,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 10,
  },

  modalSmall: {
    maxHeight: "95%",
    paddingHorizontal: 18,
    paddingVertical: 22,
    borderRadius: 22,
  },

  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-end",
    marginBottom: 8,
  },

  closeButtonPressed: {
    opacity: 0.7,
  },

  closeButtonText: {
    color: "#ffffff",
    fontSize: 30,
    lineHeight: 32,
    fontWeight: "300",
  },

  modalTitle: {
    color: "#ffffff",
    fontSize: 26,
    lineHeight: 34,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 10,
  },

  modalDescription: {
    color: "#c9d4e5",
    fontSize: 15,
    lineHeight: 23,
    textAlign: "center",
    marginBottom: 20,
  },

  scannerContainer: {
    width: "100%",
    minHeight: 300,
    height: 340,
    backgroundColor: "#02050d",
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },

  scannerContainerSmall: {
    minHeight: 280,
    height: 300,
  },

  cameraPlaceholder: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#02050d",
  },

  cameraPlaceholderText: {
    color: "#c9d4e5",
    fontSize: 16,
  },

  qrFrame: {
    width: 250,
    height: 250,
    borderWidth: 3,
    borderColor: "#ffffff",
    borderRadius: 18,
    backgroundColor: "transparent",
  },

  scannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.55)",
    alignItems: "center",
    justifyContent: "center",
  },

  overlayText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 14,
  },

  status: {
    color: "#c9d4e5",
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
    marginTop: 16,
  },

  errorBox: {
    width: "100%",
    marginTop: 18,
    padding: 16,
    backgroundColor: "rgba(220, 53, 69, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(220, 53, 69, 0.35)",
    borderRadius: 14,
    alignItems: "center",
  },

  errorText: {
    color: "#ffffff",
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
    marginBottom: 14,
  },

  retryButton: {
    minWidth: 110,
    minHeight: 44,
    paddingHorizontal: 22,
    borderRadius: 999,
    backgroundColor: "#3f82f1",
    alignItems: "center",
    justifyContent: "center",
  },

  retryButtonPressed: {
    opacity: 0.8,
  },

  retryButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "600",
  },

  verification: {
    color: "#ffffff",
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
    marginTop: 16,
    fontWeight: "600",
  },
});