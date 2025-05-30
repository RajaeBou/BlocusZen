import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import './NavbarProfile.css';

const NavbarProfile = () => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const itemStyle = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 12px",
    textDecoration: "none",
    color: "#333",
    width: "100%",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "14px"
  };

  return (
    <div style={{ position: "relative" }} ref={menuRef}>
      <button onClick={() => setOpen(!open)} style={{ background: "none", border: "none", cursor: "pointer" }}>
        👤 Profil
      </button>
      {open && (
        <div
          style={{
            position: "absolute",
            right: 0,
            background: "white",
            border: "1px solid #ccc",
            borderRadius: "8px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
            minWidth: "160px"
          }}
        >
        
        
        <Link to="/profile" className="menu-item" onClick={() => setOpen(false)}>
  <span>👤</span> Mon profil
</Link>
<Link to="/login" className="menu-item" onClick={() => setOpen(false)}>
  <span>🔐</span> Connexion
</Link>
<button onClick={handleLogout} className="menu-item">
  <span>🚪</span> Déconnexion
</button>

        
        
        
        
          
        </div>
      )}
    </div>
  );
};

export default NavbarProfile;
