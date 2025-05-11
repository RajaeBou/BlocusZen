import axios from 'axios';
import { getToken, getCurrentUserId } from './auth';

const API_BASE_URL = 'http://localhost:5000/api/notifications';

export const getNotifications = async (uid, { type, limit, skip } = {}) => {
  if (!uid) throw new Error("UID manquant");
  const token = await getToken();

  const params = {};
  if (type) params.type = type;
  if (limit) params.limit = limit;
  if (skip) params.skip = skip;

  const res = await axios.get(`${API_BASE_URL}/${uid}`, {
    headers: { Authorization: `Bearer ${token}` },
    params,
  });

  return res.data;
};

export const markNotificationAsRead = async (notificationId) => {
  const token = await getToken();

  await axios.patch(`${API_BASE_URL}/${notificationId}/read`, null, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const markAllAsReadByType = async (type) => {
  const token = await getToken();
  const userId = await getCurrentUserId();

  await axios.patch(`${API_BASE_URL}/read-all`, { userId, type }, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
