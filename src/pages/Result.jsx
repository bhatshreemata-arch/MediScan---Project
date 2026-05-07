import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Tesseract from "tesseract.js";
import { motion } from "framer-motion";

export default function Result() {

  const navigate = useNavigate();

  const [image, setImage] = useState("");
  const [medicineName, setMedicineName] = useState("");
  const [hindiName, setHindiName] = useState("");
  const [kannadaName, setKannadaName] = useState("");
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ FIX: prevent duplicate save
  const savedRef = useRef(false);

  // 🧠 Medicine Database
  const medicineDB = {
    paracetamol: {
      name: "Paracetamol",
      category: { en: "Fever & Pain", kn: "ಜ್ವರ ಮತ್ತು ನೋವು" },
      use: { en: "Reduces fever and pain", kn: "ಜ್ವರ ಮತ್ತು ನೋವು ಕಡಿಮೆ ಮಾಡುತ್ತದೆ" },
      warning: { en: "Do not overdose", kn: "ಅತಿಯಾಗಿ ಸೇವಿಸಬೇಡಿ" }
    },
    dolo: {
      name: "Dolo",
      category: { en: "Fever", kn: "ಜ್ವರ" },
      use: { en: "Common fever medicine", kn: "ಸಾಮಾನ್ಯ ಜ್ವರದ ಔಷಧಿ" },
      warning: { en: "Take after food", kn: "ಆಹಾರ ನಂತರ ತೆಗೆದುಕೊಳ್ಳಿ" }
    },
    crocin: {
      name: "Crocin",
      category: { en: "Pain relief", kn: "ನೋವು ನಿವಾರಣೆ" },
      use: { en: "Used for mild pain", kn: "ಸ್ವಲ್ಪ ನೋವಿಗೆ ಬಳಸಲಾಗುತ್ತದೆ" },
      warning: { en: "Consult doctor", kn: "ವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸಿ" }
    },
    ibuprofen: {
      name: "Ibuprofen",
      category: { en: "Pain", kn: "ನೋವು" },
      use: { en: "Reduces inflammation", kn: "ಉರಿಯೂತ ಕಡಿಮೆ ಮಾಡುತ್ತದೆ" },
      warning: { en: "Avoid on empty stomach", kn: "ಖಾಲಿ ಹೊಟ್ಟೆಯಲ್ಲಿ ಸೇವಿಸಬೇಡಿ" }
    },
    cetirizine: {
      name: "Cetirizine",
      category: { en: "Allergy", kn: "ಅಲರ್ಜೀ" },
      use: { en: "Relieves allergy symptoms", kn: "ಅಲರ್ಜೀ ಲಕ್ಷಣಗಳನ್ನು ಕಡಿಮೆ ಮಾಡುತ್ತದೆ" },
      warning: { en: "May cause drowsiness", kn: "ನಿದ್ರೆ ತರಬಹುದು" }
    },
    amoxicillin: {
      name: "Amoxicillin",
      category: { en: "Antibiotic", kn: "ಆಂಟಿಬಯಾಟಿಕ್" },
      use: { en: "Treats bacterial infections", kn: "ಬ್ಯಾಕ್ಟೀರಿಯಾ ಸೋಂಕುಗಳಿಗೆ ಬಳಸಲಾಗುತ್ತದೆ" },
      warning: { en: "Complete full course", kn: "ಪೂರ್ಣ ಕೋರ್ಸ್ ಮುಗಿಸಿ" }
    },
    azithromycin: {
      name: "Azithromycin",
      category: { en: "Antibiotic", kn: "ಆಂಟಿಬಯಾಟಿಕ್" },
      use: { en: "Used for infections", kn: "ಸೋಂಕುಗಳಿಗೆ ಬಳಸಲಾಗುತ್ತದೆ" },
      warning: { en: "Doctor prescription required", kn: "ವೈದ್ಯರ ಸಲಹೆ ಅಗತ್ಯ" }
    },
    metformin: {
      name: "Metformin",
      category: { en: "Diabetes", kn: "ಮಧುಮೇಹ" },
      use: { en: "Controls blood sugar", kn: "ರಕ್ತದ ಸಕ್ಕರೆ ನಿಯಂತ್ರಿಸುತ್ತದೆ" },
      warning: { en: "Take with food", kn: "ಆಹಾರದೊಂದಿಗೆ ಸೇವಿಸಿ" }
    },
    amlodipine: {
      name: "Amlodipine",
      category: { en: "Blood Pressure", kn: "ರಕ್ತದ ಒತ್ತಡ" },
      use: { en: "Controls BP", kn: "ರಕ್ತದ ಒತ್ತಡ ನಿಯಂತ್ರಿಸುತ್ತದೆ" },
      warning: { en: "Take regularly", kn: "ನಿಯಮಿತವಾಗಿ ಸೇವಿಸಿ" }
    }
  };

  // 🔊 Voice
  const speakKannada = (text) => {
    window.speechSynthesis.cancel();
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "kn-IN";
    speech.rate = 0.9;
    window.speechSynthesis.speak(speech);
  };

  useEffect(() => {
    const img = localStorage.getItem("image");
    setImage(img);

    if (img) {
      Tesseract.recognize(img, "eng").then(({ data: { text } }) => {

        const fullText = text.toLowerCase();

        let detected = "Unknown Medicine";
        let detectedInfo = null;

        // 🔍 Detect medicine
        for (let key in medicineDB) {
          const med = medicineDB[key];

          if (fullText.includes(key)) {
            detected = med.name;
            detectedInfo = med;
            break;
          }
        }

        setMedicineName(detected);
        setInfo(detectedInfo);

        // ✅ FIX: Save history ONLY ONCE
        if (!savedRef.current) {
          const oldHistory = JSON.parse(localStorage.getItem("history")) || [];

          const newEntry = {
            name: detected,
            time: new Date().toLocaleString(),
            image: img
          };

          localStorage.setItem("history", JSON.stringify([newEntry, ...oldHistory]));

          savedRef.current = true;
        }

        // 🌐 Translations
        const translations = {
          Paracetamol: { hi: "पैरासिटामोल", kn: "ಪ್ಯಾರಾಸಿಟಮಾಲ್" },
          Dolo: { hi: "डोलो", kn: "ಡೋಲೋ" },
          Crocin: { hi: "क्रोसिन", kn: "ಕ್ರೋಸಿನ್" }
        };

        setHindiName(translations[detected]?.hi || "N/A");
        setKannadaName(translations[detected]?.kn || "N/A");

        speakKannada(`ಇದು ${detected} ಔಷಧಿ`);

        setLoading(false);
      });
    }
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f2027, #2c5364)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      color: "white"
    }}>
      
      <button onClick={() => navigate(-1)} style={{
        position: "absolute",
        top: "20px",
        left: "20px"
      }}>
        ⬅ Back
      </button>

      <motion.div style={{
        padding: "30px",
        borderRadius: "20px",
        background: "rgba(255,255,255,0.1)",
        textAlign: "center",
        width: "320px"
      }}>
        <h2>MediScan Result 💊</h2>

        {image && <img src={image} width="180" />}

        {loading ? (
          <p>Scanning...</p>
        ) : (
          <>
            <h3>{medicineName}</h3>
            <p>Hindi: {hindiName}</p>
            <p>Kannada: {kannadaName}</p>

            {info && (
              <div>
                <p>{info.category.en}</p>
                <p>{info.use.en}</p>
              </div>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
}