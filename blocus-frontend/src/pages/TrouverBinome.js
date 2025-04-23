import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUserId } from '../helpers/auth'; // adapte si besoin

export default function TrouverBinome() {
  const [publicSessions, setPublicSessions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchPublicSessions() {
      try {
        const userId = await getCurrentUserId();
        console.log("👤 ID utilisateur connecté :", userId);

        if (!userId) return;

        const response = await fetch('http://localhost:5000/api/sessions/public');
        const sessions = await response.json();
        console.log("📚 Sessions récupérées :", sessions);

        // Ne garder que les sessions d'autres utilisateurs
        const filtered = sessions.filter(
          (s) => s.userId && String(s.userId._id || s.userId) !== String(userId)
        );

        console.log("🧼 Sessions filtrées :", filtered);
        setPublicSessions(filtered);
      } catch (err) {
        console.error('❌ Erreur chargement sessions publiques :', err);
      }
    }

    fetchPublicSessions();
  }, []);

  const sendInvite = async (userId) => {
    try {
      const response = await fetch('/api/invites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: userId }),
      });
      if (response.ok) {
        alert('✅ Invitation envoyée !');
      } else {
        alert("❌ Échec de l'invitation.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '30px' }}>
      <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#6a0dad', marginBottom: '25px' }}>
        🤝 Trouver un binôme – <span style={{ color: '#444' }}>Sessions publiques</span>
      </h2>

      {publicSessions.length === 0 ? (
        <p style={{ color: '#666' }}>Aucune session publique disponible pour le moment.</p>
      ) : (
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          backgroundColor: '#fff',
          borderRadius: '10px',
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
        }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f0ff', color: '#333' }}>
              <th style={thStyle}>📘 Matière</th>
              <th style={thStyle}>📅 Date</th>
              <th style={thStyle}>🕒 Heure</th>
              <th style={thStyle}>🎓 Niveau</th>
              <th style={thStyle}>👥 Participants</th>
              <th style={thStyle}>🔍 Profil</th>
              <th style={thStyle}>✉️ Inviter</th>
            </tr>
          </thead>
          <tbody>
            {publicSessions.map(session => (
              <tr key={session._id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={tdStyle}>{session.subject}</td>
                <td style={tdStyle}>{session.date}</td>
                <td style={tdStyle}>{session.startTime} → {session.endTime}</td>
                <td style={tdStyle}>{session.userId?.level || '—'}</td>
                <td style={tdStyle}>
                  <span style={{ fontWeight: 'bold', color: '#6a5acd' }}>
                    {session.acceptedUsers?.length || 0} participant(s)
                  </span>
                </td>

                <td style={tdStyle}>
  <button
    onClick={() => navigate(`/profile/${session.userId?._id}`)}
    style={{ ...btnStyle, backgroundColor: "#6c63ff" }}
  >
    👤 Voir le profil
  </button>
</td>

                <td style={tdStyle}>
                  <button
                    onClick={() => sendInvite(session.userId?._id)}
                    style={{ ...btnStyle, backgroundColor: '#8e44ad' }}
                  >
                    ✉️ Inviter
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// 🎨 Styles
const thStyle = {
  padding: '14px',
  textAlign: 'left',
  fontWeight: 'bold',
  borderBottom: '2px solid #ccc',
};

const tdStyle = {
  padding: '12px',
  fontSize: '15px',
  color: '#333',
};

const btnStyle = {
  padding: '6px 12px',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: '500',
};
