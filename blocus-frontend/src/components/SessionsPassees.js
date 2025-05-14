import React, { useState, useEffect } from "react";
import { getToken } from "../helpers/auth";

export default function SessionsPassees() {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    const fetchPastSessions = async () => {
      const token = await getToken();
      const res = await fetch("http://localhost:5000/sessions/my/past", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setSessions(data);
    };

    fetchPastSessions();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">📕 Sessions terminées</h2>
      <ul className="space-y-4">
        {sessions.map((s) => (
          <li key={s._id} className="p-4 bg-gray-100 rounded">
            <div className="font-semibold">{s.subject}</div>
            <div>{s.date} — {s.startTime} à {s.endTime}</div>
            <div>🧑‍🏫 Rôle : {s.role}</div>
            <div>📝 Note : {s.note || "Aucune note"}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
