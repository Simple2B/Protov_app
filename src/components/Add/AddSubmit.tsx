import React, { ReactElement, useEffect, useState } from "react";
import { useLocation } from "react-router";
import { useNavigate } from "react-router-dom";
import "./Add.css";
import { Storage } from 'aws-amplify';

const typeImages = ["jpeg", "jpg", "png", "svg", "gif", "ico"];

export default function AddSubmit(): ReactElement {
  const [status, setStatus] = useState<string>();
  const [objectFileUrl, setObjectFileUrl] = useState<string>("");
  console.log("ADD: objectFileUrl ", objectFileUrl);
  const location: any = useLocation().state;
  const navigate = useNavigate();

  const getObjectFileUrl = async () => {
    try {
      if (location.responseData.message.add_object_success){
        const urlFile = await Storage.get(location.responseData.message.image_file_key);
        setObjectFileUrl(urlFile);
      }
    } catch (error) {
        console.error("error accessing the Image from s3", error);
        setObjectFileUrl("");
    }
  };

  useEffect(() => {
      getObjectFileUrl();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.responseData.message.add_object_success, location.responseData.message.image_file_key]);

  useEffect(() => {
      if (location.responseData.message.add_object_success) {
          setStatus("Success!");
      } else {
          setStatus("Fail!");
      }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.responseData.message.add_object_success, location.responseData.message.image_file_key, objectFileUrl.length]);

  const handleHome = () => {
      navigate("/");
  };
  
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
      <div className="add_submit-id"><strong>owner password:</strong> {location.data.owner_id} {" "} {location.data.new_owner_id}</div>
      <div className="add_submit-id"><strong>object:</strong> {location.responseData.message.object}</div>

      { 
        objectFileUrl.length > 0 && (
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
