import { useRef, useState } from "react";
import { motion } from "framer-motion";
import Tesseract from "tesseract.js";
const medicineDB = [
  {
    name: "paracetamol",
    hindi: "पैरासिटामोल",
    kannada: "ಪ್ಯಾರಾಸಿಟಮಾಲ್",
    category: "Pain / Fever",
    use: "Used to reduce fever and relieve pain"
  },
  {
    name: "crocin",
    hindi: "क्रोसिन",
    kannada: "ಕ್ರೋಸಿನ್",
    category: "Pain / Fever",
    use: "Used for fever and mild pain"
  },
  {
    name: "dolo",
    hindi: "डोलो",
    kannada: "ಡೋಲೋ",
    category: "Pain / Fever",
    use: "Used for fever and body pain"
  },

  // 💉 BP medicines
  {
    name: "amlodipine",
    hindi: "एम्लोडिपिन",
    kannada: "ಅಮ್ಲೋಡಿಪಿನ್",
    category: "Blood Pressure",
    use: "Used to control high blood pressure"
  },

  // 🍬 Diabetes medicines
  {
    name: "metformin",
    hindi: "मेटफॉर्मिन",
    kannada: "ಮೆಟ್ಫಾರ್ಮಿನ್",
    category: "Diabetes",
    use: "Used to control blood sugar levels"
  },

  // 🤧 Allergy medicines
  {
    name: "cetirizine",
    hindi: "सेटिरिज़िन",
    kannada: "ಸೆಟಿರಿಜಿನ್",
    category: "Allergy",
    use: "Used to treat allergy symptoms like sneezing"
  },

  // 🤕 Pain medicines
  {
    name: "ibuprofen",
    hindi: "इबुप्रोफेन",
    kannada: "ಐಬುಪ್ರೊಫೆನ್",
    category: "Pain",
    use: "Used to relieve pain and inflammation"
  }
];

export default function Hero() {

  const fileInputRef = useRef(null);

  const [image, setImage] = useState(null);
  const [medicineName, setMedicineName] = useState("");
  const [hindiName, setHindiName] = useState("");
  const [kannadaName, setKannadaName] = useState("");

  // 🔊 Kannada Voice
  const speakKannada = (text) => {
    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "kn-IN";
    speech.rate = 0.9;

    window.speechSynthesis.speak(speech);
  };

  // Open file picker
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const imageURL = URL.createObjectURL(file);
      setImage(imageURL);

      setMedicineName("Detecting...");

      Tesseract.recognize(imageURL, "eng", {
        logger: (m) => console.log(m)
      }).then(({ data: { text } }) => {

        console.log("Detected text:", text);

        const lines = text
          .split("\n")
          .map(l => l.trim())
          .filter(Boolean);

        // ❌ Ignore unwanted words
        const ignoreWords = [
          "copyright", "corp", "ltd", "pvt", "manufactured",
          "ip", "mg", "tablet", "tablets"
        ];

        // ✅ Step 1: find correct line
        let detectedLine = lines.find(line => {
          const lower = line.toLowerCase();

          return (
            (lower.includes("tablet") || lower.includes("mg")) &&
            !ignoreWords.some(word => lower.includes(word))
          );
        });

        // fallback
        if (!detectedLine) {
          detectedLine = lines[0] || "Unknown Medicine";
        }

        // ✅ Step 2: extract clean word
        const words = detectedLine.split(" ");

        let detected = words.find(word => {
          const w = word.toLowerCase();

          return (
            w.length > 4 &&     // skip BE, IP
            isNaN(w) &&         // skip numbers
            !ignoreWords.includes(w)
          );
        }) || "Unknown Medicine";

        setMedicineName(detected);

        const lowerDetected = detected.toLowerCase();

// find match
const match = medicineDB.find(med =>
  lowerDetected.includes(med.name)
);

if (match) {
  setMedicineName(match.name);
  setHindiName(match.hindi);
  setKannadaName(match.kannada);

  speakKannada(`ಇದು ${match.kannada} ಔಷಧಿ. ${match.use}`);
} else {
  setMedicineName(detected);
  setHindiName("Unknown");
  setKannadaName("ಅಪರಿಚಿತ ಔಷಧಿ");

  speakKannada("ಔಷಧಿ ಗುರುತಿಸಲಾಗಲಿಲ್ಲ");
}

        // 🔊 Speak Kannada
        speakKannada(`ಇದು ${detected} ಔಷಧಿ. ದಯವಿಟ್ಟು ವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸಿ`);
      });
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        background: "linear-gradient(135deg, #0f2027, #2c5364)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
      }}
    >

      {/* TITLE */}
      <h1 style={{ fontSize: "3rem", marginBottom: "10px" }}>
        MediScan 💊
      </h1>

      <p style={{ opacity: 0.7, marginBottom: "20px" }}>
        Scan. Listen. Understand.
      </p>

      {/* FLOATING CAPSULE */}
      <motion.div
        animate={{ y: [0, -20, 0], rotate: [0, 5, -5, 0] }}
        transition={{ repeat: Infinity, duration: 3 }}
        style={{
          width: "160px",
          height: "80px",
          borderRadius: "50px",
          background: "linear-gradient(90deg, #00ffcc 50%, #ff6b6b 50%)",
          marginTop: "20px",
          boxShadow: "0 0 50px rgba(0,255,200,0.7)",
        }}
      />

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
          marginTop: "40px",
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

      {/* English */}
      {medicineName && (
        <h3 style={{ marginTop: "15px", color: "#00c9a7" }}>
          Detected: {medicineName}
        </h3>
      )}

      {/* Voice Button */}
      {medicineName && (
        <button
          onClick={() =>
            speakKannada(`ಇದು ${medicineName} ಔಷಧಿ. ದಯವಿಟ್ಟು ವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸಿ`)
          }
          style={{
            marginTop: "10px",
            padding: "10px 20px",
            borderRadius: "10px",
            border: "none",
            background: "#ffcc00",
            color: "black",
            cursor: "pointer"
          }}
        >
          🔊 Play Voice
        </button>
      )}

      {/* Hindi */}
      {hindiName && (
        <p style={{ color: "#ffcc00" }}>
          Hindi: {hindiName}
        </p>
      )}

      {/* Kannada */}
      {kannadaName && (
        <p style={{ color: "#00ffcc" }}>
          Kannada: {kannadaName}
        </p>
      )}
      {medicineName && (
  <p style={{ color: "#ccc" }}>
    Category: {medicineDB.find(m => m.name === medicineName)?.category}
  </p>
)}

{medicineName && (
  <p style={{ color: "#aaa" }}>
    Use: {medicineDB.find(m => m.name === medicineName)?.use}
  </p>
)}

    </div>
  );
}