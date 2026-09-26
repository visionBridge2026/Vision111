import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useNavigate } from "react-router-dom";

import "./ScanGlass.css";

import visionBridgeLogo from "../../assets/images/visionbridge-logo.png";

const QR_READER_ID = "visionbridge-qr-reader";

function ScanGlass() {
  const navigate = useNavigate();

  const [showQrModal, setShowQrModal] = useState(false);
  const [isStartingScanner, setIsStartingScanner] = useState(false);
  const [scannerError, setScannerError] = useState("");
  const [scanResult, setScanResult] = useState("");

  const scannerRef = useRef(null);

  /* -------------------------------------------------------
     Stop scanner
  ------------------------------------------------------- */

  const stopScanner = async () => {
    const scanner = scannerRef.current;

    if (!scanner) {
      return;
    }

    try {
      const state = scanner.getState();

      // 2 = SCANNING
      if (state === 2) {
        await scanner.stop();
      }
    } catch (error) {
      console.warn("Could not stop QR scanner:", error);
    }

    try {
      scanner.clear();
    } catch (error) {
      console.warn("Could not clear QR scanner:", error);
    }

    scannerRef.current = null;
  };


  /* -------------------------------------------------------
     Start scanner
  ------------------------------------------------------- */

  const startScanner = async () => {
    setScannerError("");
    setScanResult("");
    setIsStartingScanner(true);

    try {
      const scanner = new Html5Qrcode(QR_READER_ID);

      scannerRef.current = scanner;

      await scanner.start(
        {
          facingMode: "environment",
        },
        {
          fps: 10,

          qrbox: {
            width: 250,
            height: 250,
          },

          aspectRatio: 1,
        },

        async (decodedText) => {
          console.log("QR Code:", decodedText);

          setScanResult(decodedText);

          try {
            await scanner.stop();
          } catch (error) {
            console.warn(
              "Could not stop scanner after successful scan:",
              error
            );
          }

          /*
           * IMPORTANT:
           * Later we will send decodedText to Django.
           *
           * Example:
           *
           * POST /api/users/verify-qr/
           *
           * For now we only detect the QR code.
           */
        },

        () => {
          // Normal scanning:
          // QR code has not been detected yet.
        }
      );
    } catch (error) {
      console.error("QR scanner error:", error);

      setScannerError(
        "Camera access could not be started. Please allow camera permission and try again."
      );

      scannerRef.current = null;
    } finally {
      setIsStartingScanner(false);
    }
  };


  /* -------------------------------------------------------
     Open modal
  ------------------------------------------------------- */

  const openQrModal = () => {
    setShowQrModal(true);
    setScannerError("");
    setScanResult("");
  };


  /* -------------------------------------------------------
     Close modal
  ------------------------------------------------------- */

  const closeQrModal = async () => {
    await stopScanner();

    setShowQrModal(false);
    setScannerError("");
    setScanResult("");
  };


  /* -------------------------------------------------------
     Start camera after modal appears
  ------------------------------------------------------- */

  useEffect(() => {
    if (!showQrModal) {
      return;
    }

    const timer = window.setTimeout(() => {
      startScanner();
    }, 150);

    return () => {
      window.clearTimeout(timer);
    };
  }, [showQrModal]);


  /* -------------------------------------------------------
     Escape key
  ------------------------------------------------------- */

  useEffect(() => {
    if (!showQrModal) {
      return;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeQrModal();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showQrModal]);


  /* -------------------------------------------------------
     Cleanup
  ------------------------------------------------------- */

  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);


  /* -------------------------------------------------------
     Page
  ------------------------------------------------------- */

  return (
    <main className="user-login-page">

      <section
        className="user-login-card"
        aria-labelledby="user-login-title"
      >

        {/* Back button */}

        <button
          type="button"
          className="user-login-back"
          onClick={() => navigate("/")}
          aria-label="Go back to welcome screen"
        >
          <span aria-hidden="true">←</span>
          <span>Back</span>
        </button>


        {/* Logo */}

        <img
          src={visionBridgeLogo}
          alt="VisionBridge"
          className="user-login-logo"
        />


        {/* Heading */}

        <h1
          id="user-login-title"
          className="user-login-title"
        >
          Glass User Login
        </h1>

        <p className="user-login-description">
          Connect your VisionBridge glasses by scanning the
          QR code provided with your device.
        </p>


        {/* Scan button */}

        <button
          type="button"
          className="user-login-scan-button"
          onClick={openQrModal}
        >
          <span
            className="user-login-scan-icon"
            aria-hidden="true"
          >
            ▣
          </span>

          <span>Scan QR Code</span>
        </button>


        <p className="user-login-help">
          Your phone camera will be used to scan the QR code.
        </p>

      </section>


      {/* ===================================================
          QR SCANNER MODAL
      =================================================== */}

      {showQrModal && (
        <div
          className="qr-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeQrModal();
            }
          }}
        >

          <section
            className="qr-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="qr-modal-title"
            aria-describedby="qr-modal-description"
          >

            {/* Header */}

            <div className="qr-modal-header">

              <div>
                <h2 id="qr-modal-title">
                  Scan QR Code
                </h2>

                <p id="qr-modal-description">
                  Point your phone camera at the VisionBridge
                  QR code.
                </p>
              </div>


              <button
                type="button"
                className="qr-modal-close"
                onClick={closeQrModal}
                aria-label="Close QR scanner"
              >
                <span aria-hidden="true">
                  ×
                </span>
              </button>

            </div>


            {/* Camera */}

            <div className="qr-scanner-container">

              <div
                id={QR_READER_ID}
                className="qr-reader"
                aria-label="QR code camera scanner"
              />

              {isStartingScanner && (
                <div
                  className="qr-scanner-status"
                  role="status"
                  aria-live="polite"
                >
                  Starting camera...
                </div>
              )}

            </div>


            {/* Error */}

            {scannerError && (
              <div
                className="qr-error"
                role="alert"
              >
                <strong>
                  Camera unavailable
                </strong>

                <p>
                  {scannerError}
                </p>

                <button
                  type="button"
                  className="qr-retry-button"
                  onClick={startScanner}
                >
                  Try Again
                </button>
              </div>
            )}


            {/* Success */}

            {scanResult && (
              <div
                className="qr-success"
                role="status"
                aria-live="polite"
              >
                <span
                  className="qr-success-icon"
                  aria-hidden="true"
                >
                  ✓
                </span>

                <div>
                  <strong>
                    QR code scanned successfully
                  </strong>

                  <p>
                    Your VisionBridge device has been detected.
                  </p>
                </div>
              </div>
            )}


            {!scanResult && !scannerError && (
              <p className="qr-modal-hint">
                Position the QR code inside the scanning area.
              </p>
            )}

          </section>

        </div>
      )}

    </main>
  );
}

export default ScanGlass;