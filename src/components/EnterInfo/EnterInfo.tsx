import {
  FormControl,
  Select,
  MenuItem,
  SelectChangeEvent,
  Theme,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { makeStyles, createStyles } from "@mui/styles";
import React, { ReactElement, useEffect, useState } from "react";
import "./EnterInfo.css";
import { axiosInstance } from "../../axios/axiosInstance";
import { IAPI1RequestData } from "../../types/API1";
import API1Response from "../../fake_api/API1_response.json";

const useStyle = makeStyles(
  (theme: Theme) => ({
    root: {
      "& .MuiOutlinedInput-notchedOutline": {
        border: "none",
      },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        border: "none",
      },
      border: "none !important",
      width: "340px",
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
    },
    icon: {
      color: "#086E7D !important",
    },
    rootItem: {
      "&:focus": {
        background: "#BAE4EA",
      },
    },
  }),
  { index: 1 }
);

export default function EnterInfo(): ReactElement {
  const classes = useStyle();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [searchItem, setSearchItem] = useState<string | any>(state);
  const [name, setName] = useState<string>();
  const [surname, setSurname] = useState<string>();
  const [title, setTitle] = useState<string>();
  const [year, setYear] = useState<string>();
  const [objectID, setObjectID] = useState<string>();
  const [checkData, setCheckData] = useState<boolean>(false);

  const handleChangeSearchItem = (event: SelectChangeEvent) => {
    setSearchItem(event.target.value);
  };

  const handleBack = () => {
    navigate("/");
  };

  const handleHome = () => {
    navigate("/");
  };

  const handleName = (e: {
    target: { value: React.SetStateAction<string | undefined> };
  }) => {
    setName(e.target.value);
    setCheckData(true);
    if (e.target.value === "") {
      setCheckData(false);
    }
  };

  const handleSurname = (e: {
    target: { value: React.SetStateAction<string | undefined> };
  }) => {
    setSurname(e.target.value);
    setCheckData(true);
    if (e.target.value === "") {
      setCheckData(false);
    }
  };

  const handleTitle = (e: {
    target: { value: React.SetStateAction<string | undefined> };
  }) => {
    setTitle(e.target.value);
    setCheckData(true);
    if (e.target.value === "") {
      setCheckData(false);
    }
  };

  const handleYear = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    const clearValue = e.target.value.toString().replace(/\D/g, "");
    setYear(clearValue);
    setCheckData(true);
    if (e.target.value === "") {
      setCheckData(false);
    }
  };

  const handleObjectID = (e: {
    target: { value: React.SetStateAction<string | undefined> };
  }) => {
    setObjectID(e.target.value);
    setCheckData(true);
    if (e.target.value === "") {
      setCheckData(false);
    }
  };

  const handleNext = () => {
    const data: IAPI1RequestData = {
      artist_surname: name,
      artist_firstname: surname,
      title: title,
      year: year,
      object_id: objectID,
    };
    axiosInstance.post("/", data).then(function (response) {
      const responseData = response.data;
    });
    const fakeResponse = API1Response;

    navigate("/result", { state: { searchItem, responseData: fakeResponse } });
  };

  return (
    <div className="info">
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
      <h1 className="info__header">Enter Info</h1>
      <div className="info__search">
        <FormControl classes={{ root: classes.root }}>
          <Select
            value={searchItem}
            onChange={handleChangeSearchItem}
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
            <MenuItem classes={{ root: classes.rootItem }} value="Provenance">
              Provenance
            </MenuItem>
            <MenuItem value="Verify owner">Verify owner</MenuItem>
            <MenuItem value="Verify object">Verify object</MenuItem>
            <MenuItem value="Transact">Transact</MenuItem>
          </Select>
        </FormControl>

        {/* <select>
          <option>Add</option>
          <option>Provenance</option>
          <option>Verify owner</option>
          <option>Verify object</option>
          <option>Transact</option>
        </select> */}

        <input
          value={name}
          onChange={handleName}
          type="text"
          placeholder="Artist Surname"
          className="info__input"
        />
        <input
          value={surname}
          onChange={handleSurname}
          type="text"
          placeholder="Artist First Name"
          className="info__input"
        />
        <input
          value={title}
          onChange={handleTitle}
          type="text"
          placeholder="Title"
          className="info__input"
        />
        <input
          value={year}
          onChange={handleYear}
          placeholder="Year"
          className="info__input"
        />
        <input
          value={objectID}
          onChange={handleObjectID}
          type="text"
          placeholder="Object ID"
          className="info__input"
        />

        <button
          disabled={!checkData}
          onClick={handleNext}
          className="info__button"
        >
          Search
        </button>
      </div>
    </div>
  );
}
