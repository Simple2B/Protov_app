import React, { ReactElement, useRef, useState } from "react";
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
import Dropzone from "react-dropzone";
import { API, Storage } from 'aws-amplify';
import { v4 as uuid } from "uuid";

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

  const dropMethod2Ref: any = useRef();

  const [fileMethod2, setFileMethod2] = useState<File[] | null>(null);
  const [isOpenMethod2, setOpenMethod2] = useState<boolean>(false);

  const onDropMethod2 = (uploadedFile: any) => {
    setFileMethod2(uploadedFile);
    setOpenMethod2(true);
  };

  const handleSubmit = async () => {
      setHideButton(true);
      const fileMethod2Key = fileMethod2 ? `${uuid()}_${fileMethod2[0].name}` : '';
      if (fileMethod2) {
        Storage.put(`${fileMethod2Key}`, fileMethod2[0], {
          contentType: fileMethod2[0].type,
        })
        .then((res) => {
          console.log("fileMethod2 key => ", res.key)
        })
        .catch((err) => {
          console.log("err ", err)
        })

      } else {
        console.log("uploadFile: ", "fileMethod2 needed")
      }
      const methods1 = mutableRows.find((el) => el.method === InputMethod.STRING)?.value;
      
      const data = {
        artist_id: location.data.artist_id,
        id_object: location.data.id_object,
        method1: methods1 !== undefined ? methods1 : "",
        method2: fileMethod2 ? fileMethod2[0].name : "",
        image_method2_key: fileMethod2 ? fileMethod2Key : "",
      };

      const awsObject = await API.post('protovapi', '/protovobject/add_method', {body: data});
      console.log("AddMethod awsObject => ", awsObject);

    // axiosInstance.post("/", data).then(function (response) {
    //   const responseData = response.data;
    // });

      // const fakeData = API4Response;

      if (awsObject.message.add_method_success) {
        setCheck("SUCCESS");
      } else {
        setCheck("FAIL");
      }
  };

  console.log("!!!!!!artist_id ", location.data.artist_id);

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
      <div className="method__id">object ID: {location.data.id_object}</div>

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
                ) : 
                
                (
                  <div className="input_file-container">

                      {(fileMethod2 && isOpenMethod2) && 
                        (
                          <div className="input_file-upload">
                            <div onClick={() => {
                                setFileMethod2(null);
                                setOpenMethod2(false);
                              }} className="arrow">x</div>
                            <span className="file-name">{fileMethod2[0].name}</span>
                          </div>
                        ) 
                      }
                      {
                        (fileMethod2 === null && !isOpenMethod2 ) &&
                        (
                          <Dropzone onDrop={onDropMethod2}>
                            {({ getRootProps, getInputProps }) => (
                              <div {...getRootProps({ className: 'drop-zone' })} ref={dropMethod2Ref}>
                                <input {...getInputProps()} />
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
                          </Dropzone>
                        )
                      }
                  </div> )
                }

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
