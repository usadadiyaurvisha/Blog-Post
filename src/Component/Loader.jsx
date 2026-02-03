import React from "react";
import Lottie from "react-lottie-player";
import loaderAnimation from "../assets/Hand Loding.json";

const Loader = () => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(255,255,255,0.8)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <Lottie
        loop
        animationData={loaderAnimation}
        play
        style={{ width: 200, height: 200 }}
      />
      <p style={{ marginTop: 20, fontSize: 18, color: "#555" }}>Loading...</p>
    </div>
  );
};

export default Loader;
