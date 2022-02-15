import React from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import EnterInfo from "./components/EnterInfo/EnterInfo";
import MainScreen from "./components/MainScreen/MainScreen";
import Provenance from "./components/Provenance/Provenance";
import VerifyOwner from "./components/VerifyOwner/VerifyOwner";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<MainScreen />} />
        <Route path="/enter-info" element={<EnterInfo />} />
        <Route path="/provenance" element={<Provenance />} />
        <Route path="/verify-owner" element={<VerifyOwner />} />
      </Routes>
    </div>
  );
}

export default App;
