import React, { useEffect, useState } from "react";
import { getCurrentUserId, getToken } from "../helpers/auth";

export default function MesInvitations() {
  const [invitations, setInvitations] = useState([]);

  useEffect(() => {
    const fetchInvitations = async () => {
      try {
        const userId = await getCurrentUserId();
        const token = await getToken();

        const res = await fetch(`api/invitations/received/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          setInvitations(data);
        }
      } catch (err) {
        console.error("Erreur chargement invitations :", err);
      }
    };

    fetchInvitations();
  }, []);

  const handleStatus = async (id, status) => {
    try {
      const token = await getToken();
  
      const res = await fetch(`api/invitations/${id}/${status}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
         "Content-Type": "application/json"
        }
      });
  
      if (res.ok) {
        setInvitations((prev) =>
          prev.map((inv) => (inv._id === id ? { ...inv, status } : inv))
        );
      }
    } catch (err) {
      console.error("Erreur mise à jour :", err);
    }
  };
  
  

  return (
    <div style={{ padding: "30px" }}>
      <h2>📨 Mes invitations</h2>
      {invitations.length === 0 ? (
        <p>Aucune invitation reçue.</p>
      ) : (
        <ul>
          {invitations.map((inv) => (
            <li key={inv._id} style={{ marginBottom: "15px" }}>
              <strong> De :</strong> {inv.fromProfile?.name || "Utilisateur inconnu"}
              <br />
              <strong>Statut :</strong> {inv.status}
              {inv.status === "pending" && (
                <div style={{ marginTop: "8px" }}>
                  <button onClick={() => handleStatus(inv._id, "accepted")}>✅ Accepter</button>

                  <button onClick={() => handleStatus(inv._id, "rejected")} style={{ marginLeft: "10px" }}>
                  ❌ Refuser
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
