import React, { useEffect } from "react";
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
import { API } from 'aws-amplify';

export default function App() {

  const getAllObjects = async () => {
    const data = await API.get('protovapi', '/awsobject', {})
    console.log('GET: getAllObjects -> data', data)
  };

  const testIdGetObject = '2a4e8636-c4dc-4b35-8cd4-b287dceb464f';

  const getObject = async () => {
    const data = await API.get('protovapi', `/awsobject/${testIdGetObject}`, {})
    console.log('GET: getObject -> data', data)
  };

  const createData = async () => {
    const data = await API.post('protovapi', '/awsobject', {
      body: {
        artist_surname: 'Picasso',
        artist_firstname: 'Pablo',
        artist_id: '',
        object_image: '',
        title: 'The Old Guitarist',
        year: 1904,
      }
    })
    console.log('POST: protovobject data', data)
  }

  const testIdDeleteObject = '7IF79HS9J4U2U4SH0M3O0UA20VVV4KQNSO5AEMVJF66Q9ASUAAJG';

  const deleteObject = async () => {
    const data = await API.del('protovapi', `/awsobject/${testIdDeleteObject}`, {})
    console.log('GET: deleteObject -> data', data)
  };

  const updateObject = async () => {
    const data = await API.put('protovapi', `/awsobject/${testIdGetObject}`, {
      body: {
        artist_surname: 'Picasso update',
        artist_firstname: 'Pablo update',
        artist_id: '',
        object_image: '',
        title: 'The Old Guitarist update',
        year: 1904,
      }
    })
    console.log('GET: updateObject -> data', data)
  };

  useEffect(() => {
    getObject();
    getAllObjects();
    // updateObject();
    // createData();
  }, [])

  
  return (
    <div className="App">
      {/* <button onClick={deleteObject} style={{marginTop: '50px'}}>Test delete object</button> */}
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
