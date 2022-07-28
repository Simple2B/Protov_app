import React from "react";
import "./App.css";
import { StylesProvider } from "@mui/styles";
import { Route, Routes } from "react-router-dom";
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
// import { API } from 'aws-amplify';

export default function App() {
  // example code 
  // const idObject = 'sajhbdkjb8999';

  // const deleteObject = async (id: string) => {
  //   const awsObject = await API.del('protovapi', `/protovobject/${id}`, {});
  //       console.log(" awsObject => ", awsObject);
  // }
  return (
    <div className="App">

      {/* <button onClick={() => deleteObject(idObject)} style={{marginTop: '50px'}}>
        Test delete object
      </button> */}

      <StylesProvider injectFirst>
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
      </StylesProvider>
    </div>
  );
}
