import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { getToken } from "../helpers/auth";

export default function MesSessions() {
  const [sessions, setSessions] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [popupSessions, setPopupSessions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [upcomingPopup, setUpcomingPopup] = useState(null);
  const [dismissedPopup, setDismissedPopup] = useState(false);

  const [newSession, setNewSession] = useState({
    subject: "",
    date: "",
    startTime: "",
    endTime: "",
    note: "",
    visibility: "private",
  });

  // 🔄 Charger les sessions
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const token = await getToken();
        if (!token) return;

        const res = await fetch("http://localhost:5000/api/sessions/my", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (!Array.isArray(data)) throw new Error("Réponse invalide");

        const now = new Date();
        const validSessions = [];

        for (const s of data) {
          const end = new Date(`${s.date}T${s.endTime}`);
          if (end < now) {
            await fetch(`http://localhost:5000/api/sessions/${s._id}`, {
              method: "DELETE",
              headers: { Authorization: `Bearer ${token}` },
            });
          } else {
            validSessions.push(s);
          }
        }

        setSessions(validSessions);
      } catch (err) {
        console.error("Erreur chargement sessions :", err);
      }
    };

    fetchSessions();
  }, []);

  // 🔔 Rappel 2 min avant
  useEffect(() => {
    const checkUpcomingSessions = () => {
      const now = new Date();
      if (dismissedPopup || upcomingPopup) return;

      sessions.forEach((s) => {
        const sessionTime = new Date(`${s.date}T${s.startTime}`);
        const diff = (sessionTime - now) / 60000;

        if (diff > 0 && diff <= 2) {
          setUpcomingPopup(s);
        }
      });
    };

    const interval = setInterval(checkUpcomingSessions, 30000);
    return () => clearInterval(interval);
  }, [sessions, dismissedPopup, upcomingPopup]);

  const getStatus = (session) => {
    const now = new Date();
    const start = new Date(`${session.date}T${session.startTime}`);
    const end = new Date(`${session.date}T${session.endTime}`);

    if (now < start) return "🟢 À venir";
    if (now >= start && now <= end) return "🟡 En cours";
    return "🔴 Terminée";
  };

  const tileClassName = ({ date }) => {
    const dateStr = date.toISOString().split("T")[0];
    return sessions.some((s) => s.date === dateStr) ? "has-session" : null;
  };

  const handleDateClick = (date) => {
    const dateStr = date.toISOString().split("T")[0];
    const filtered = sessions.filter((s) => s.date === dateStr);
    setPopupSessions(filtered);
    setSelectedDate(dateStr);
  };

  const handleAddSession = async (e) => {
    e.preventDefault();

    const start = new Date(`${newSession.date}T${newSession.startTime}`);
    const end = new Date(`${newSession.date}T${newSession.endTime}`);
    const now = new Date();

    if (start <= now) {
      alert("⚠️ Tu ne peux pas créer une session dans le passé !");
      return;
    }

    const overlap = sessions.some((s) => {
      const existingStart = new Date(`${s.date}T${s.startTime}`);
      const existingEnd = new Date(`${s.date}T${s.endTime}`);
      return (
        s.date === newSession.date &&
        ((start >= existingStart && start < existingEnd) ||
          (end > existingStart && end <= existingEnd) ||
          (start <= existingStart && end >= existingEnd))
      );
    });

    if (overlap) {
      alert("⚠️ Une autre session est déjà planifiée dans cette plage horaire !");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await getToken()}`,
        },
        body: JSON.stringify(newSession),
      });

      const data = await res.json();
      if (!res.ok) {
        alert("❌ Erreur : " + data.error);
        return;
      }

      alert("✅ Session ajoutée !");
      setSessions([...sessions, data]);
      setNewSession({
        subject: "",
        date: "",
        startTime: "",
        endTime: "",
        note: "",
        visibility: "private",
      });
      setShowForm(false);
    } catch (error) {
      alert("❌ Erreur connexion : " + error.message);
    }
  };

  const handleDeleteSession = async (sessionId) => {
    if (!window.confirm("Supprimer cette session ?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/sessions/${sessionId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${await getToken()}` },
      });

      if (!res.ok) throw new Error("Erreur de suppression");
      setSessions((prev) => prev.filter((s) => s._id !== sessionId));
      setPopupSessions((prev) => prev.filter((s) => s._id !== sessionId));
    } catch (err) {
      alert("❌ Échec : " + err.message);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>📅 Planifier votre blocus </h2>
        <button onClick={() => setShowForm(!showForm)}>
          {showForm ? "❌ Annuler" : "➕ Ajouter une session"}
        </button>
      </div>

      <Calendar onClickDay={handleDateClick} tileClassName={tileClassName} />

      {popupSessions.length > 0 && (
        <div style={{ marginTop: "20px", background: "#f9f9f9", padding: "10px", borderRadius: "8px" }}>
          <h3>Sessions le {selectedDate}</h3>
          <ul>
            {popupSessions.map((s) => (
              <li key={s._id}>
                <strong>{s.subject}</strong> ({getStatus(s)})
                <br />
                🕓 {s.startTime} → {s.endTime}
                <br />
                🔐 {s.visibility === "public" ? "🌐 Publique" : "Privée"}
                {s.note && <div>📝 {s.note}</div>}
                <br />
                {getStatus(s) === "🟡 En cours" && (
                  <button onClick={() => window.location.href = `/session/${s._id}/live`}>▶️ Ouvrir</button>
                )}
                <button onClick={() => handleDeleteSession(s._id)}>🗑️ Supprimer</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleAddSession} style={{ marginTop: "20px" }}>
          <input type="text" placeholder="Matière" value={newSession.subject}
            onChange={(e) => setNewSession({ ...newSession, subject: e.target.value })} required />
          <br />
          <input type="date" value={newSession.date}
            onChange={(e) => setNewSession({ ...newSession, date: e.target.value })} required />
          <br />
          <input type="time" value={newSession.startTime}
            onChange={(e) => setNewSession({ ...newSession, startTime: e.target.value })} required />
          →
          <input type="time" value={newSession.endTime}
            onChange={(e) => setNewSession({ ...newSession, endTime: e.target.value })} required />
          <br />
          <textarea placeholder="Note facultative" value={newSession.note}
            onChange={(e) => setNewSession({ ...newSession, note: e.target.value })} />
          <br />
          Visibilité :
          <select value={newSession.visibility}
            onChange={(e) => setNewSession({ ...newSession, visibility: e.target.value })}>
            <option value="private">Privée</option>
            <option value="public">Publique</option>
          </select>
          <br /><br />
          <button type="submit">✅ Ajouter</button>
        </form>
      )}

      <div style={{ marginTop: "40px" }}>
        <h3>📋 Sessions à venir ou en cours</h3>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#eee" }}>
              <th>Matière</th>
              <th>Date</th>
              <th>Heures</th>
              <th>Note</th>
              <th>🔐</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((s) => (
              <tr key={s._id}>
                <td>{s.subject}</td>
                <td>{s.date}</td>
                <td>{s.startTime} → {s.endTime}</td>
                <td>{s.note || "—"}</td>
                <td>{s.visibility === "public" ? "🌐" : "Privée"}</td>
                <td>{getStatus(s)}</td>
                <td>
                  {getStatus(s) === "🟡 En cours" && (
                    <button onClick={() => window.location.href = `/session/${s._id}/live`}>▶️ Ouvrir</button>
                  )}
                  <button onClick={() => handleDeleteSession(s._id)}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {upcomingPopup && !dismissedPopup && (
        <div style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          background: "#fff",
          border: "1px solid #ccc",
          padding: "15px",
          borderRadius: "8px",
          boxShadow: "0px 2px 8px rgba(0,0,0,0.2)",
          zIndex: 999,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <strong>⏰ Ta session va commencer</strong>
            <button onClick={() => setDismissedPopup(true)}>❌</button>
          </div>
          <p>{upcomingPopup.subject} à {upcomingPopup.startTime}</p>
          <button onClick={() => window.location.href = `/session/${upcomingPopup._id}/live`}>▶️ Ouvrir maintenant</button>
        </div>
      )}
    </div>
  );
}
