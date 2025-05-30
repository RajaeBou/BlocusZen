// 📁 src/helpers/auth.js
import { auth } from "../firebase";


export async function getToken() {
  const user = auth.currentUser;
  if (!user) return null;
  return await user.getIdToken(true); // 👈 force un nouveau token
}


//export const getToken = () => {
  //return localStorage.getItem('token');
//};


export async function getCurrentUserId() {
  // Si déjà chargé
  if (auth.currentUser) {
    const token = await auth.currentUser.getIdToken(true);
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.sub;
  }

  // Sinon on attend que Firebase soit prêt
  return new Promise((resolve) => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      unsubscribe();
      if (!user) return resolve(null);
      const token = await user.getIdToken(true);
      const payload = JSON.parse(atob(token.split('.')[1]));
      resolve(payload.sub);
    });
  });
}
export const logout = () => {
  localStorage.removeItem("token");
};

