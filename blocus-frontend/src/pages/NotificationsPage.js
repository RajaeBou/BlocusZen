// 📁 frontend/src/pages/NotificationsPage.js
import React, { useEffect, useState } from "react";
import { getNotifications } from "../helpers/notifications";
import { getCurrentUserId } from "../helpers/auth";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState({
    invite: [],
    message: [],
    reminder: [],
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const uid = await getCurrentUserId();
        if (!uid) throw new Error("UID manquant");

        const types = ["invite", "message", "reminder"];
        const allData = {};

        for (let type of types) {
          const data = await getNotifications(uid, { type, limit: 50 });
          allData[type] = data;
        }

        setNotifications(allData);
      } catch (err) {
        console.error("Erreur de chargement des notifications:", err);
        setError("Impossible de charger les notifications.");
      }
    };

    fetchNotifications();
  }, []);

  const renderSection = (title, items, emoji) => (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-2">{emoji} {title}</h2>
      {items.length === 0 ? (
        <p className="text-gray-500">Aucune notification.</p>
      ) : (
        <ul className="bg-white rounded shadow divide-y">
          {items.map((notif) => (
            <li key={notif._id} className="p-4">
              <div>{notif.content}</div>
              <div className="text-sm text-gray-400">
                {new Date(notif.createdAt).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
        🔔 Mes notifications
      </h1>

      {error && <p className="text-red-600 font-semibold">{error}</p>}

      {!error && (
        <>
          {renderSection("Invitations", notifications.invite, "📨")}
          {renderSection("Messages", notifications.message, "💬")}
          {renderSection("Rappels de session", notifications.reminder, "⏰")}
        </>
      )}
    </div>
  );
};

export default NotificationsPage;
