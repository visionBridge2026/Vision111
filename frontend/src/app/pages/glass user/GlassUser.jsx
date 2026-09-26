import React, { useEffect, useRef, useState } from "react";
import "./UserDashboard.css";

function GlassUser() {
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const [cameraError, setCameraError] = useState("");
  const [isCameraReady, setIsCameraReady] = usegitState(false);

  /* -------------------------------------------------------
     Start camera
  ------------------------------------------------------- */

  const startCamera = async () => {
    setCameraError("");
    setIsCameraReady(false);

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error(
          "Camera access is not supported by this browser."
        );
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: {
            ideal: "environment",
          },
          width: {
            ideal: 1920,
          },
          height: {
            ideal: 1080,
          },
        },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;

        await videoRef.current.play();

        setIsCameraReady(true);
      }
    } catch (error) {
      console.error("Camera error:", error);

      setCameraError(
        "Camera access is unavailable. Please allow camera permission and try again."
      );
    }
  };


  /* -------------------------------------------------------
     Stop camera
  ------------------------------------------------------- */

  const stopCamera = () => {
    if (!streamRef.current) {
      return;
    }

    streamRef.current.getTracks().forEach((track) => {
      track.stop();
    });

    streamRef.current = null;
  };


  /* -------------------------------------------------------
     Start camera when page opens
  ------------------------------------------------------- */

  useEffect(() => {
    startCamera();

    return () => {
      stopCamera();
    };
  }, []);


  /* -------------------------------------------------------
     Camera retry
  ------------------------------------------------------- */

  const handleRetryCamera = () => {
    stopCamera();
    startCamera();
  };


  /* -------------------------------------------------------
     Main dashboard
  ------------------------------------------------------- */

  return (
    <main className="user-dashboard">

      {/* Camera */}

      <div className="user-dashboard__camera">

        <video
          ref={videoRef}
          className="user-dashboard__video"
          autoPlay
          muted
          playsInline
          aria-label="VisionBridge camera view"
        />

        {/* Camera loading */}

        {!isCameraReady && !cameraError && (
          <div
            className="user-dashboard__status"
            role="status"
            aria-live="polite"
          >
            Starting camera...
          </div>
        )}


        {/* Camera error */}

        {cameraError && (
          <div
            className="user-dashboard__camera-error"
            role="alert"
          >
            <div className="user-dashboard__camera-error-content">

              <span
                className="user-dashboard__error-icon"
                aria-hidden="true"
              >
                !
              </span>

              <h1>
                Camera unavailable
              </h1>

              <p>
                {cameraError}
              </p>

              <button
                type="button"
                className="user-dashboard__retry-button"
                onClick={handleRetryCamera}
              >
                Try Again
              </button>

            </div>
          </div>
        )}

      </div>


      {/* Bottom action */}

      <div className="user-dashboard__controls">

        <button
          type="button"
          className="user-dashboard__main-button"
          aria-label="VisionBridge action"
          onClick={() => {
            /*
             * This button will be implemented later.
             */
          }}
        >
          <span
            aria-hidden="true"
          />
        </button>

      </div>

    </main>
  );
}

export default GlassUser;