import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import logo from "../logo/logo.png"; 

const Header = () => {
  return (
    <header className="blocus-header">
      
      <div className="logo">
  <img src={logo} alt="BlocusZen Logo" className="logo-img" />
  <div className="logo-text">
    <span className="blocus">Blocus</span><span className="zen">Zen</span>
  </div>
</div>
      
      <nav>
        <Link to="/">🏠 Accueil</Link>
        <Link to="/mes-sessions">📅 Mes Sessions</Link>
        <Link to="/notifications">🔔</Link>
        <Link to="/messages">✉️</Link>
        <Link to="/login">👤</Link>
      </nav>
    </header>
  );
};

export default Header;
