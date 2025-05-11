import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginRegister from "./LoginRegister";
import MesSessions from "./pages/MesSessions";
import Header from "./components/Header";
import Home from "./pages/Home";
import SessionLive from "./pages/SessionLive";
import TrouverBinome from './pages/TrouverBinome';
import UniversityFieldSelector from "./components/UniversityFieldSelector";
import ProfileForm from "./pages/ProfileForm";
import AjouterSynthese from "./pages/AjouterSynthese";
import Syntheses from "./pages/Syntheses";
import ProfilePage from "./pages/ProfilePage";
import PrivateRoute from "./components/PrivateRoute";
import MesInvitations from "./pages/MesInvitations";
import NotificationsPage from "./pages/NotificationsPage";
import MessagePage from "./pages/MessagePage";
import InboxPage from "./pages/InboxPage";
import PrivateRouteWithProfile from "./components/PrivateRouteWithProfile";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<LoginRegister />} />
        <Route path="/home" element={
          <PrivateRouteWithProfile>
            <Home />
          </PrivateRouteWithProfile>
        } />

        <Route path="/mes-sessions" element={
          <PrivateRoute>
            <MesSessions />
          </PrivateRoute>
        } />

        <Route path="/session/:id/live" element={
          <PrivateRoute>
            <SessionLive />
          </PrivateRoute>
        } />

        <Route path="/trouver-binome" element={
          <PrivateRoute>
            <TrouverBinome />
          </PrivateRoute>
        } />

        <Route path="/ajouter-synthese" element={
          <PrivateRoute>
            <AjouterSynthese />
          </PrivateRoute>
        } />

        <Route path="/syntheses" element={
          <PrivateRoute>
            <Syntheses />
          </PrivateRoute>
        } />

        <Route path="/invitations" element={
          <PrivateRoute>
            <MesInvitations />
          </PrivateRoute>
        } />

        <Route path="/notifications" element={
          <PrivateRoute>
            <NotificationsPage />
          </PrivateRoute>
        } />

        <Route path="/messages/:userId" element={<MessagePage />} />
        <Route path="/messages" element={<InboxPage />} />

        {/* 🔧 Modifier / compléter son profil */}
        <Route path="/profile-form" element={
          <PrivateRoute>
            <ProfileForm />
          </PrivateRoute>
        } />

        {/* 👤 Consulter son propre profil */}
        <Route path="/profile" element={
          <PrivateRoute>
            <ProfilePage />
          </PrivateRoute>
        } />

        {/* 👀 Consulter le profil d’un autre utilisateur */}
        <Route path="/profile/:userId" element={
          <PrivateRoute>
            <ProfilePage />
          </PrivateRoute>
        } />

        {/* Pour test éventuel */}
        <Route path="/university-test" element={<UniversityFieldSelector />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
