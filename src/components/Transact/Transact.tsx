import React, { ReactElement, useState } from "react";
import { Theme } from "@emotion/react";
import { Select, MenuItem, FormControl } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useLocation, useNavigate } from "react-router";
import { store } from "../../store";
import "./Transact.css";

const useStyle = makeStyles((theme: Theme) => ({
  root: {
    "& .MuiOutlinedInput-notchedOutline": {
      border: "none",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      border: "none",
    },
    border: "none !important",
    width: "340px",
    // height: "50px",
    padding: 0,
    alignItems: "start",
    fontFamily: "GT Walsheim Pro",
    fontSize: "16px",
  },
  nativeInput: {
    paddingRight: 0,
  },
  select: {
    width: "340px",
    height: "50px",
    border: "1px solid #086E7D",
    borderRadius: "6px !important",
    margin: 0,
    padding: 0,
    textAlign: "start",
    fontFamily: "GT Walsheim Pro !important",
    fontSize: "16px !important",
    marginBottom: "10px",
  },
  icon: {
    color: "#086E7D !important",
  },
  rootItem: {
    "&:focus": {
      background: "#BAE4EA",
    },
  },
}));

export default function Transact(): ReactElement {
  const classes = useStyle();
  const [objectStatus, setObjectStatus] = useState(store.getState().object);
  const [ownerStatus, setOwnerStatus] = useState(store.getState().owner);
  const [selectValue, setSelectValue] = useState<string>("Select method");
  const navigate = useNavigate();
  const location: any = useLocation().state;
  const handleBack = () => {
    navigate("/result", { state: "Transact" });
  };

  const handleHome = () => {
    navigate("/");
  };

  const handleVerifyOwner = () => {
    const data = {
      artist: location.artist,
      title: location.title,
      year: location.year,
      objectId: location.objectId,
      path: "/transact",
    };
    navigate("/verify-owner", { state: data });
  };

  const handleVerifyObject = () => {
    const data = {
      artist: location.artist,
      title: location.title,
      year: location.year,
      objectId: location.objectId,
      path: "/transact",
    };
    navigate("/verify-object", { state: data });
  };

  const handleSelectChange = () => {};

  const handleSales = () => {
    const data = {
      artist: location.artist,
      title: location.title,
      year: location.year,
      objectId: location.objectId,
    };
    navigate("/sale", { state: data });
  };

  const handleAddMethod = () => {
    const data = {
      artist: location.artist,
      title: location.title,
      year: location.year,
      objectId: location.objectId,
    };
    navigate("/add-method", { state: data });
  };

  return (
    <div className="transact">
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
      <h1 className="transact__title">Transact</h1>

      <div className="transact__info">
        {location.artist}, {location.title}, {location.year}
      </div>
      <div className="transact__id">ID: {location.objectId}</div>

      <div className="transact__buttons">
        <button onClick={handleVerifyOwner} className="transact__button">
          Verify owner
        </button>
        <button onClick={handleVerifyObject} className="transact__button">
          Verify object
        </button>
      </div>

      <div className="transact__statuses">
        <div
          className={
            ownerStatus === "SUCCESS"
              ? "transact__status-success"
              : "transact__status-error"
          }
        >
          {ownerStatus}
        </div>
        <div
          className={
            objectStatus === "SUCCESS"
              ? "transact__status-success"
              : "transact__status-error"
          }
        >
          {objectStatus}
        </div>
      </div>
      {objectStatus === "SUCCESS" && ownerStatus === "SUCCESS" && (
        <div className="transact__select-block">
          <FormControl classes={{ root: classes.root }}>
            <Select
              value={selectValue}
              onChange={handleSelectChange}
              className={classes.select}
              classes={{
                select: classes.select,
                nativeInput: classes.nativeInput,
              }}
              inputProps={{
                classes: {
                  icon: classes.icon,
                },
              }}
            >
              <MenuItem
                onClick={handleSales}
                classes={{ root: classes.rootItem }}
                value="sale"
              >
                Sale
              </MenuItem>
              <MenuItem onClick={handleAddMethod} value="image">
                Add method
              </MenuItem>
            </Select>
          </FormControl>
        </div>
      )}
    </div>
  );
}
