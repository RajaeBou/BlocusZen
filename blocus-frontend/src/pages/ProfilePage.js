// 📁 src/pages/ProfilePage.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCurrentUserId, getToken } from "../helpers/auth";
import defaultAvatar from "../logo/default-avatar.png";

export default function ProfilePage() {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const uid = await getCurrentUserId();
      setCurrentUserId(uid);

      try {
        const token = await getToken();
        const res = await fetch(`http://localhost:5000/api/profile/${userId || uid}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          setProfile(data);
        } else {
          setProfile(null);
        }
      } catch (err) {
        console.error("Erreur chargement profil :", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [userId]);

  if (loading) return <p>Chargement du profil...</p>;
  if (!profile) return <p>Profil non trouvé.</p>;

  const isOwner = userId === undefined || userId === currentUserId;

  const displayedPhoto = profile.photoURL
    ? profile.photoURL.startsWith("http")
      ? profile.photoURL
      : `http://localhost:5000${profile.photoURL}`
    : localStorage.getItem("photoURL") || defaultAvatar;

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "30px" }}>
      <h2 style={{ color: "#6a0dad", marginBottom: "20px" }}>👤 Mon Profil</h2>

      <img
        src={displayedPhoto}
        alt="Photo de profil"
        style={{
          width: "100px",
          height: "100px",
          borderRadius: "50%",
          objectFit: "cover",
          marginBottom: "10px",
        }}
      />

      {isOwner && (
        <div style={{ marginBottom: "10px" }}>
          📸 <a href="/profile-form">Changer ma photo</a>
        </div>
      )}

      <p><strong>Nom :</strong> {profile.name}</p>
      <p><strong>Université :</strong> {profile.university}</p>
      <p><strong>Filière :</strong> {profile.field}</p>
      <p><strong>Niveau :</strong> {profile.level}</p>
      <p><strong>À propos :</strong> {profile.bio || "—"}</p>

      {isOwner && (
        <button
          style={{
            marginTop: "20px",
            backgroundColor: "#b39ddb",
            border: "none",
            padding: "10px 20px",
            borderRadius: "6px",
            color: "#fff",
            cursor: "pointer",
            fontWeight: "bold",
          }}
          onClick={() => navigate("/profile-form")}
        >
          🛠 Modifier mon profil
        </button>
      )}
    </div>
  );
}
