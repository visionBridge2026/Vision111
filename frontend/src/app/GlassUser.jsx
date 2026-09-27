import React, { useEffect, useState } from "react";
import {
  AccessibilityInfo,
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import {
  CameraView,
  useCameraPermissions,
} from "expo-camera";

export default function GlassUser() {
  const { width } = useWindowDimensions();

  const [permission, requestPermission] =
    useCameraPermissions();

  const [cameraError, setCameraError] = useState("");
  const [isCameraReady, setIsCameraReady] = useState(false);

  const isSmallScreen = width <= 600;

  /*
   * Announce camera errors to screen readers.
   */
  useEffect(() => {
    if (cameraError) {
      AccessibilityInfo.announceForAccessibility(
        cameraError
      );
    }
  }, [cameraError]);

  /*
   * Start camera / request permission.
   */
  const startCamera = async () => {
    setCameraError("");
    setIsCameraReady(false);

    try {
      let currentPermission = permission;

      if (!currentPermission?.granted) {
        currentPermission = await requestPermission();
      }

      if (!currentPermission?.granted) {
        throw new Error(
          "Camera permission was not granted."
        );
      }

      /*
       * CameraView itself handles opening the camera.
       * onCameraReady below tells us when the preview
       * is ready.
       */
    } catch (error) {
      console.error("Camera error:", error);

      setCameraError(
        "Camera access is unavailable. Please allow camera permission and try again."
      );
    }
  };

  /*
   * Start camera when page opens.
   */
  useEffect(() => {
    startCamera();
  }, []);

  /*
   * Camera successfully initialized.
   */
  const handleCameraReady = () => {
    setCameraError("");
    setIsCameraReady(true);

    AccessibilityInfo.announceForAccessibility(
      "Camera ready."
    );
  };

  /*
   * Camera failed.
   */
  const handleCameraError = (error) => {
    console.error("Camera preview error:", error);

    setIsCameraReady(false);

    setCameraError(
      "Camera access is unavailable. Please allow camera permission and try again."
    );
  };

  /*
   * Retry camera.
   */
  const handleRetryCamera = async () => {
    setCameraError("");
    setIsCameraReady(false);

    await startCamera();
  };

  return (
    <View style={styles.dashboard}>

      {/* =================================================
          CAMERA
      ================================================= */}

      <View style={styles.cameraContainer}>

        {permission?.granted && !cameraError ? (
          <CameraView
            style={StyleSheet.absoluteFillObject}
            facing="back"
            onCameraReady={handleCameraReady}
            onMountError={handleCameraError}
          />
        ) : null}

        {/* =================================================
            CAMERA LOADING
        ================================================= */}

        {!isCameraReady && !cameraError && (
          <View
            style={styles.status}
            accessibilityRole="alert"
            accessibilityLiveRegion="polite"
          >
            <ActivityIndicator
              size="small"
              color="#ffffff"
            />

            <Text style={styles.statusText}>
              Starting camera...
            </Text>
          </View>
        )}

        {/* =================================================
            CAMERA ERROR
        ================================================= */}

        {cameraError && (
          <View
            style={styles.cameraError}
            accessibilityRole="alert"
            accessibilityLiveRegion="assertive"
          >
            <View style={styles.cameraErrorContent}>

              {/* Error icon */}
              <View
                style={styles.errorIcon}
                accessible
                accessibilityLabel="Camera error"
              >
                <Text
                  style={styles.errorIconText}
                  accessibilityElementsHidden
                >
                  !
                </Text>
              </View>

              {/* Heading */}
              <Text
                style={styles.errorTitle}
                accessibilityRole="header"
              >
                Camera unavailable
              </Text>

              {/* Error message */}
              <Text style={styles.errorDescription}>
                {cameraError}
              </Text>

              {/* Retry */}
              <Pressable
                style={({ pressed }) => [
                  styles.retryButton,
                  pressed &&
                    styles.retryButtonPressed,
                ]}
                onPress={handleRetryCamera}
                accessibilityRole="button"
                accessibilityLabel="Try Again"
                accessibilityHint="Attempts to start the camera again"
              >
                <Text style={styles.retryButtonText}>
                  Try Again
                </Text>
              </Pressable>

            </View>
          </View>
        )}
      </View>

      {/* =================================================
          BOTTOM CONTROLS
      ================================================= */}

      <View
        style={[
          styles.controls,
          isSmallScreen && styles.controlsSmall,
        ]}
        pointerEvents="box-none"
      >

        {/* =================================================
            MAIN CIRCULAR BUTTON
        ================================================= */}

        <Pressable
          style={({ pressed }) => [
            styles.mainButton,
            isSmallScreen &&
              styles.mainButtonSmall,
            pressed &&
              styles.mainButtonPressed,
          ]}
          onPress={() => {
            /*
             * This button will be implemented later.
             */
          }}
          accessibilityRole="button"
          accessibilityLabel="VisionBridge action"
          accessibilityHint="VisionBridge main action"
        >
          <View
            accessible={false}
          />
        </Pressable>

      </View>
    </View>
  );
}

/* =========================================================
   NATIVE STYLES
   ========================================================= */

const styles = StyleSheet.create({
  /*
   * Main dashboard
   */
  dashboard: {
    flex: 1,
    backgroundColor: "#000000",
  },

  /*
   * Camera
   */
  cameraContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#000000",
  },

  /*
   * Camera loading
   */
  status: {
    ...StyleSheet.absoluteFillObject,

    alignItems: "center",
    justifyContent: "center",

    paddingHorizontal: 24,

    backgroundColor: "#000000",
  },

  statusText: {
    marginTop: 12,

    color: "#ffffff",

    fontSize: 16,
    lineHeight: 24,

    textAlign: "center",
  },

  /*
   * Camera error
   */
  cameraError: {
    ...StyleSheet.absoluteFillObject,

    alignItems: "center",
    justifyContent: "center",

    paddingHorizontal: 24,

    backgroundColor: "#030816",
  },

  cameraErrorContent: {
    width: "100%",
    maxWidth: 420,

    alignItems: "center",

    textAlign: "center",
  },

  /*
   * Error icon
   */
  errorIcon: {
    width: 56,
    height: 56,

    alignItems: "center",
    justifyContent: "center",

    marginBottom: 20,

    borderWidth: 2,
    borderColor: "#ffffff",
    borderRadius: 28,
  },

  errorIconText: {
    color: "#ffffff",

    fontSize: 24,
    lineHeight: 28,

    fontWeight: "700",
  },

  /*
   * Error title
   */
  errorTitle: {
    marginBottom: 12,

    color: "#ffffff",

    fontSize: 29,
    lineHeight: 36,

    fontWeight: "700",

    textAlign: "center",
  },

  /*
   * Error description
   */
  errorDescription: {
    color: "#c9d4e5",

    fontSize: 16,
    lineHeight: 26,

    textAlign: "center",
  },

  /*
   * Retry
   */
  retryButton: {
    minWidth: 120,
    minHeight: 48,

    marginTop: 24,

    paddingHorizontal: 20,

    alignItems: "center",
    justifyContent: "center",

    borderRadius: 999,

    backgroundColor: "#3f82f1",
  },

  retryButtonPressed: {
    backgroundColor: "#2f70d8",
    transform: [{ scale: 0.98 }],
  },

  retryButtonText: {
    color: "#ffffff",

    fontSize: 16,

    fontWeight: "600",
  },

  /*
   * Bottom controls
   */
  controls: {
    position: "absolute",

    left: 0,
    right: 0,
    bottom: 0,

    zIndex: 10,

    alignItems: "center",
    justifyContent: "center",

    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,

    /*
     * Approximation of the CSS gradient.
     * The actual button remains visually the same.
     */
    backgroundColor: "rgba(0, 0, 0, 0.25)",
  },

  controlsSmall: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },

  /*
   * Main circular button
   */
  mainButton: {
    width: 76,
    height: 76,

    flexBasis: 76,

    alignItems: "center",
    justifyContent: "center",

    padding: 0,

    borderWidth: 4,
    borderColor: "#ffffff",
    borderRadius: 38,

    backgroundColor: "#3f82f1",

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.4,
    shadowRadius: 12,

    elevation: 8,
  },

  mainButtonSmall: {
    width: 72,
    height: 72,

    flexBasis: 72,

    borderRadius: 36,
  },

  mainButtonPressed: {
    backgroundColor: "#2f70d8",
    transform: [{ scale: 0.98 }],
  },
});