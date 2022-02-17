import { FormControl, Select, MenuItem } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Theme } from "@emotion/react";
import React, { ReactElement, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Add.css";

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

export default function Add(): ReactElement {
  const [artistKey, setArtistKey] = useState<string>("Artist key");
  const [showInput, setShowInput] = useState<boolean>(false);
  const [countInput, setCountInput] = useState<number[]>([]);
  const [methodSelect1, setMethodSelect1] = useState<string>("method1");
  const [methodSelect2, setMethodSelect2] = useState<string>("method1");
  const [value1, setValue1] = useState<string>("");
  const [value2, setValue2] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [surname, setSurname] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [image, setImage] = useState<string>("");
  const [year, setYear] = useState<string>("");
  const [newKey, setNewKey] = useState<string>();
  const [finalKey, setFinalKey] = useState<string | undefined>("");

  const navigate = useNavigate();
  const classes = useStyle();

  const handleBack = () => {
    navigate("/");
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
    setYear(event.target.value);
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

  const handleSubmit = () => {
    const data = {
      name,
      surname,
      title,
      year,
      id: finalKey !== "" ? finalKey : artistKey,
      methods: {
        methodSelect1: value1,
        methodSelect2: value2,
      },
    };

    navigate("/add-status", { state: data });
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
            type="text"
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
        <div className="add__inputs-block">
          <input
            value={artistKey}
            placeholder="Artist key"
            type="text"
            className="add__input"
            readOnly
          />
          <input
            value={newKey}
            onChange={handleKey}
            placeholder="New key"
            type="text"
            className="add__input"
          />
        </div>
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
                    value="method1"
                  >
                    Method1
                  </MenuItem>
                  <MenuItem value="method2">Method2</MenuItem>
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
            </div>
          );
        })}

      <div className="add__buttons-container">
        <button onClick={handleAddMethod} className="add__method">
          Add Method
        </button>
        <button onClick={handleSubmit} className="add__submit">
          Submit
        </button>
      </div>
    </div>
  );
}
