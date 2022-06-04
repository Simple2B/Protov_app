import React, { ReactElement, useEffect, useState } from "react";
import { useLocation } from "react-router";
import { useNavigate } from "react-router-dom";
import "./Add.css";
import { Storage } from 'aws-amplify';

const typeImages = ["jpeg", "jpg", "png", "svg", "gif", "ico"];

export default function AddSubmit(): ReactElement {
  const [status, setStatus] = useState<string>();
  const [check, setCheck] = useState<boolean>(false);
  const [objectFileKey, setObjectFileKey] = useState<string>("");
  const [imageMethod2Key, setImageMethod2Key] = useState<string>("");

  const [objectFileUrl, setObjectFileUrl] = useState<string>("");
  const [imageMethod2Url, setImageMethod2Url] = useState<string>("");
  const location: any = useLocation().state;
  const navigate = useNavigate();

  useEffect(() => {
    if (location.responseData.message.add_object_success) {
      setStatus("Success!");
      setObjectFileKey(location.responseData.message.object_file_key);
      setImageMethod2Key(location.responseData.message.image_method2_key);
    } else {
      setStatus("Fail!");
    }
  }, [location.responseData.message.add_object_success, location.responseData.message.image_method2_key, location.responseData.message.object_file_key]);

  const handleHome = () => {
    navigate("/");
  };

  const getFileUrl = async (key: string) => {
    const fileUrl = await Storage.get(key);
    return fileUrl;
  };

  useEffect(() => {
    if(objectFileKey.length > 0) {
      const getObjectFileUrl = async() => {
        const urlFile = await getFileUrl(objectFileKey)
        setObjectFileUrl(urlFile);
      }
      getObjectFileUrl()
    }

    if(imageMethod2Key.length > 0) {
      const getImageMethod2Url = async() => {
        const urlImageMethod2 = await getFileUrl(imageMethod2Key)
        setImageMethod2Url(urlImageMethod2);
      }
      getImageMethod2Url()
    }
  }, [imageMethod2Key, objectFileKey]);

  
  return (
    <div className="add_submit">
      <div className="header">
        <div className="header__back"></div>
        <div onClick={handleHome} className="header__main">
          <img src="/images/home.svg" className="back_main" alt="main"></img>
        </div>
      </div>
      <h1 className="add_submit-title">Add</h1>
      <div className="add_submit-info">
        {location.data.artist_firstname} {location.data.artist_surname},{" "}
        {location.data.title}, {location.data.year}
      </div>
      <div className="add_submit-id"><strong>owner password:</strong> {location.data.owner_id}</div>
      <div className="add_submit-id"><strong>object:</strong> {location.responseData.message.object}</div>

      { 
        (objectFileUrl.length > 0) && (
          <div className="add_submit-objects">
            {/* <div className="add_submit-objectsTitle">Uploaded {(objectFileUrl.length > 0 && imageMethod2Url.length > 0)? 'objects:' : 'object:'}</div> */}
            {
             location.responseData.message.object.length > 0 && typeImages.includes(location.responseData.message.object.split('.')[1]) ? (
                <div className="add_submit-object">
                  {/* <span className="add_submit-objectLink">1). Image of object</span> */}
                  <img src={objectFileUrl} alt={objectFileUrl} />
                </div>
             ) : location.responseData.message.object.length > 0 && (
                <div className="add_submit-objectLink">
                  1). <a href={objectFileUrl} target="_blank" rel="noreferrer">File of object</a>
                </div>
             )
            }
            

            {/* { location.responseData.message.methods2.length > 0 && typeImages.includes(location.responseData.message.methods2.split('.')[1]) ?
              (
                <div className="add_submit-object">
                  <span className="add_submit-objectLink">2). Image of object from method2</span>
                  <img src={imageMethod2Url} alt={imageMethod2Url} />
                </div>
              ) : location.responseData.message.methods2.length > 0 &&
              (
                <div className="add_submit-objectLink">
                  2). <a href={imageMethod2Url} target="_blank" rel="noreferrer"> File of object from method2</a>
                </div>
              )
            } */}
          </div>
        )
      }

      <div className="add_submit-id"><strong>object ID:</strong> {location.responseData.message.id_object}</div>

      <h2 className="verify_methods-title">Verification methods:</h2>
      <div>
        {location.responseData.message.methods1 ? <> <strong>methods1:</strong> {location.responseData.message.methods1}</> : null}
      </div>
      <div>
          {location.responseData.message.methods2 ? <> <strong>methods2:</strong> {location.responseData.message.methods2}</> : null}
      </div>
      <div
        className={
          status === "Success!"
            ? "verify_status-success"
            : "verify_status-error"
        }
      >
        {status}
      </div>

    </div>
  );
}
