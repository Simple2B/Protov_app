import React, { ReactElement, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./VerifyOwner.css";

export default function VerifyOwner(): ReactElement {
  const location: any = useLocation().state;
  const [password, setPassword] = useState<string>();
  const [verification, setVerification] = useState<string | null>();

  const navigate = useNavigate();
  const handleBack = () => {
    navigate("/result", { state: "Verify owner" });
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
    if (password === "123") {
      setVerification("Verification Success!");
    } else {
      setVerification("Verification Fail!");
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
        {location.artist}, {location.title}, {location.year}
      </div>

      <div className="verify_owner-id">ID: {location.objectId}</div>

      {verification ? (
        <div className="verify_owner-search">
          <div
            className={verification.includes("Success") ? "success" : "error"}
          >
            {verification}
          </div>
          <button onClick={handleSearch} className="verify_owner-button">
            Search
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
          <button onClick={verify} className="verify_owner-button">
            Verify
          </button>
        </div>
      )}
    </div>
  );
}
