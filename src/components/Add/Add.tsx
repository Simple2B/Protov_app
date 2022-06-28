import {
  FormControl,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Theme } from "@emotion/react";
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Add.css";
import Dropzone from 'react-dropzone';
import { API, Storage } from 'aws-amplify';
import { v4 as uuid } from "uuid";
import Loader from "../Loader/Loader";


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


const Add = () =>  {
  const [name, setName] = useState<string>("");
  const [surname, setSurname] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [year, setYear] = useState<string>("");

  const [image, setImage] = useState();
  
  const [mutableRows, setMutableRows] = useState<IMutableRow[]>([]); 

  const [file, setFile] = useState<File[] | null>(null); // state for storing actual image
  const [isOpen, setOpen] = useState<boolean>(false);
  
  const dropRef: any = useRef();

  const [fileMethod2, setFileMethod2] = useState<File[] | null>(null);
  const [isOpenMethod2, setOpenMethod2] = useState<boolean>(false);

  const [isLoad, setLoad] = useState(false);

  const dropMethod2Ref: any = useRef();

  const navigate = useNavigate();
  const classes = useStyle();

  const handleBack = () => {
    navigate("/");
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

  const handleSelectChange = (
    index: number,
    event: SelectChangeEvent<InputMethod>
  ) => {
    setMutableRows((prev) =>
      
      prev.map((row, idx) => {

        console.log("handleSelectChange: prev => ", prev);
        console.log("handleSelectChange: row => ", row);
        console.log("handleSelectChange: idx => ", idx);

        if (idx === index) {
          row.method = event.target.value as InputMethod;
        }
        if (row.method === 1) {
            console.log("handleSelectChange: row.method === 1", {method: 1, value: ''});
            return {method: 1, value: ''}
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
        if (row.method === 1) {
          console.log("handleInputChange: row.method === 1", {method: 1, value: ''});
          return {method: 1, value: ''}
        }
        return row;
      })
    );
  };

  const handleName = (event: {
    target: { value: string };
  }) => {
    const artistName = event.target.value.trim().toLowerCase()
    setName(artistName);
  };

  const handleSurname = (event: {
    target: { value: string };
  }) => {
    const surnameName = event.target.value.trim().toLowerCase()
    setSurname(surnameName);
  };

  const handleTitle = (event: {
    target: { value: string };
  }) => {
    const objectTitle = event.target.value.trim().toLowerCase()
    setTitle(objectTitle);
  };

  const handleYear = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    const clearValue = event.target.value.toString().replace(/\D/g, "");
    setYear(clearValue);
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

  const uploadFile = (e: { preventDefault: () => void; }) => {
    e.preventDefault()
    const fileKey = file ? `${uuid()}_${file[0].name}` : '';
    const fileMethod2Key = fileMethod2 ? `${uuid()}_${fileMethod2[0].name}` : '';
    if (file) {
      Storage.put(`${fileKey}`, file[0], {
        contentType: file[0].type,
      })
        .then((res) => {
          console.log("file key => ", res.key)
        })
        .catch((err) => {
          console.log("err ", err)
        })
    } else {
      console.log("uploadFile: ", "Files needed")
    }
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
    const dataToBack = {
        artist_firstname: name,
        artist_surname: surname,
        object_image: file ? file[0].name : "",
        image_file_key: file ? fileKey : "",
        methods1: methods1 !== undefined ? methods1 : "",
        methods2: fileMethod2 ? fileMethod2[0].name : "",
        image_method2_key: fileMethod2 ? fileMethod2Key : "",
        artist_id: "",
        title: title,
        year: year,
    };
    const createAwsObject = async() => {
      setLoad(true);
      const awsObject = await API.post('protovapi', '/protovobject', {body: dataToBack});
      console.log(" awsObject => ", awsObject);
      if (awsObject.message.add_object_success === 'true') {
        setLoad(false);
        const data = {
          artist_firstname: awsObject.message.artist_firstname.trim(),
          artist_surname: awsObject.message.artist_surname.trim(),
          title: title.trim(),
          year: year.trim(),
          artist_id: awsObject.message.artist_id,
          owner_id: awsObject.message.owner_id,
          new_owner_id: awsObject.message.new_owner_id,
          object_image: image,
          methods: {
            methods1: methods1 !== undefined ? methods1 : "",
            methods2: fileMethod2 ? fileMethod2[0].name : "",
          },
        };

        navigate("/add-status", { state: { data, responseData: awsObject } });
      }
    }
    createAwsObject();
    setFile(null);
    setOpen(false); 
    setFileMethod2(null);
    setOpenMethod2(false);
  }

  const onDrop = (uploadedFile: any) => {
      console.log(" uploadedFile ", uploadedFile);
      setFile(uploadedFile);
      setOpen(true);
  }

  const onDropMethod2 = (uploadedFile: any) => {
      setFileMethod2(uploadedFile);
      setOpenMethod2(true);
  }


  const handleClose = () => {
    setOpen(false);
    setFile(null);
    setFileMethod2(null);
  };


  return (
    <div className={isLoad ? "addContainer": ""}>
      <div className="add">
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

        <h1 className="add__title">Add</h1>

        <div className="add__inputs-container">
          <div className="add__inputs-block">
            <input
              value={name}
              onChange={handleName}
              placeholder="Artist First Name"
              type="text"
              className="add__input"
            />
            <input
              value={surname}
              onChange={handleSurname}
              placeholder="Artist Surname"
              type="text"
              className="add__input"
            />
          </div>
          <div className="add__inputs-block">
            <input
              value={title}
              onChange={handleTitle}
              placeholder="Title"
              type="text"
              className="add__input"
            />
            <input
              value={year}
              onChange={handleYear}
              placeholder="Year"
              className="add__input"
            />
          </div>

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
                    <div {...getRootProps({ className: 'drop-zone' })} ref={dropRef}>
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
                                  // onChange={(e) => {
                                  //   handleInputChange(index, e);
                                  // }}
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
        <div className="add__buttons-container">
          <button
            disabled={mutableRows.length >= MAX_ROWS}
            onClick={handleAddMethod}
            className="add__method"
          >
            Add Method
          </button>
          <button onClick={uploadFile} className="add__submit">
            Submit
          </button>
        </div>
      </div>
      {isLoad && <Loader/>}
    </div>
  );
};

export default Add;