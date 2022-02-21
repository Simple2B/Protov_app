import { StylesProvider } from "@mui/styles";
import React from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Add from "./components/Add/Add";
import AddSubmit from "./components/Add/AddSubmit";
import EnterInfo from "./components/EnterInfo/EnterInfo";
import MainScreen from "./components/MainScreen/MainScreen";
import Provenance from "./components/Provenance/Provenance";
import Result from "./components/Result/Result";
import AddMethod from "./components/Transact/AddMethod";
import Sale from "./components/Transact/Sale";
import Transact from "./components/Transact/Transact";
import VerifyObject from "./components/VerifyObject/VerifyObject";
import VerifyOwner from "./components/VerifyOwner/VerifyOwner";

function App() {
  return (
    <StylesProvider>
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
          <Route path="/sale" element={<Sale />} />
          <Route path="/add-method" element={<AddMethod />} />
        </Routes>
      </div>
    </StylesProvider>
  );
}

export default App;
