import React, { ReactElement, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { store } from "../../store";
import "./VerifyOwner.css";
import { API } from "aws-amplify";
import Loader from "../Loader/Loader";
export default function VerifyOwner(): ReactElement {
  const location: any = useLocation().state;
  const [password, setPassword] = useState<string>();
  const [verification, setVerification] = useState<string | null>();
  const [isLoad, setLoad] = useState(false);

  const navigate = useNavigate();
  const handleBack = () => {
    if (location.data.path === "/transact") {
      const data = {
        artist_surname: location.data.artist_surname,
        title: location.data.title,
        year: location.data.year,
        id_object: location.data.id_object,
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

  const verify = async () => {
    setLoad(true);
    const data = {
      id_object: location.data.id_object,
      owner_password: password,
    };

    const ownerData = await API.post('protovapi', '/protovobject/verify_owner', {body: data});
    console.log("VerifyOwner ownerData => ", ownerData);

    if (location.data.path === "/transact") {
      setLoad(false);
      if (ownerData.owner_ver_status) {
        const data = {
          artist_id: location.data.artist_id,
          artist_surname: location.data.artist_surname,
          title: location.data.title,
          year: location.data.year,
          id_object: location.data.id_object,
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
          id_object: location.data.id_object,
        };
        store.dispatch({ type: "ADD_OWNER_STATUS", payload: "FAIL" });
        navigate("/transact", {
          state: { data: data, allData: location.allData },
        });
      }
    } else {
      if (ownerData.owner_ver_status) {
        setLoad(false);
        setVerification("Verification Success!");
      } else {
        setLoad(false);
        setVerification("Verification Fail!");
      }
    }
  };

  return (
    <div className={isLoad ? "verifyOwnerLoader" : "verify_owner" }>
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
        object ID: {location.data.id_object}
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
      {isLoad && <Loader/>}
    </div>
  );
}
