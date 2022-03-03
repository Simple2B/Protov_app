import React, { ReactElement, useEffect, useState } from "react";
import { useLocation } from "react-router";
import { useNavigate } from "react-router-dom";
import "./Add.css";

export default function AddSubmit(): ReactElement {
  const [status, setStatus] = useState<string>();
  const [check, setCheck] = useState<boolean>(false);
  const location: any = useLocation().state;
  const navigate = useNavigate();

  useEffect(() => {
    if (location.responseData.add_object_success) {
      setStatus("Success!");
    } else {
      setStatus("Fail!");
    }
  }, []);

  const handleBack = () => {
    navigate("/add");
  };

  const handleHome = () => {
    navigate("/");
  };
  return (
    <div className="add_submit">
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
      <h1 className="add_submit-title">Add</h1>
      <div className="add_submit-info">
        {location.data.artist_firstname} {location.artist_surname},{" "}
        {location.data.title}, {location.data.year}
      </div>
      <div className="add_submit-id">artist ID: {location.data.artist_id}</div>
      <h2 className="verify_methods-title">Verification methods:</h2>
      <div>
        <>
          {Object.values(location.data.methods)[0] &&
            Object.keys(location.data.methods)[0]}
        </>
      </div>
      <div>
        <>
          {Object.values(location.data.methods)[1] &&
            Object.keys(location.data.methods)[1]}
        </>
      </div>
      <div
        className={
          status === "Success!"
            ? "verify_status-success"
            : "verify_status-error"
        }
      >
        {status}
      </div>
    </div>
  );
}
