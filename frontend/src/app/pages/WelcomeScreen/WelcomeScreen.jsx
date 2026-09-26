import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./WelcomeScreen.css";
import visionBridgeLogo from "../../assets/images/visionbridge-logo.png";

const SPLASH_DURATION = 2000;

function WelcomeScreen() {
  const [showSplash, setShowSplash] = useState(true);

  const navigate = useNavigate();

  const welcomeHeadingRef = useRef(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setShowSplash(false);
    }, SPLASH_DURATION);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!showSplash) {
      welcomeHeadingRef.current?.focus();
    }
  }, [showSplash]);

  if (showSplash) {
    return (
      <main
        className="welcome-splash"
        aria-label="VisionBridge loading"
      >
        <div className="welcome-splash__content">
          <img
            src={visionBridgeLogo}
            alt="VisionBridge"
            className="welcome-splash__logo"
          />
        </div>
      </main>
    );
  }

  return (
    <main className="welcome-page">
      <section
        className="welcome-card"
        aria-labelledby="welcome-heading"
      >
        <div className="welcome-card__content">

          <img
            src={visionBridgeLogo}
            alt="VisionBridge"
            className="welcome-card__logo"
          />

          <h1
            id="welcome-heading"
            ref={welcomeHeadingRef}
            className="welcome-card__heading"
            tabIndex="-1"
          >
            Welcome to VisionBridge
          </h1>

          <p className="welcome-card__description">
            Choose how you want to continue.
          </p>

          <div
            className="welcome-card__options"
            aria-label="Account type"
          >

            <button
              type="button"
              className="welcome-role-button"
              onClick={() => navigate("/ScanGlass")}
            >
              <span>Glass User</span>
            </button>

            <button
              type="button"
              className="welcome-role-button"
              onClick={() => {
                console.log("Family Member selected");
              }}
            >
              <span>Family Member</span>
            </button>

            <button
              type="button"
              className="welcome-role-button"
              onClick={() => {
                console.log("Agent selected");
              }}
            >
              <span>Agent</span>
            </button>

          </div>

        </div>
      </section>
    </main>
  );
}

export default WelcomeScreen;