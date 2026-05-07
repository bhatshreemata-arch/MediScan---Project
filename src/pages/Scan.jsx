import { useNavigate } from "react-router-dom";
import { useRef } from "react";

export default function Scan() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // 🎥 Start camera
  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true
    });

    videoRef.current.srcObject = stream;
  };

  // 📸 Capture image
  const captureImage = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    const imageURL = canvas.toDataURL("image/png");

    localStorage.setItem("image", imageURL);

    navigate("/result");
  };

  return (
    <div
      style={{
        height: "100vh",
        background: "linear-gradient(135deg, #0f2027, #2c5364)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
      }}
    >
      <h2>Camera Scan</h2>

      {/* 🎥 Video */}
      <video
        ref={videoRef}
        autoPlay
        style={{
          width: "300px",
          borderRadius: "10px",
          marginTop: "20px"
        }}
      />

      {/* Hidden canvas */}
      <canvas ref={canvasRef} style={{ display: "none" }} />

      {/* Buttons */}
      <button
        onClick={startCamera}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          borderRadius: "10px",
          border: "none",
          background: "#00c9a7",
          cursor: "pointer"
        }}
      >
        Start Camera
      </button>

      <button
        onClick={captureImage}
        style={{
          marginTop: "10px",
          padding: "10px 20px",
          borderRadius: "10px",
          border: "none",
          background: "#ffcc00",
          cursor: "pointer"
        }}
      >
        Capture & Scan
      </button>
    </div>
  );
}