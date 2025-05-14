import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUserId, getToken } from '../helpers/auth';

export default function TrouverBinome() {
  const [publicSessions, setPublicSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchPublicSessions() {
      try {
        const token = await getToken();
        if (!token) return;

        const response = await fetch('http://localhost:5000/api/sessions/public', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Erreur lors de la récupération des sessions");

        const sessions = await response.json();
        setPublicSessions(sessions);
      } catch (err) {
        console.error('❌ Erreur chargement sessions publiques :', err);
      } finally {
        setLoading(false);
      }
    }

    fetchPublicSessions();
  }, []);

  
  const sendInvite = async (toUserId, sessionId) => {
    try {
      const from = await getCurrentUserId();
      const token = await getToken();
      if (!from || !toUserId || !token) return;
  
      const res = await fetch("http://localhost:5000/api/invitations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          from,
          to: toUserId,
          sessionId: sessionId || null,
        }),
      });
  
      if (!res.ok) throw new Error("Échec de l'invitation");
      alert("✅ Invitation envoyée !");
    } catch (err) {
      console.error("❌", err);
      alert("Erreur lors de l'envoi de l'invitation.");
    }
  };
  
    
    
    
    
  

  const formatDate = (dateStr) => {
    try {
      return new Date(dateStr).toLocaleDateString();
    } catch {
      return dateStr;
    }
  };

  return (
    <div style={{ padding: '30px' }}>
      <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#6a0dad', marginBottom: '25px' }}>
        🤝 Trouver un binôme – <span style={{ color: '#444' }}>Sessions publiques</span>
      </h2>

      {loading ? (
        <p style={{ color: '#888' }}>Chargement des sessions...</p>
      ) : publicSessions.length === 0 ? (
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
                <td style={tdStyle}>{formatDate(session.date)}</td>
                <td style={tdStyle}>{session.startTime} → {session.endTime}</td>
                <td style={tdStyle}>{session.organizerProfile?.level || '—'}</td>
                <td style={tdStyle}>
                  <span style={{ fontWeight: 'bold', color: '#6a5acd' }}>
                    {session.participantsProfiles?.length || 0} participant(s)
                  </span>
                </td>
                <td style={tdStyle}>
                  <button
                    onClick={() => navigate(`/profile/${session.organizerProfile?.userId}`)}
                    style={{ ...btnStyle, backgroundColor: "#6c63ff" }}
                  >
                    👤 Voir le profil
                  </button>
                </td>
                <td style={tdStyle}>
  <button
    onClick={() => navigate(`/messages/${session.organizerProfile?.userId}`)}
    style={{ ...btnStyle, backgroundColor: "#3498db" }}
  >
    💬 Message
  </button>
</td>

                <td style={tdStyle}>
  <button
    onClick={() => sendInvite(session.organizerProfile?.userId, session._id)}
    style={{ ...btnStyle, backgroundColor: '#8e44ad' }}
  >
    ✉️ Inviter
  </button>
</td>

                <td style={tdStyle}>
  {session.isParticipant && (
    <button
      onClick={() => navigate(`/session/${session._id}/live`)}
      style={{ ...btnStyle, backgroundColor: '#28a745' }}
    >
      👉 Rejoindre
    </button>
  )}
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
