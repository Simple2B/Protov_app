import React, { ReactElement, useState } from "react";
import { Theme } from "@emotion/react";
import { Select, MenuItem, FormControl } from "@mui/material";
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

export default function AddMethod(): ReactElement {
  const navigate = useNavigate();
  const classes = useStyle();
  const location: any = useLocation().state;
  const [countInput, setCountInput] = useState<number[]>([1]);
  const [methodSelect1, setMethodSelect1] = useState<string>("method1");
  const [methodSelect2, setMethodSelect2] = useState<string>("method1");
  const [value1, setValue1] = useState<string>("");
  const [value2, setValue2] = useState<string>("");
  const [check, setCheck] = useState<string>();
  const [hideButton, setHideButton] = useState<boolean>(false);

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

  let counter = 0;
  const handleAddMethod = () => {
    if (countInput.length > 1) {
      return;
    }

    setCountInput((prev) => [...prev, counter]);
    counter++;
  };

  const handleSelectChange = (
    index: number,
    event: {
      target: { value: React.SetStateAction<string> };
    }
  ) => {
    if (index === 0) {
      setMethodSelect1(event.target.value);
    } else {
      setMethodSelect2(event.target.value);
    }
  };

  const handleInputChange = (
    index: number,
    event: {
      target: { value: React.SetStateAction<string> };
    }
  ) => {
    if (index === 0) {
      setValue1(event.target.value);
    } else {
      setValue2(event.target.value);
    }
  };

  const handleSubmit = () => {
    setHideButton(true);
    const data = {
      object_id: location.data.object_id,
      methods: {
        method1: value1,
        method2: value2,
      },
    };
    axiosInstance.post("/", data).then(function (response) {
      const responseData = response.data;
    });

    const fakeData = API4Response;

    if (API4Response.add_method_success) {
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
          {countInput.map((item, index) => {
            const method = index === 0 ? methodSelect1 : methodSelect2;
            return (
              <div className="inputs_container" key={index}>
                <FormControl classes={{ root: classes.root }}>
                  <Select
                    value={index === 0 ? methodSelect1 : methodSelect2}
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
                      value="method1"
                    >
                      method1
                    </MenuItem>
                    <MenuItem value="method2">method2</MenuItem>
                  </Select>
                </FormControl>

                {method === "method1" ? (
                  <>
                    <input
                      className="input_text"
                      value={index === 0 ? value1 : value2}
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
                        value={index === 0 ? value1 : value2}
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
            <button onClick={handleAddMethod} className="method__button">
              Add Method
            </button>
          </div>
        </>
      )}
    </div>
  );
}
