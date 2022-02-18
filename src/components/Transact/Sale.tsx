import { AxiosResponse } from "axios";
import React, { ReactElement, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { axiosInstance } from "../../axios/axiosInstance";
import { IAPI2Response } from "../../types/API2";
import { IAPI7Response } from "../../types/API7";
import API2Response from "../../fake_api/API2_response_succeed.json";
import API7Response from "../../fake_api/API7_resposne.json";

export default function Sale(): ReactElement {
  const navigate = useNavigate();
  const location: any = useLocation().state;
  const [currentPassword, setCurrentPassword] = useState<string>();
  const [newPassword, setNewPassword] = useState<string>();
  const [check, setCheck] = useState<string>();

  const handleBack = () => {
    navigate("/transact", { state: { data: location.data } });
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

  const handleSubmit = async () => {
    const data = {
      object_id: location.data.object_id,
      owner_password: currentPassword,
    };

    //!!REAL RESPONSE
    // const response: AxiosResponse<API2Response> = await axiosInstance.post(
    //   "/",
    //   data
    // );

    //FAKE RESPONSE
    const response = API2Response;

    const today = new Date();

    const date =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate();

    const time =
      today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

    const dateTime = date + " " + time;

    const data2 = {
      object_id: location.data.object_id,
      new_owner_id: newPassword,
      date: dateTime,
      methods: {
        method1: "",
        method2: "",
      },
    };

    if (response.owner_ver_status) {
      //REAL RESPONSE
      // const saleConfirmation: AxiosResponse<IAPI7Response> =
      //   await axiosInstance.post("/", data2);

      //FARE RESPONSE
      const saleConfirmation = API7Response;

      if (!response.owner_ver_status || !saleConfirmation.sale_success) {
        setCheck("FAIL");
      } else {
        setCheck("SUCCESS");
      }
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
        {location.data.artist_surname}, {location.data.title},{" "}
        {location.data.year}
      </div>
      <div className="sale__id">ID: {location.data.object_id}</div>

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
