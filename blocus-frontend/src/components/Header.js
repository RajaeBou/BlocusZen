import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import logo from "../logo/logo.png";
import NavbarProfileMenu from "../components/NavbarProfileMenu";

import NotificationBell from "../components/NotificationBell"; 
import { Mail } from "lucide-react"; 
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
