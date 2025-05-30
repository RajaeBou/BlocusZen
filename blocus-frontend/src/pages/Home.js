import React from "react";
import { useNavigate } from "react-router-dom";
import { getToken } from "../helpers/auth"; 
import logo from "../logo/logo.png"; 
import b from "../logo/binome.png";
import p from "../logo/planifie.png";
import s from "../logo/synthese.png";
import f from "../logo/forum.png";

export default function Home() {
  const navigate = useNavigate();

 
  const isAuthenticated = () => {
    const token = getToken(); 
    return token;
  };

 
  const handleLogoClick = () => {
    const token = getToken(); 
    if (token) {
      navigate("/dashboard"); 
    } else {
      navigate("/login"); 
    }
  };

 
  const handleNavigation = (path) => {
    const token = isAuthenticated();
    if (token) {
      navigate(path); 
    } else {
      navigate("/login"); 
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      {/* Logo */}
      
      
      
      
      
      

      {/* Blocs de navigation */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", 
          gap: "20px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <div
          onClick={() => handleNavigation("/mes-sessions")}
          style={{
            border: "1px solid #ccc",
            borderRadius: "10px",
            padding: "20px",
            cursor: "pointer",
            background: "#f9f9f9",
            display: "flex", 
            flexDirection: "column",
            alignItems: "center", 
            justifyContent: "center", 
          }}
        >
          <img src={p} alt="Planifier" style={{ width: "200px", marginBottom: "10px" }} />
          <h3>Planifier ton blocus</h3>
        </div>

        <div
          onClick={() => handleNavigation("/trouver-binome")}
          style={{
            border: "1px solid #ccc",
            borderRadius: "10px",
            padding: "20px",
            cursor: "pointer",
            background: "#f9f9f9",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img src={b} alt="Binôme" style={{ width: "200px", marginBottom: "10px" }} />
          <h3>Trouver ton binôme</h3>
        </div>

        <div
          onClick={() => handleNavigation("/syntheses")}
          style={{
            border: "1px solid #ccc",
            borderRadius: "10px",
            padding: "20px",
            cursor: "pointer",
            background: "#f9f9f9",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img src={s} alt="Synthèses" style={{ width: "200px", marginBottom: "10px" }} />
          <h3>Consulter / ajouter une synthèse</h3>
        </div>

        <div
          onClick={() => handleNavigation("/forum")}
          style={{
            border: "1px solid #ccc",
            borderRadius: "10px",
            padding: "20px",
            cursor: "pointer",
            background: "#f9f9f9",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img src={f} alt="Forum" style={{ width: "200px", marginBottom: "10px" }} />
          <h3>Poser une question</h3>
        </div>
      </div>
    </div>
  );
}
