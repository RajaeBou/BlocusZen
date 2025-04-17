import React from "react";
import { useNavigate } from "react-router-dom";
import { getToken } from "../helpers/auth"; // Fonction pour récupérer le token d'authentification
import logo from "../logo/logo.png"; // Logo de ton application
import b from "../logo/binome.png";
import p from "../logo/planifie.png";
import s from "../logo/synthese.png";
import f from "../logo/forum.png";

export default function Home() {
  const navigate = useNavigate();

  // Fonction pour vérifier si l'utilisateur est connecté
  const isAuthenticated = () => {
    const token = getToken(); // Si un token existe, l'utilisateur est connecté
    return token;
  };

  // Fonction de gestion du clic sur le logo
  const handleLogoClick = () => {
    const token = getToken(); // Vérifie si l'utilisateur est connecté
    if (token) {
      navigate("/dashboard"); // Redirige vers le dashboard si l'utilisateur est connecté
    } else {
      navigate("/login"); // Redirige vers la page de connexion si non connecté
    }
  };

  // Fonction de gestion de la navigation avec vérification de l'authentification
  const handleNavigation = (path) => {
    const token = isAuthenticated();
    if (token) {
      navigate(path); // Si connecté, on navigue vers la page
    } else {
      navigate("/login"); // Si non connecté, redirige vers la page de connexion
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      {/* Logo */}
      
      
      
      
      
      

      {/* Blocs de navigation */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", // Ajout de cette ligne pour que les blocs s'ajustent à la taille de l'écran
          gap: "20px",
          maxWidth: "1200px", // Définit une largeur maximale
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
            display: "flex", // Ajout de Flexbox pour centrer le contenu
            flexDirection: "column",
            alignItems: "center", // Centrage horizontal des éléments
            justifyContent: "center", // Centrage vertical des éléments
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
