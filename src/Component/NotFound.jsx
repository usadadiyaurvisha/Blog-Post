import { Navbar } from "./Navbar";
import Lottie from "react-lottie-player";
import Error from "../assets/404 Error - Doodle animation.json"
export default function NotFound() {
  return (
    <>
      <Navbar />

      <div
        style={{
          textAlign: "center",
          padding: "40px",
          minHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        
        <Lottie
          loop
          animationData={Error}
          play
          style={{ width: 250, height: 250 }}
          
        />
      </div>
    </>
  );
}