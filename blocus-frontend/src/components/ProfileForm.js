import React, { useState, useEffect } from "react";

export default function ProfileForm({ user }) {
  const [universities, setUniversities] = useState([]);
  const [fields, setFields] = useState([]);
  const [level, setLevel] = useState("");
  const [university, setUniversity] = useState("");
  const [field, setField] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const uniRes = await fetch("http://localhost:5000/api/universities");
        const fieldRes = await fetch("http://localhost:5000/api/fields");

        const universities = await uniRes.json();
        const fields = await fieldRes.json();

        setUniversities(universities);
        setFields(fields);
        setLoading(false);
      } catch (err) {
        console.error("❌ Erreur API :", err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Envoie les données au backend pour les enregistrer dans la base MongoDB
    const profileData = { university, field, level };
    try {
      const response = await fetch(`http://localhost:5000/api/userprofile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      });
      const result = await response.json();
      console.log(result);
    } catch (err) {
      console.error("Erreur lors de l'enregistrement du profil :", err);
    }
  };

  if (loading) return <p>Chargement...</p>;

  return (
    <div>
      <h2>Compléter votre profil</h2>
      <form onSubmit={handleSubmit}>
        <label>Université :</label><br />
        <select value={university} onChange={(e) => setUniversity(e.target.value)}>
          <option value="">-- Sélectionner une université --</option>
          {universities.map((u) => (
            <option key={u._id} value={u._id}>{u.name}</option>
          ))}
        </select>
        <br /><br />

        <label>Filière :</label><br />
        <select value={field} onChange={(e) => setField(e.target.value)}>
          <option value="">-- Sélectionner une filière --</option>
          {fields.map((f) => (
            <option key={f._id} value={f._id}>
              {f.name} ({f.sector})
            </option>
          ))}
        </select>
        <br /><br />

        <label>Niveau d'études :</label><br />
        <select value={level} onChange={(e) => setLevel(e.target.value)}>
          <option value="">-- Sélectionner un niveau --</option>
          <option value="Bachelier">Bachelier</option>
          <option value="Master">Master</option>
          <option value="Doctorat">Doctorat</option>
        </select>
        <br /><br />

        <button type="submit">Enregistrer</button>
      </form>
    </div>
  );
}
