import { Theme } from "@emotion/react";
import { Select, MenuItem, FormControl } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { ReactElement, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { axiosInstance } from "../../axios/axiosInstance";
import { store } from "../../store";
import "./VerifyObject.css";
import API5Response from "../../fake_api/API5_response_succeed.json";

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

export default function VerifyObject(): ReactElement {
  const location: any = useLocation().state;
  const classes = useStyle();
  const navigate = useNavigate();
  const [showInput, setShowInput] = useState<boolean>(false);
  const [countInput, setCountInput] = useState<number[]>([]);
  const [methodSelect1, setMethodSelect1] = useState<string>("string");
  const [methodSelect2, setMethodSelect2] = useState<string>("string");
  const [value1, setValue1] = useState<string>("");
  const [value2, setValue2] = useState<string>("");
  const [verification, setVerification] = useState<string | null>();

  const handleBack = () => {
    if (location.data.path === "/transact") {
      const data = {
        artist_surname: location.data.artist_surname,
        title: location.data.title,
        year: location.data.year,
        object_id: location.data.object_id,
      };
      navigate("/transact", {
        state: { data: data, allData: location.allData },
      });
    } else {
      navigate("/result", {
        state: { searchItem: "Verify object", responseData: location.allData },
      });
    }
  };

  const handleHome = () => {
    navigate("/");
  };

  let counter = 0;
  const handleAddMethod = () => {
    if (countInput.length > 1) {
      return;
    }
    setShowInput(true);
    setCountInput((prev) => [...prev, counter]);
    counter++;
  };

  const handleVerify = () => {
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

    const fakeData = API5Response;

    if (location.data.path === "/transact") {
      if (fakeData.object_ver_success) {
        const data = {
          artist_surname: location.data.artist_surname,
          title: location.data.title,
          year: location.data.year,
          object_id: location.data.object_id,
        };
        store.dispatch({ type: "ADD_OBJECT_STATUS", payload: "SUCCESS" });
        navigate("/transact", {
          state: { data: data, allData: location.allData },
        });
      } else {
        const data = {
          artist_surname: location.data.artist_surname,
          title: location.data.title,
          year: location.data.year,
          object_id: location.data.object_id,
        };
        store.dispatch({ type: "ADD_OBJECT_STATUS", payload: "FAIL" });
        navigate("/transact", {
          state: { data: data, allData: location.allData },
        });
      }
    } else {
      if (fakeData.object_ver_success) {
        setVerification("Verification Success!");
      } else {
        setVerification("Verification Fail!");
      }
    }
  };

  const handleSearch = () => {
    setVerification(null);
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

  return (
    <div className="verify_object">
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
      <h1 className="verify_object-title">Object Verification</h1>
      {location && (
        <>
          <div className="verify_object-info">
            {location.data.artist_surname}, {location.data.title},{" "}
            {location.data.year}
          </div>
          <div className="verify_object-id">ID: {location.data.object_id}</div>
        </>
      )}
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
        <>
          <div className="uploading">
            <label className="uploading-label">
              <img src="/images/upload.svg" alt="upload" />
              <input type="file" className="uploading-input"></input>
            </label>
            <div className="uploading-text">Upload photo of object</div>
          </div>

          {showInput &&
            countInput.map((item, index) => {
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
                        value="string"
                      >
                        String
                      </MenuItem>
                      <MenuItem value="image">Image</MenuItem>
                    </Select>
                  </FormControl>

                  {method === "string" ? (
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
                </div>
              );
            })}
          <div className="buttons_block">
            <button onClick={handleAddMethod} className="add_method">
              Add Method
            </button>
            <button onClick={handleVerify} className="verify">
              Verify
            </button>
          </div>
        </>
      )}
    </div>
  );
}
