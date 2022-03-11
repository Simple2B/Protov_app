import React, { ReactElement, useState } from "react";
import { Theme } from "@emotion/react";
import {
  Select,
  MenuItem,
  FormControl,
  SelectChangeEvent,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useLocation, useNavigate } from "react-router";
import { axiosInstance } from "../../axios/axiosInstance";
import API4Response from "../../fake_api/API4_response.json";
import { store } from "../../store";

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

enum InputMethod {
  "STRING",
  "IMAGE",
}
interface IMutableRow {
  value: string;
  method: InputMethod;
}

const MAX_ROWS = 2;

export default function AddMethod(): ReactElement {
  const navigate = useNavigate();
  const classes = useStyle();
  const location: any = useLocation().state;
  const [check, setCheck] = useState<string>();
  const [hideButton, setHideButton] = useState<boolean>(false);
  const [mutableRows, setMutableRows] = useState<IMutableRow[]>([]);

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

  const handleAddMethod = () => {
    let newRowMethod = InputMethod.STRING;

    if (mutableRows.length > 0) {
      newRowMethod =
        mutableRows[0].method === InputMethod.STRING
          ? InputMethod.IMAGE
          : InputMethod.STRING;
    }

    setMutableRows((prev) => [...prev, { method: newRowMethod, value: "" }]);
  };

  const handleSelectChange = (
    index: number,
    event: SelectChangeEvent<InputMethod>
  ) => {
    setMutableRows((prev) =>
      prev.map((row, idx) => {
        if (idx === index) {
          row.method = event.target.value as InputMethod;
        }
        return row;
      })
    );
  };

  const handleInputChange = (
    index: number,
    event: {
      target: { value: string };
    }
  ) => {
    setMutableRows((prev) =>
      prev.map((row, idx) => {
        if (idx === index) {
          row.value = event.target.value;
        }
        return row;
      })
    );
  };

  const handleDeleteMethod = (index: number) => {
    const newArray = [...mutableRows];
    newArray.splice(index, 1);

    setMutableRows(newArray);
  };

  const handleSubmit = () => {
    setHideButton(true);
    const data = {
      object_id: location.data.object_id,
      methods: {
        method1: mutableRows.find((el) => el.method === InputMethod.STRING)
          ?.value,
        method2: mutableRows.find((el) => el.method === InputMethod.IMAGE)
          ?.value,
      },
    };
    axiosInstance.post("/", data).then(function (response) {
      const responseData = response.data;
    });

    const fakeData = API4Response;

    if (fakeData.add_method_success) {
      setCheck("SUCCESS");
    } else {
      setCheck("FAIL");
    }
  };

  return (
    <div className="method">
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

      <h1 className="method__title">Transact</h1>

      <div className="method__info">
        {location.data.artist_surname}, {location.data.title},{" "}
        {location.data.year}
      </div>
      <div className="method__id">object ID: {location.data.object_id}</div>

      {check ? (
        <div className={check === "SUCCESS" ? "check_success" : "check_error"}>
          {check}
        </div>
      ) : (
        <>
          {mutableRows.map((item, index) => {
            return (
              <div className="inputs_container" key={index}>
                <FormControl classes={{ root: classes.root }}>
                  <Select
                    disabled={mutableRows.length > 1}
                    value={item.method}
                    onChange={(e) => {
                      handleSelectChange(index, e);
                    }}
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
                      classes={{ root: classes.rootItem }}
                      value={InputMethod.STRING}
                    >
                      method1
                    </MenuItem>
                    <MenuItem value={InputMethod.IMAGE}>method2</MenuItem>
                  </Select>
                </FormControl>

                {item.method === InputMethod.STRING ? (
                  <>
                    <input
                      className="input_text"
                      value={item.value}
                      onChange={(e) => {
                        handleInputChange(index, e);
                      }}
                      type="text"
                    />
                  </>
                ) : (
                  <div className="input_file-container">
                    <label className="input_file-label">
                      <img
                        className="input_file-image"
                        src="/images/upload.svg"
                        alt="upload"
                      />
                      <input
                        value={item.value}
                        onChange={(e) => {
                          handleInputChange(index, e);
                        }}
                        type="file"
                        className="input_file"
                      />
                    </label>
                  </div>
                )}

                <img
                  onClick={() => handleDeleteMethod(index)}
                  src="/images/cross.svg"
                  className="cross_img"
                  alt="cross"
                />
              </div>
            );
          })}
          <div className="method__buttons_set">
            <button onClick={handleSubmit} className="method__button">
              Submit
            </button>
            <button
              disabled={mutableRows.length >= MAX_ROWS}
              onClick={handleAddMethod}
              className="method__button"
            >
              Add Method
            </button>
          </div>
        </>
      )}
    </div>
  );
}
