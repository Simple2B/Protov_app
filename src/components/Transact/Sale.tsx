import React, { ReactElement, useState } from "react";
import { useLocation, useNavigate } from "react-router";

export default function Sale(): ReactElement {
  const navigate = useNavigate();
  const location: any = useLocation().state;
  const [currentPassword, setCurrentPassword] = useState<string>();
  const [newPassword, setNewPassword] = useState<string>();
  const [check, setCheck] = useState<string>();

  const handleBack = () => {
    navigate("/transact", { state: "Transact" });
  };

  const handleHome = () => {
    navigate("/");
  };

  const handleCurrentPassword = (e: {
    target: { value: React.SetStateAction<string | undefined> };
  }) => {
    setCurrentPassword(e.target.value);
  };

  const handleNewPassword = (e: {
    target: { value: React.SetStateAction<string | undefined> };
  }) => {
    setNewPassword(e.target.value);
  };

  const handleSubmit = () => {
    if (newPassword === currentPassword) {
      setCheck("FAIL");
    } else {
      setCheck("SUCCESS");
    }
  };

  return (
    <div className="sale">
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

      <h1 className="sale__title">Transact</h1>

      <div className="sale__info">
        {location.artist}, {location.title}, {location.year}
      </div>
      <div className="sale__id">ID: {location.objectId}</div>

      {check ? (
        <div className={check === "SUCCESS" ? "check_success" : "check_error"}>
          {check}
        </div>
      ) : (
        <>
          <div className="sale__inputs">
            <input
              value={currentPassword}
              onChange={handleCurrentPassword}
              type="text"
              className="sale__input"
              placeholder="Current owner password"
            />
            <input
              value={newPassword}
              onChange={handleNewPassword}
              type="text"
              className="sale__input"
              placeholder="New owner password"
            />
          </div>

          <button onClick={handleSubmit} className="sale__button">
            Submit
          </button>
        </>
      )}
    </div>
  );
}
