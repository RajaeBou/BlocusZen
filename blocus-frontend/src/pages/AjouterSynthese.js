import React, { useState } from "react";
import { getToken } from "../helpers/auth";

export default function AjouterSynthese() {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [level, setLevel] = useState("");
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("subject", subject);
    formData.append("level", level);
    formData.append("file", file);

    try {
      const token = await getToken();
      const res = await fetch("http://localhost:5000/api/synthese/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) throw new Error("Erreur d'envoi de synthèse");

      alert("✅ Synthèse envoyée avec succès !");
      window.location.href = "/syntheses";
    } catch (err) {
      alert("❌ Erreur : " + err.message);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "30px" }}>
      <h2>➕ Ajouter une synthèse</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input
          type="text"
          placeholder="Titre"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ width: "100%", marginBottom: "10px" }}
        />

        <input
          type="text"
          placeholder="Matière"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
          style={{ width: "100%", marginBottom: "10px" }}
        />

        <input
          type="text"
          placeholder="Niveau (ex: Bac 1)"
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          required
          style={{ width: "100%", marginBottom: "10px" }}
        />

        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => setFile(e.target.files[0])}
          required
          style={{ marginBottom: "20px" }}
        />

        <button type="submit">📤 Publier la synthèse</button>
      </form>
    </div>
  );
}
