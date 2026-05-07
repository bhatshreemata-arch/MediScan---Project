import { useRef, useState } from "react";

export default function Hero3D() {

  const fileInputRef = useRef(null);
  const [image, setImage] = useState(null);
  const [medicineName, setMedicineName] = useState("");

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));

      // 👉 Fake AI detection
      setMedicineName("Paracetamol Tablet 💊");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "30px" }}>

      {/* Hidden input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageChange}
        style={{ display: "none" }}
      />

      {/* Button */}
      <button
        onClick={handleButtonClick}
        style={{
          padding: "12px 25px",
          fontSize: "16px",
          borderRadius: "20px",
          border: "none",
          background: "#00c9a7",
          color: "white",
          cursor: "pointer"
        }}
      >
        Scan Medicine
      </button>

      {/* Image Preview */}
      {image && (
        <div style={{ marginTop: "20px" }}>
          <img
            src={image}
            alt="preview"
            style={{ width: "200px", borderRadius: "10px" }}
          />
        </div>
      )}
      {medicineName && (
  <h3 style={{ marginTop: "15px", color: "#00c9a7" }}>
    Detected: {medicineName}
  </h3>
)}

      {/* 👉 THIS WAS MISSING BEFORE */}
      {medicineName && (
        <h3 style={{ marginTop: "15px", color: "#00c9a7" }}>
          Detected: {medicineName}
        </h3>
      )}

    </div>
  );
}