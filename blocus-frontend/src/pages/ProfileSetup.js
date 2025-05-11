// frontend/src/pages/ProfileSetup.js
import React, { useState, useEffect } from "react";
import { getToken, getCurrentUserId } from "../helpers/auth";
import { useNavigate } from "react-router-dom";

export default function ProfileSetup() {
  const [name, setName] = useState("");
  const [university, setUniversity] = useState("");
  const [field, setField] = useState("");
  const [level, setLevel] = useState("");
  const [bio, setBio] = useState("");
  const [universities, setUniversities] = useState([]);
  const [fields, setFields] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = await getToken();

      const uniRes = await fetch("http://localhost:5000/references/universities");
      const fieldRes = await fetch("http://localhost:5000/references/fields");

      setUniversities(await uniRes.json());
      setFields(await fieldRes.json());
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const uid = await getCurrentUserId();
    const token = await getToken();

    const res = await fetch(`http://localhost:5000/api/profile/${uid}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, university, field, level, bio }),
    });

    if (res.ok) {
      alert("✅ Profil complété !");
      navigate("/profile");
    } else {
      alert("❌ Erreur lors de la sauvegarde");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">👤 Compléter votre profil</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
        <input type="text" placeholder="Nom" value={name} onChange={(e) => setName(e.target.value)} required />
        <select value={university} onChange={(e) => setUniversity(e.target.value)} required>
          <option value="">Université</option>
          {universities.map((u) => (
            <option key={u._id} value={u.name}>{u.name}</option>
          ))}
        </select>
        <select value={field} onChange={(e) => setField(e.target.value)} required>
          <option value="">Filière</option>
          {fields.map((f) => (
            <option key={f._id} value={f.name}>{f.name}</option>
          ))}
        </select>
        <input type="text" placeholder="Niveau" value={level} onChange={(e) => setLevel(e.target.value)} required />
        <textarea placeholder="Bio (facultatif)" value={bio} onChange={(e) => setBio(e.target.value)} />
        <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded">Enregistrer</button>
      </form>
    </div>
  );
}
