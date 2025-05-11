// frontend/src/components/PrivateRouteWithProfile.js
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getCurrentUserId, getToken } from "../helpers/auth";

export default function PrivateRouteWithProfile({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
    const checkProfile = async () => {
      try {
        const uid = await getCurrentUserId();
        const token = await getToken();
        if (!uid || !token) {
          setIsLoading(false);
          return;
        }

        const res = await fetch(`http://localhost:5000/api/profile/${uid}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const profile = await res.json();
        setHasProfile(!!profile);
      } catch (err) {
        console.error("Erreur lors de la vérification du profil:", err);
      } finally {
        setIsLoading(false);
      }
    };
    checkProfile();
  }, []);

  if (isLoading) return null; // Ou un loader
  if (!hasProfile) return <Navigate to="/profile-form" />;

  return children;
}