export function getToken() {
    const token = localStorage.getItem("token");
    console.log("🔑 Token actuel :", token); // ← Ajoute cette ligne
    return token;
  }
  