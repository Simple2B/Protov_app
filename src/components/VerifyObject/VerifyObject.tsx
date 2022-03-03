import { Theme } from "@emotion/react";
import {
  Select,
  MenuItem,
  FormControl,
  SelectChangeEvent,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { ReactElement, useState } from "react";
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

enum InputMethod {
  "STRING",
  "IMAGE",
}
interface IMutableRow {
  value: string;
  method: InputMethod;
}

export default function VerifyObject(): ReactElement {
  const location: any = useLocation().state;
  const classes = useStyle();
  const navigate = useNavigate();
  const [verification, setVerification] = useState<string | null>();
  const [mutableRows, setMutableRows] = useState<IMutableRow[]>([]);

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

  const handleVerify = () => {
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

    const fakeData = API5Response;

    if (location.data.path === "/transact") {
      if (fakeData.object_ver_success) {
        const data = {
          artist_surname: location.data.artist_surname,
          title: location.data.title,
          year: location.data.year,
          object_id: location.data.object_id,
          methods: {
            method1: mutableRows.find((el) => el.method === InputMethod.STRING)
              ?.value,
            method2: mutableRows.find((el) => el.method === InputMethod.IMAGE)
              ?.value,
          },
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
          methods: {
            method1: mutableRows.find((el) => el.method === InputMethod.STRING)
              ?.value,
            method2: mutableRows.find((el) => el.method === InputMethod.IMAGE)
              ?.value,
          },
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
          <div className="verify_object-id">
            object ID: {location.data.object_id}
          </div>
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
            Retry
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
