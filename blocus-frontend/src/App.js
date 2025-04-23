import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginRegister from "./LoginRegister";
import MesSessions from "./pages/MesSessions";
import Header from "./components/Header";
import Home from "./pages/Home";
import SessionLive from "./pages/SessionLive";
import TrouverBinome from './pages/TrouverBinome';
import UniversityFieldSelector from "./components/UniversityFieldSelector";
//import ProfilePage from './pages/ProfilePage';
import ProfileForm from "./components/ProfileForm";


function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/mes-sessions" element={<MesSessions />} />
        <Route path="/login" element={<LoginRegister />} />
        <Route path="/session/:id/live" element={<SessionLive />} />
        <Route path="/trouver-binome" element={<TrouverBinome />} />
        <Route path="/university-test" element={<UniversityFieldSelector />} />
        <Route path="/profile" element={<ProfileForm />} />
                                


      </Routes>
    </BrowserRouter>
  );
}

export default App;
