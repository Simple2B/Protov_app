import {
  FormControl,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Theme } from "@emotion/react";
import React, { ReactElement, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Add.css";
import { axiosInstance } from "../../axios/axiosInstance";
import API3Response from "../../fake_api/API3_response.json";

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

export default function Add(): ReactElement {
  const [name, setName] = useState<string>("");
  const [surname, setSurname] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [image, setImage] = useState<string>("");
  const [year, setYear] = useState<string>("");
  const [finalKey, setFinalKey] = useState<string | undefined>("");
  const [mutableRows, setMutableRows] = useState<IMutableRow[]>([]);

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

  const handleName = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setName(event.target.value);
  };

  const handleSurname = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setSurname(event.target.value);
  };

  const handleTitle = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setTitle(event.target.value);
  };

  const handleYear = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    const clearValue = event.target.value.toString().replace(/\D/g, "");
    setYear(clearValue);
  };

  const handleImage = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setImage(event.target.value);
  };

  const handleKey = (event: {
    target: { value: React.SetStateAction<string | undefined> };
  }) => {
    setFinalKey(event.target.value);
  };

  const handleDeleteMethod = (index: number) => {
    console.log("index", index);
    const newArray = [...mutableRows];
    newArray.splice(index, 1);

    setMutableRows(newArray);
  };

  const handleSubmit = () => {
    const data = {
      artist_firstname: name,
      artist_surname: surname,
      title,
      year,
      artist_id: "",
      object_image: image,
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

    console.log(data);

    const fakeResponse = API3Response;

    navigate("/add-status", { state: { data, responseData: fakeResponse } });
  };

  return (
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
          <label className="uploading-label">
            <img src="/images/upload.svg" alt="upload" />
            <input
              value={image}
              onChange={handleImage}
              type="file"
              className="uploading-input"
            ></input>
          </label>
          <div className="uploading-text">Upload photo of object</div>
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

      <div className="add__buttons-container">
        <button
          disabled={mutableRows.length >= MAX_ROWS}
          onClick={handleAddMethod}
          className="add__method"
        >
          Add Method
        </button>
        <button onClick={handleSubmit} className="add__submit">
          Submit
        </button>
      </div>
    </div>
  );
}
