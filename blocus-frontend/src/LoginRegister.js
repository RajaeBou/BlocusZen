import React, { useState, useEffect } from "react";
import { auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

export default function LoginRegister() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleRegister = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("✅ Inscription réussie !");
    } catch (error) {
      alert("❌ Erreur inscription : " + error.message);
    }
  };

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      alert("✅ Connexion réussie !");

      const token = await userCredential.user.getIdToken();
      console.log("Token récupéré : ", token);
      localStorage.setItem("token", token); // ✅ Enregistrement du token

      // 🔁 Redirection après connexion
      window.location.href = "/mes-sessions";

    } catch (error) {
      alert("❌ Erreur connexion : " + error.message);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      alert("✅ Connecté avec Google : " + user.email);

      const token = await user.getIdToken();
      console.log("Token récupéré Google : ", token);
      localStorage.setItem("token", token); // ✅ Enregistrement du token

      // 🔁 Redirection après connexion Google
      window.location.href = "/mes-sessions";

    } catch (error) {
      alert("❌ Erreur Google : " + error.message);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem("token"); // ✅ Nettoyage du token
    alert("🚪 Déconnecté !");
    setUser(null);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Se connecter ou s’inscrire</h2>
      {user ? (
        <>
          <p>Connecté en tant que : <strong>{user.email}</strong></p>
          <button onClick={handleLogout}>Se déconnecter</button>
        </>
      ) : (
        <>
          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          /><br />
          <input
            type="password"
            placeholder="Mot de passe"
            onChange={(e) => setPassword(e.target.value)}
          /><br />
          <button onClick={handleRegister}>S’inscrire</button>
          <button onClick={handleLogin}>Se connecter</button>
          <button onClick={handleGoogleLogin}>Connexion avec Google</button>
        </>
      )}
    </div>
  );
}
