// 📁 src/components/Navbar.js (extrait)
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import defaultAvatar from "../assets/default-avatar.png"; // ou public/

export default function Navbar() {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  const user = auth.currentUser;

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/login");
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center space-x-2 hover:text-purple-700"
      >
        <img
          src={user?.photoURL || defaultAvatar}
          alt="avatar"
          className="w-6 h-6 rounded-full"
        />
        <span className="font-medium">Profil</span>
      </button>

      {showMenu && (
        <div className="absolute right-0 mt-2 bg-white border shadow-md rounded-lg z-50 w-48">
          <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">👤 Mon profil</Link>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            🔓 Déconnexion
          </button>
        </div>
      )}
    </div>
  );
}
