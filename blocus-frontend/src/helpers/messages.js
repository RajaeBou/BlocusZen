// 📁 frontend/src/helpers/messages.js

import axios from "axios";
import { getToken, getCurrentUserId } from "./auth";

// ✅ Marquer un message comme lu
export const markMessageAsRead = async (messageId) => {
  const token = await getToken();
  await axios.patch(
    `http://localhost:5000/api/messages/${messageId}/read`,
    null,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

// ✅ Récupérer le nombre de messages non lus
export const fetchUnreadMessages = async () => {
  const token = await getToken();
  const userId = await getCurrentUserId();
  const res = await axios.get("http://localhost:5000/api/messages/conversations", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = res.data || [];
  const unreadCount = data.filter((msg) => msg.to === userId && msg.isUnread).length;
  return unreadCount;
};
