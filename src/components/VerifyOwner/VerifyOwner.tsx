import React, { ReactElement, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { axiosInstance } from "../../axios/axiosInstance";
import { store } from "../../store";
import "./VerifyOwner.css";
import API2Response from "../../fake_api/API2_response_succeed.json";
import API2ResponseFail from "../../fake_api/API2_response_fail.json";
import { API } from "aws-amplify";

export default function VerifyOwner(): ReactElement {
  const location: any = useLocation().state;
  const [password, setPassword] = useState<string>();
  const [verification, setVerification] = useState<string | null>();

  const navigate = useNavigate();
  const handleBack = () => {
    if (location.data.path === "/transact") {
      const data = {
        artist_surname: location.data.artist_surname,
        title: location.data.title,
        year: location.data.year,
        object_id: location.data.object_id,
      };
      navigate("/transact", {
        state: { data: data, allData: location.allData },
      });
    } else {
      navigate("/result", {
        state: { searchItem: "Verify owner", responseData: location.allData },
      });
    }
  };

  const handleHome = () => {
    navigate("/");
  };

  const handlePassword = (event: {
    target: { value: React.SetStateAction<string | undefined> };
  }) => {
    setPassword(event.target.value);
  };

  const handleSearch = () => {
    setVerification(null);
  };

  const verify = () => {
    const data = {
      object_id: location.data.object_id,
      owner_password: password,
    };

    // TODO: you need create logic of log in to get the owner password for verification owner

    const verifyOwner = async() => {
      const ownerData = await API.post('protovapi', '/transactionobject/verify_owner', {body: data});
      console.log("! ownerData => ", ownerData);
    };
    verifyOwner()

    const fakeData = API2Response;

    // to test fail response change var fakeData on fakeDataFail
    const fakeDataFail = API2ResponseFail;

    if (location.data.path === "/transact") {
      if (fakeData.owner_ver_status) {
        const data = {
          artist_surname: location.data.artist_surname,
          title: location.data.title,
          year: location.data.year,
          object_id: location.data.object_id,
        };
        store.dispatch({ type: "ADD_OWNER_STATUS", payload: "SUCCESS" });
        navigate("/transact", {
          state: { data: data, allData: location.allData },
        });
      } else {
        const data = {
          artist_surname: location.data.artist_surname,
          title: location.data.title,
          year: location.data.year,
          object_id: location.data.object_id,
        };
        store.dispatch({ type: "ADD_OWNER_STATUS", payload: "FAIL" });
        navigate("/transact", {
          state: { data: data, allData: location.allData },
        });
      }
    } else {
      if (fakeData.owner_ver_status) {
        setVerification("Verification Success!");
      } else {
        setVerification("Verification Fail!");
      }
    }
  };

  return (
    <div className="verify_owner">
      <div className="header">
        <div onClick={handleBack} className="header__back">
          <img
            src="/images/arrow_back.svg"
            className="back_img"
            alt="back"
          ></img>
        </div>
        <div onClick={handleHome} className="header__main">
          <img src="/images/home.svg" className="back_main" alt="main"></img>
        </div>
      </div>

      <h1 className="verify_owner-title">Owner Verification</h1>
      <div className="verify_owner-address">
        {location.data.artist_surname}, {location.data.title},{" "}
        {location.data.year}
      </div>

      <div className="verify_owner-id">
        object ID: {location.data.object_id}
      </div>

      {verification ? (
        <div className="verify_owner-search">
          <div
            className={verification.includes("Success") ? "success" : "error"}
          >
            {verification}
          </div>
          <button onClick={handleSearch} className="verify_owner-button">
            Retry
          </button>
        </div>
      ) : (
        <div className="verify_owner-search">
          <input
            value={password}
            placeholder="Password"
            className="verify_owner-input"
            onChange={handlePassword}
          />
          <button
            disabled={!password}
            onClick={verify}
            className="verify_owner-button"
          >
            Verify
          </button>
        </div>
      )}
    </div>
  );
}
