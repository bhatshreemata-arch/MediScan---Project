import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function History() {
    const clearHistory = () => {
  localStorage.removeItem("history");
  setHistory([]); // update UI instantly
};

const deleteItem = (indexToDelete) => {
  const oldHistory = JSON.parse(localStorage.getItem("history")) || [];

  const newHistory = oldHistory.filter((_, index) => index !== indexToDelete);

  localStorage.setItem("history", JSON.stringify(newHistory));
  setHistory(newHistory); // update UI instantly
};
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("history")) || [];
    setHistory(data);
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f2027, #2c5364)",
        color: "white",
        padding: "20px"
      }}
    >
      {/* Back */}
      <button onClick={() => navigate(-1)}>⬅ Back</button>

      <h2 style={{ textAlign: "center" }}>Scan History 📜</h2>
      <button
  onClick={clearHistory}
  style={{
    marginTop: "10px",
    padding: "8px 16px",
    borderRadius: "10px",
    border: "none",
    background: "#ff4d4d",
    color: "white",
    cursor: "pointer"
  }}
>
  🗑 Clear All
</button>

      {history.length === 0 && <p>No scans yet</p>}

      {history.map((item, index) => (
  <div
    key={index}
    style={{
      marginTop: "15px",
      padding: "15px",
      borderRadius: "10px",
      background: "rgba(255,255,255,0.1)",
      position: "relative"
    }}
  >
    {/* ❌ Delete button */}
    <button
      onClick={() => deleteItem(index)}
      style={{
        position: "absolute",
        top: "10px",
        right: "10px",
        background: "#ff4d4d",
        border: "none",
        borderRadius: "6px",
        padding: "4px 8px",
        color: "white",
        cursor: "pointer"
      }}
    >
      ❌
    </button>

    <h3>{item.name}</h3>
    <p style={{ fontSize: "12px" }}>{item.time}</p>

    {/* Optional image */}
    {item.image && (
      <img
        src={item.image}
        alt="scan"
        style={{
          width: "120px",
          borderRadius: "8px",
          marginTop: "10px"
        }}
      />
    )}
  </div>
))}
    </div>
  );
}