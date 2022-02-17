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

export default function EnterInfo(): ReactElement {
  const classes = useStyle();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [searchItem, setSearchItem] = useState<string | any>(state);

  const handleChangeSearchItem = (event: SelectChangeEvent) => {
    setSearchItem(event.target.value);
  };

  const handleBack = () => {
    navigate("/");
  };

  const handleHome = () => {
    navigate("/");
  };

  const handleNext = () => {
    navigate("/result", { state: searchItem });
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
            <MenuItem classes={{ root: classes.rootItem }} value="Add">
              Add
            </MenuItem>
            <MenuItem value="Provenance">Provenance</MenuItem>
            <MenuItem value="Verify owner">Verify owner</MenuItem>
            <MenuItem value="Verify object">Verify object</MenuItem>
            <MenuItem value="Transact">Transact</MenuItem>
          </Select>
        </FormControl>

        <input placeholder="Artist Surname" className="info__input" />
        <input placeholder="Artist First Name" className="info__input" />
        <input placeholder="Title" className="info__input" />
        <input placeholder="Year" className="info__input" />
        <input placeholder="Object ID" className="info__input" />

        <button onClick={handleNext} className="info__button">
          Search
        </button>
      </div>
    </div>
  );
}
