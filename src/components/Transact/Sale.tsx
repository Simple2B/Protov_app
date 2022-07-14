import React, { ReactElement, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { store } from "../../store";
import { API } from "aws-amplify";
import Loader from "../Loader/Loader";

export default function Sale(): ReactElement {
  const navigate = useNavigate();
  const location: any = useLocation().state;
  const [currentPassword, setCurrentPassword] = useState<string>();
  const [newPassword, setNewPassword] = useState<string>();
  const [check, setCheck] = useState<string>();
  const [hideButton, setHideButton] = useState<boolean>(false);
  // const [isValidation, setValidation] = useState(false);

  const [passwordError, setPasswordErr] = useState<string>("");
  const [isLoad, setLoad] = useState(false);

  const handleBack = () => {
    navigate("/transact", {
      state: { data: location.data, allData: location.allData },
    });
  };

  const handleHome = () => {
    store.dispatch({ type: "ADD_OBJECT_STATUS", payload: "" });
    store.dispatch({ type: "ADD_OWNER_STATUS", payload: "" });
    navigate("/");
  };

  const handleCurrentPassword = (e: {
    target: { value: React.SetStateAction<string | undefined> };
  }) => {
    setCurrentPassword(e.target.value);
  };

  const handleNewPassword = (e: {
    target: { value: string };
  }) => {
    setNewPassword(e.target.value);

    const newOwnerPassword = e.target.value

    // if (newOwnerPassword !== undefined) {
      // const uppercaseRegExp   = /(?=.*?[A-Z])/;
      // const lowercaseRegExp   = /(?=.*?[a-z])/;
      // const digitsRegExp      = /(?=.*?[0-9])/;
      const specialCharRegExp = /(?=.*?[#?!@$%^&*-])/;
      const minLengthRegExp   = /.{8,}/;
      const passwordLength = newOwnerPassword.length;
      // const uppercasePassword = uppercaseRegExp.test(newOwnerPassword);
      // const lowercasePassword = lowercaseRegExp.test(newOwnerPassword);
      // const digitsPassword = digitsRegExp.test(newOwnerPassword);
      const specialCharPassword = specialCharRegExp.test(newOwnerPassword);
      const minLengthPassword = minLengthRegExp.test(newOwnerPassword);
      let errMsg ="";
      if (newOwnerPassword !== undefined) {
        errMsg="Password is empty";
      }
      if (passwordLength===0){
              errMsg="Password is empty";
      // } else if (!uppercasePassword){
      //         errMsg="At least one Uppercase";
      // } else if (!lowercasePassword){
      //         errMsg="At least one Lowercase";
      // } else if (!digitsPassword){
      //         errMsg="At least one digit";
      } else if (!specialCharPassword){
              errMsg="At least one Special Characters";
      } else if (!minLengthPassword){
              errMsg="At least minumum 8 characters";
      } else {
          errMsg="";
      }
      
      
      if (errMsg.length === 0) {
        setPasswordErr("");
        setNewPassword(newOwnerPassword);
      } else {
        setPasswordErr(errMsg);
      }
    // }
    // setPasswordErr("");
  };

  const handleSubmit = async () => {
    if (passwordError.length > 0 ) {
      return
    }
    setLoad(true);
    setHideButton(true);
    const data = {
      id_object: location.data.id_object,
      owner_password: currentPassword,
      new_owner_id: newPassword,
      methods1: location.data.methods.methods1,
      methods2: location.data.methods.methods2,
    };

    console.log("Sale: data => ", data)

    const ownerData = await API.post('protovapi', '/transactionobject/sale', {body: data});
    console.log("VerifyOwner ownerData => ", ownerData);

    //FAKE RESPONSE
    // const response = API2Response;

    // to test fail response change var response on responseFail
    // const responseFail = API2ResponseFail;
    if (!ownerData.owner_ver_status) {
        setCheck("FAIL");
      }  else {
        setCheck("SUCCESS");
      }
    setPasswordErr("");
    setLoad(false);
  };

  return (
    <div className={isLoad ? "saleContainer": "sale"}>
      <div className="header">
        {hideButton ? (
          <div></div>
        ) : (
          <div onClick={handleBack} className="header__back">
            <img
              src="/images/arrow_back.svg"
              className="back_img"
              alt="back"
            ></img>
          </div>
        )}

        <div onClick={handleHome} className="header__main">
          <img src="/images/home.svg" className="back_main" alt="main"></img>
        </div>
      </div>

      <h1 className="sale__title">Transact</h1>

      <div className="sale__info">
        {location.data.artist_surname}, {location.data.title},{" "}
        {location.data.year}
      </div>
      <div className="sale__id">object ID: {location.data.id_object}</div>

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
            <div className="newPasswordContainer">
              {passwordError.length > 0 && <div className="errorMessage">{passwordError}</div>}
              <input
                value={newPassword}
                onChange={handleNewPassword}
                type="text"
                className={passwordError.length > 0 ? "sale__input errorSaleInput" : "sale__input"}
                placeholder="New owner password"
              />
            </div>
            
          </div>

          <button onClick={handleSubmit} className={newPassword === undefined ? "sale__button sale__button-disabled" : "sale__button"} disabled={newPassword === undefined}>
            Submit
          </button>
        </>
      )}
      {isLoad && <Loader/>}
    </div>
  );
}
