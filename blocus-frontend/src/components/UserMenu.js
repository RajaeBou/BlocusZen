// src/components/UserMenu.js

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { logout } from "../helpers/auth";

const UserMenu = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const user = auth.currentUser;

  const handleLogout = async () => {
    await auth.signOut();
    logout();
    navigate("/login");
  };

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          background: "none",
          border: "none",
          fontSize: "1.5rem",
          cursor: "pointer",
        }}
      >
        👤
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            right: 0,
            background: "white",
            border: "1px solid #ccc",
            borderRadius: "8px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            padding: "10px",
            zIndex: 10,
          }}
        >
          {user && (
            <Link to="/profile" onClick={() => setOpen(false)} style={{ display: "block", padding: "5px 0" }}>
              🧍 Mon profil
            </Link>
          )}
          {!user && (
            <Link to="/login" onClick={() => setOpen(false)} style={{ display: "block", padding: "5px 0" }}>
              🔐 Connexion
            </Link>
          )}
          {user && (
            <button onClick={handleLogout} style={{ display: "block", padding: "5px 0", border: "none", background: "none", cursor: "pointer" }}>
              📤 Déconnexion
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default UserMenu;
