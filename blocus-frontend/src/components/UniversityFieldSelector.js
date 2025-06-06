import React, { useEffect, useState } from "react";

export default function UniversityFieldSelector() {
  const [universities, setUniversities] = useState([]);
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const uniRes = await fetch("http://localhost:5000/api/references/universities");
        const fieldRes = await fetch("http://localhost:5000/api/references/fields");

        if (!uniRes.ok || !fieldRes.ok) throw new Error("Erreur API");

        const universities = await uniRes.json();
        const fields = await fieldRes.json();

        setUniversities(universities);
        setFields(fields);
      } catch (err) {
        console.error("❌ Erreur API :", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Chargement...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Choix de l’université et de la filière</h2>

      <label>Université :</label><br />
      <select>
        <option value="">-- Sélectionner une université --</option>
        {universities.map((u) => (
          <option key={u._id} value={u._id}>{u.name}</option>
        ))}
      </select>

      <br /><br />

      <label>Filière :</label><br />
      <select>
        <option value="">-- Sélectionner une filière --</option>
        {fields.map((f) => (
          <option key={f._id} value={f._id}>
            {f.name} ({f.sector})
          </option>
        ))}
      </select>
    </div>
  );
}
