// 📁 src/pages/ProfileForm.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUserId, getToken } from "../helpers/auth";
import defaultAvatar from "../logo/default-avatar.png";

export default function ProfileForm() {
  const [name, setName] = useState("");
  const [university, setUniversity] = useState("");
  const [field, setField] = useState("");
  const [level, setLevel] = useState("");
  const [bio, setBio] = useState("");
  const [universities, setUniversities] = useState([]);
  const [fields, setFields] = useState([]);
  const [photoURL, setPhotoURL] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchReferences = async () => {
      try {
        const uniRes = await fetch("http://localhost:5000/references/universities");
        const fieldRes = await fetch("http://localhost:5000/references/fields");

        const uniData = await uniRes.json();
        const fieldData = await fieldRes.json();

        setUniversities(uniData);
        setFields(fieldData);
      } catch (err) {
        console.error("Erreur chargement universités/filières", err);
      }
    };

    const fetchProfile = async () => {
      const uid = await getCurrentUserId();
      const token = await getToken();
      const res = await fetch(`api/profile/${uid}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(token);

      if (res.ok) {
        const data = await res.json();
        if (data) {
          setName(data.name || "");
          setUniversity(data.university || "");
          setField(data.field || "");
          setLevel(data.level || "");
          setBio(data.bio || "");
          setPhotoURL(data.photoURL || "");
        } else {
          // profil inexistant → on récupère la photo Google éventuellement
          const fromGoogle = localStorage.getItem("photoURL");
          setPhotoURL(fromGoogle || "");
        }
      }
    };

    fetchReferences();
    fetchProfile();
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
      alert("✅ Profil mis à jour !");
      navigate("/profile");
    } else {
      alert("❌ Erreur mise à jour profil");
    }
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uid = await getCurrentUserId();
    const token = await getToken();

    const formData = new FormData();
    formData.append("photo", file);

    const res = await fetch(`http://localhost:5000/api/profile/${uid}/photo`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (res.ok) {
      const data = await res.json();
      setPhotoURL(data.photoURL);
    } else {
      alert("❌ Erreur lors du chargement de la photo");
    }
  };

  const displayedPhoto =
    photoURL.startsWith("http") ? photoURL : photoURL ? `/api${photoURL}` : defaultAvatar;

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h2 style={{ fontSize: "24px", marginBottom: "20px", color: "#6a0dad" }}>
        👤 Modifier votre profil
      </h2>

      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <img
          src={displayedPhoto}
          alt="Photo de profil"
          style={{ width: "100px", height: "100px", borderRadius: "50%", objectFit: "cover" }}
        />
        <div>
          📸 <input type="file" accept="image/*" onChange={handlePhotoChange} />
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nom"
          className="input"
        />

        <select
          value={university}
          onChange={(e) => setUniversity(e.target.value)}
          className="input mt-2"
        >
          <option value="">Université</option>
          {universities.map((u) => (
            <option key={u._id} value={u.name}>{u.name}</option>
          ))}
        </select>

        <select
          value={field}
          onChange={(e) => setField(e.target.value)}
          className="input mt-2"
        >
          <option value="">Filière</option>
          {fields.map((f) => (
            <option key={f._id} value={f.name}>{f.name}</option>
          ))}
        </select>

        <select value={level} onChange={(e) => setLevel(e.target.value)}>
  <option value="">-- Sélectionner un niveau --</option>
  <option value="Bachelier">Bachelier</option>
  <option value="Master">Master</option>
  <option value="Doctorat">Doctorat</option>
</select>


        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Bio (facultatif)"
          className="input mt-2"
        />

        <button
          type="submit"
          className="mt-4 px-6 py-2 bg-purple-400 text-white rounded hover:bg-purple-500"
        >
          Enregistrer
        </button>
      </form>
    </div>
  );
}
