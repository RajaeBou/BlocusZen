import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginRegister from "./LoginRegister";
import MesSessions from "./pages/MesSessions";
import Header from "./components/Header";
import Home from "./pages/Home";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/mes-sessions" element={<MesSessions />} />
        <Route path="/login" element={<LoginRegister />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
