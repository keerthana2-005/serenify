import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/serenify-logo.png"; 

function LandingPage() {
  const navigate=useNavigate();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        // Use minHeight to ensure it fills the screen but can also grow if needed
        minHeight: "100vh", 
        fontFamily: "'Poppins', sans-serif",
      }}
      className="landing-container"
    >
      {/* Left side - Logo */}
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#dfececff",
        }}
        className="logo-section"
      >
        <img
          src={logo}
          alt="Serenify Logo"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover", // This correctly tells the image to fill the container
          }}
        />
      </div>

      {/* Right side - Text + Button (No changes here) */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "60px",
          paddingLeft: "100px",
          background: "linear-gradient(to bottom right, #fdf5e6, #979693ff)",
          color: "#333",
          textAlign: "left",
        }}
        className="text-section"
      >
        <h1 style={{ fontSize: "3rem", fontWeight: 700, marginBottom: "20px" }}>
          Welcome to Serenify
        </h1>
        <p
          style={{
            fontSize: "1.25rem",
            lineHeight: "1.8",
            maxWidth: "500px",
            marginBottom: "30px",
            fontWeight: 400,
          }}
        >
          Your personal sanctuary for reflection and peace. A quiet corner in a busy world, just for your thoughts.
        </p>
        <button
          style={{
            backgroundColor: "#8B4513",
            color: "white",
            border: "none",
            padding: "14px 28px",
            fontSize: "1rem",
            fontWeight: 600,
            borderRadius: "8px",
            cursor: "pointer",
            width: "fit-content",
            transition: "transform 0.2s, background-color 0.2s",
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = "#a052d";
            e.target.style.transform = "scale(1.05)";
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = "#6c3c1aff";
            e.target.style.transform = "scale(1)";
          }}
          onClick={() => navigate("/login")}
        >
          Get Started
        </button>
      </div>

      {/* Responsive styling (No changes here) */}
      <style>
        {`
          @media (max-width: 1024px) {
            .landing-container {
              flex-direction: column !important;
            }
            .logo-section {
              height: 50vh !important;
              min-height: 300px !important;
            }
            .text-section {
              align-items: center !important;
              text-align: center !important;
              padding: 40px !important;
              min-height: 50vh !important;
            }
            .text-section > p {
              max-width: 600px !important;
            }
            .landing-container img {
              width: 100% !important;
              height: 100% !important;
            }
            .landing-container h1 {
              font-size: 2.5rem !important;
            }
            .landing-container p {
              font-size: 1.1rem !important;
            }
          }
          @media (max-width: 480px) {
            .landing-container h1 {
              font-size: 2rem !important;
            }
            .landing-container p {
              font-size: 1rem !important;
            }
            .landing-container button {
              padding: 12px 24px !important;
              font-size: 0.9rem !important;
            }
            .logo-section {
              height: 40vh !important;
            }
            .text-section {
              min-height: 60vh !important;
            }
          }
        `}
      </style>
    </div>
  );
}

export default LandingPage;