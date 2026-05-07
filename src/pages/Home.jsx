import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        height: "100vh",
        background: "linear-gradient(135deg, #0f2027, #2c5364)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
      }}
    >
      {/* 🔥 Glass Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          padding: "40px",
          borderRadius: "20px",
          background: "rgba(255,255,255,0.1)",
          backdropFilter: "blur(15px)",
          boxShadow: "0 0 40px rgba(0,255,200,0.2)",
          textAlign: "center",
          width: "320px"
        }}
      >
        <h1 style={{ fontSize: "2.5rem" }}>
          MediScan 💊
        </h1>

        <p style={{ opacity: 0.7 }}>
          Scan. Listen. Understand.
        </p>

        {/* Capsule */}
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
          style={{
            width: "140px",
            height: "70px",
            borderRadius: "50px",
            background: "linear-gradient(90deg, #00ffcc 50%, #ff6b6b 50%)",
            margin: "30px auto",
            boxShadow: "0 0 30px rgba(0,255,200,0.6)"
          }}
        />

        {/* Button */}
        <button
          onClick={() => navigate("/scan")}
          style={{
            padding: "12px 20px",
            borderRadius: "20px",
            border: "none",
            background: "linear-gradient(90deg, #00c9a7, #00ffcc)",
            color: "black",
            fontWeight: "bold",
            cursor: "pointer",
            width: "100%"
          }}
        >
          🚀 Start Scanning
        </button>
        <button
  onClick={() => navigate("/history")}
  style={{
    marginTop: "10px",
    padding: "10px",
    borderRadius: "20px",
    border: "none",
    background: "#ffcc00",
    color: "black",
    cursor: "pointer",
    width: "100%"
  }}
>
  📜 View History
</button>
      </motion.div>
    </div>
  );
}