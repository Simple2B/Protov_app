import React, { ReactElement, useRef, useState } from "react";
import { Theme } from "@emotion/react";
import {
  Select,
  MenuItem,
  FormControl,
  SelectChangeEvent,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useLocation, useNavigate } from "react-router-dom";
import { store } from "../../store";
import "./VerifyObject.css";
import API5Response from "../../fake_api/API5_response_succeed.json";
import API5ResponseFail from "../../fake_api/API5_response_fail.json";
import Dropzone from "react-dropzone";
import { API, Storage } from 'aws-amplify';
import { Readable } from "stream";


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

export default function VerifyObject(): ReactElement {
  const location: any = useLocation().state;
  const classes = useStyle();
  const navigate = useNavigate();
  const [verification, setVerification] = useState<string | null>();
  const [mutableRows, setMutableRows] = useState<IMutableRow[]>([]);

  const [image, setImage] = useState();
  const [file, setFile] = useState<File[] | null>(null); // state for storing actual image
  const [isOpen, setOpen] = useState<boolean>(false);
  const verifyObjectRef: any = useRef();


  const [fileMethod2, setFileMethod2] = useState<File[] | null>(null);
  const [isOpenMethod2, setOpenMethod2] = useState<boolean>(false);
  const verifyObjectMethod2Ref: any = useRef();

  const handleBack = () => {
    if (location.data.path === "/transact") {
      const data = {
        artist_surname: location.data.artist_surname,
        title: location.data.title,
        year: location.data.year,
        id_object: location.data.id_object,
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

  // function downloadBlob(blob: any, filename: string) {
  //   if (blob !== undefined) {
  //     const url = URL.createObjectURL(blob);
  //     const a = document.createElement('a');
  //     a.href = url;
  //     a.download = filename || 'download';
  //     const clickHandler = () => {
  //       setTimeout(() => {
  //         URL.revokeObjectURL(url);
  //         a.removeEventListener('click', clickHandler);
  //       }, 150);
  //     };
  //     a.addEventListener('click', clickHandler, false);
  //     a.click();
  //     return a;
  //   }
    
  // }

  const handleVerify = async() => {
    const data = {
      id_object: location.data.id_object,
      methods: {
        method1: mutableRows.find((el) => el.method === InputMethod.STRING)
          ?.value,
        method2: mutableRows.find((el) => el.method === InputMethod.IMAGE)
          ?.value,
      },
    };

    const dataObject = await API.get('protovapi', `/protovobject/${location.data.id_object}`, {});
    console.log('VerifyObject => GET: getVerifyObject -> !!! dataObject', dataObject.data[0]);

    let responseData = { "object_ver_success": false };

    if (file && dataObject.data[0].image_file_key) {
      const fileDate: any =  await Storage.get(dataObject.data[0].image_file_key, { download: true });
      console.log("VerifyObject fileDate  size", fileDate.Body.size);
      console.log("VerifyObject fileDate  type", fileDate.Body.type);
      
      if(file[0].name === dataObject.data[0].object_image 
        && (file[0].size === fileDate.Body.size) && (file[0].type === fileDate.Body.type)) {
            console.log("VerifyObject: file ", true)
            setVerification("Verification Success!");
            responseData = { "object_ver_success": true };
      } else {
        setVerification("Verification Fail!");
        responseData = { "object_ver_success": false };
      }
    };

    if (fileMethod2 && dataObject.data[0].image_method2_key) {
        const fileDate: any =  await Storage.get(dataObject.data[0].image_method2_key, { download: true });
        console.log("VerifyObject fileDate ", fileDate);
        if(fileMethod2[0].name === dataObject.data[0].object_image 
          && (fileMethod2[0].size === fileDate.Body.size) && (fileMethod2[0].type === fileDate.Body.type)) {
              console.log("VerifyObject: fileMethod2 ", true)
              setVerification("Verification Success!");
              responseData = { "object_ver_success": true };
        } else {
          setVerification("Verification Fail!");
          responseData = { "object_ver_success": false };
        }
    };

    if ((mutableRows.find((el) => el.method === InputMethod.STRING)?.value) !== undefined) {
      if ((mutableRows.find((el) => el.method === InputMethod.STRING)?.value) === dataObject.data[0].methods1) {
        console.log("VerifyObject: methods1 ", true)
        setVerification("Verification Success!");
        responseData = { "object_ver_success": true };
      } else {
        setVerification("Verification Fail!");
        responseData = { "object_ver_success": false };
      }
    }
    

    if (location.data.path === "/transact") {
      if (responseData.object_ver_success) {
        const data = {
          artist_surname: location.data.artist_surname,
          title: location.data.title,
          year: location.data.year,
          id_object: location.data.id_object,
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
          id_object: location.data.id_object,
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
      if (responseData.object_ver_success) {
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
    if (mutableRows[index].method === InputMethod.IMAGE) {
        console.log(" method ", mutableRows[index].method)
        setFileMethod2(null);
        setOpenMethod2(false);
    }
  };

  
  

  const onDrop = (uploadedFile: any) => {
    console.log("VerifyObject: uploadedFile ", uploadedFile);
    setFile(uploadedFile);
    setOpen(true);
  };

  const onDropMethod2 = (uploadedFile: any) => {
    setFileMethod2(uploadedFile);
    setOpenMethod2(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFile(null);
    setFileMethod2(null);
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
            object ID: {location.data.id_object}
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
            {
                  (file && isOpen) && 
                  (
                    <div className="uploading-file">
                      <div onClick={handleClose} className="arrow">x</div>
                      <strong>Selected file: </strong> <span className="file-name">{file[0].name}</span>
                    </div>
                  ) 
            }
            {
                (file === null && !isOpen) &&
                  (
                    <Dropzone onDrop={onDrop}>
                      {({ getRootProps, getInputProps }) => (
                        <div {...getRootProps({ className: 'drop-zone' })} ref={verifyObjectRef}>
                          <input {...getInputProps()} />
                          <label className="uploading-label">
                            <img src="/images/upload.svg" alt="upload" />
                            <input
                              value={image}
                              id='file-input'
                              onChange={(e) => {
                                console.log("onChange: => image ", image)
                                // setImage(e.target)
                              }} type="file"
                              className="uploading-input"
                              accept="downloadImages/*"
                            ></input>
                          </label>
                          <div className="uploading-text">Upload photo of object</div>
                        </div>
                      )}
                    </Dropzone>
                  )
            }
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
                            <div {...getRootProps({ className: 'drop-zone' })} ref={verifyObjectMethod2Ref}>
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
            <button
              disabled={mutableRows.length >= MAX_ROWS}
              onClick={handleAddMethod}
              className="add_method"
            >
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
function config(key: any, image_file_key: any, config: any, arg3: {
  level: any; // defaults to `public`
  download: boolean;
}) {
  throw new Error("Function not implemented.");
}

