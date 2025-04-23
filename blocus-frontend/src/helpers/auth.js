import { getAuth } from 'firebase/auth';

export async function getCurrentUserId() {
  const auth = getAuth();
  const user = auth.currentUser;
  console.log("🔐 UID Firebase:", user?.uid);
  return user?.uid || null;
}

export function getToken() {
  const token = localStorage.getItem("token");
  console.log("🔑 Token actuel:", token);
  return token;
}
