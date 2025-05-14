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
import PrivateRouteWithProfile from "./components/PrivateRouteWithProfile";
import MesInvitations from "./pages/MesInvitations";
import NotificationsPage from "./pages/NotificationsPage";
import MessagePage from "./pages/MessagePage";
import InboxPage from "./pages/InboxPage";

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
          <PrivateRouteWithProfile>
            <MesSessions />
          </PrivateRouteWithProfile>
        } />
        <Route path="/session/:id/live" element={
          <PrivateRouteWithProfile>
            <SessionLive />
          </PrivateRouteWithProfile>
        } />
        <Route path="/trouver-binome" element={
          <PrivateRouteWithProfile>
            <TrouverBinome />
          </PrivateRouteWithProfile>
        } />
        <Route path="/ajouter-synthese" element={
          <PrivateRouteWithProfile>
            <AjouterSynthese />
          </PrivateRouteWithProfile>
        } />
        <Route path="/syntheses" element={
          <PrivateRouteWithProfile>
            <Syntheses />
          </PrivateRouteWithProfile>
        } />
        <Route path="/invitations" element={
          <PrivateRouteWithProfile>
            <MesInvitations />
          </PrivateRouteWithProfile>
        } />
        <Route path="/notifications" element={
          <PrivateRouteWithProfile>
            <NotificationsPage />
          </PrivateRouteWithProfile>
        } />
        <Route path="/messages/:userId" element={
          <PrivateRouteWithProfile>
            <MessagePage />
          </PrivateRouteWithProfile>
        } />
        <Route path="/messages" element={
          <PrivateRouteWithProfile>
            <InboxPage />
          </PrivateRouteWithProfile>
        } />
        <Route path="/profile" element={
          <PrivateRouteWithProfile>
            <ProfilePage />
          </PrivateRouteWithProfile>
        } />
        <Route path="/profile/:userId" element={
          <PrivateRouteWithProfile>
            <ProfilePage />
          </PrivateRouteWithProfile>
        } />

        {/* 🔧 Remplissage du profil (juste besoin d’être connecté) */}
        <Route path="/profile-form" element={
          <PrivateRoute>
            <ProfileForm />
          </PrivateRoute>
        } />

        {/* Pour test éventuel (non protégé) */}
        <Route path="/university-test" element={<UniversityFieldSelector />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
