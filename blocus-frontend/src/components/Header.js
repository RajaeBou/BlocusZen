import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import logo from "../logo/logo.png";
import NavbarProfileMenu from "../components/NavbarProfileMenu";
//import InvitationDropdown from "./InvitationDropdown"; // 👈 Assure-toi que le chemin est bon
import NotificationBell from "../components/NotificationBell"; // vérifie bien le chemin
import { Mail } from "lucide-react"; // ou utilise une icône emoji si tu préfères
import MessageBell from "./MessageBell";


const Header = () => {
  return (
    <header className="blocus-header">
      <div className="logo">
        <img src={logo} alt="BlocusZen Logo" className="logo-img" />
        <div className="logo-text">
          <span className="blocus">Blocus</span><span className="zen">Zen</span>
        </div>
      </div>

      <nav style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <Link to="/">🏠 Accueil</Link>
        <Link to="/mes-sessions">📅 Mes Sessions</Link>

        <NotificationBell />

       
        <MessageBell />





        <div style={{ marginLeft: "auto" }}>
          <NavbarProfileMenu />
        </div>
      </nav>
    </header>
  );
};

export default Header;
