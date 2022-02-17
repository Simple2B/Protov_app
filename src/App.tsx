import React from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Add from "./components/Add/Add";
import AddSubmit from "./components/Add/AddSubmit";
import EnterInfo from "./components/EnterInfo/EnterInfo";
import MainScreen from "./components/MainScreen/MainScreen";
import Provenance from "./components/Provenance/Provenance";
import Result from "./components/Result/Result";
import Transact from "./components/Transact/Transact";
import VerifyObject from "./components/VerifyObject/VerifyObject";
import VerifyOwner from "./components/VerifyOwner/VerifyOwner";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<MainScreen />} />
        <Route path="/enter-info" element={<EnterInfo />} />
        <Route path="/provenance" element={<Provenance />} />
        <Route path="/verify-owner" element={<VerifyOwner />} />
        <Route path="/result" element={<Result />} />
        <Route path="/verify-object" element={<VerifyObject />} />
        <Route path="/add" element={<Add />} />
        <Route path="/add-status" element={<AddSubmit />} />
        <Route path="/transact" element={<Transact />} />
      </Routes>
    </div>
  );
}

export default App;
