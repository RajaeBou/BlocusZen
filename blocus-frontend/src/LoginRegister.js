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
import { useNavigate } from "react-router-dom";

export default function LoginRegister() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

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

      const currentUser = auth.currentUser;
      const token = await currentUser.getIdToken();
      localStorage.setItem("token", token);
      localStorage.setItem("photoURL", currentUser.photoURL || ""); // facultatif

      // Redirection vers formulaire profil après inscription
      window.location.href = "/profile-form";
    } catch (error) {
      alert("❌ Erreur inscription : " + error.message);
    }
  };

  const handleLogin = async () => {
    try {
      console.log("Tentative de login avec :", email, password);

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      alert("✅ Connexion réussie !");

      const token = await userCredential.user.getIdToken();
      localStorage.setItem("token", token);

      const uid = userCredential.user.uid;

      // 🔎 Vérifie si le profil existe
      const res = await fetch(`http://localhost:5000/api/profile/${uid}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      // 🔁 Redirection selon profil
      if (data) {
        window.location.href = "/home";
      } else {
        window.location.href = "/profile-form";
      }
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
      localStorage.setItem("token", token);
      localStorage.setItem("photoURL", user.photoURL); // 👈 conserve la photo Google

      const uid = user.uid;

      // 🔎 Vérifie si un profil existe
      const res = await fetch(`http://localhost:5000/api/profile/${uid}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      // 🔁 Redirection selon profil
      if (data) {
        window.location.href = "/home";
      } else {
        window.location.href = "/profile-form";
      }
    } catch (error) {
      alert("❌ Erreur Google : " + error.message);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem("token");
    localStorage.removeItem("photoURL");
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
