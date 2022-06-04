import React, { ReactElement } from "react";
import { Theme } from "@emotion/react";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useLocation, useNavigate } from "react-router";
import "./Result.css";
import { API } from "aws-amplify";

const useStyle = makeStyles((theme: Theme) => ({
  root: {
    border: "1px solid #BAE4EA",
    borderRadius: "6px",
    fontFamily: "GT Walsheim Pro !important",
  },
  headerCellLeft: {
    borderTopLeftRadius: "6px",
    fontSize: "18px !important",
    fontFamily: "GT Walsheim Pro !important",
    borderBottom: "1px solid #BAE4EA !important",
    borderRight: "1px solid #BAE4EA !important",
  },
  headerCellRight: {
    borderTopRightRadius: "6px",
    fontSize: "18px !important",
    fontFamily: "GT Walsheim Pro !important",
    borderBottom: "1px solid #BAE4EA !important",
    borderRight: "1px solid #BAE4EA !important",
  },
  headerCell: {
    fontSize: "18px !important",
    fontFamily: "GT Walsheim Pro !important",
    borderBottom: "1px solid #BAE4EA !important",
    borderRight: "1px solid #BAE4EA !important",
  },
  tableCell: {
    fontFamily: "GT Walsheim Pro !important",
    fontSize: "16px !important",
    borderBottom: "1px solid #BAE4EA !important",
    borderRight: "1px solid #BAE4EA !important",
  },
  tableRow: {
    cursor: "pointer",
  },
}));

interface Column {
  id: "artist" | "title" | "year" | "objectId";
  label: string;
  minWidth?: number;
  align?: "left";
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: "artist", label: "Artist", minWidth: 150 },
  { id: "title", label: "Title", minWidth: 250 },
  {
    id: "year",
    label: "Year",
    minWidth: 250,
    align: "left",
  },
  {
    id: "objectId",
    label: "Object Id",
    minWidth: 390,
    align: "left",
  },
];

export default function Result(): ReactElement {
  const navigate = useNavigate();
  const location: any = useLocation().state;

  console.log("Result: location =>", location)

  const dataObjects = location.responseData.length > 0 ? location.responseData.map((item: { [x: string]: any; }) => 
    ({
        artist_id: item['artist_id'],
        search_item: item['search_item'],
        artist_surname: item['artist_surname'],
        artist_firstname: item['artist_firstname'],
        title: item['title'],
        year: item['year'],
        id_object: item['id_object']
    })) : null
  const handleObjectId = (
    artist_id: string,
    artist_firstname: string,
    artist_surname: string,
    title: string,
    year: string,
    id_object: string
  ) => {
    const data = {artist_firstname, artist_surname, title, year, id_object, artist_id};
    
    const getObjectTransaction = async () => {
      const dataObject = await API.get('protovapi', `/transactionobject/${id_object}`, {})
      navigate("/provenance", {
        state: {
          data,
          responseData: dataObject.data,
          allData: dataObjects,
        },
      });
    };

    if (location.searchItem === "Provenance") getObjectTransaction();
    
    if (location.searchItem === "Verify owner"){
      navigate("/verify-owner", {
        state: { data, allData: dataObjects },
      });
    };
    
    if (location.searchItem === "Verify object")
      navigate("/verify-object", {
        state: { data, allData: dataObjects },
      });

    if (location.searchItem === "Transact")
      navigate("/transact", {
        state: { data, allData: dataObjects },
      });
  };

  const classes = useStyle();

  const handleBack = () => {
    navigate("/enter-info", {state: { search_item: dataObjects ? dataObjects[0].search_item : location.searchItem}});
  };

  const handleHome = () => {
    navigate("/");
  };

  return (
    <div className="result">
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
      <h1 className="result__title">Search Result</h1>

      <div className="provenance__table">
        <TableContainer sx={{ maxWidth: "100%" }}>
          <Table
            classes={{ root: classes.root }}
            stickyHeader
            aria-label="sticky table"
          >
            <TableHead>
              <TableRow>
                <TableCell classes={{ root: classes.headerCellLeft }}>
                  {columns[0].label}
                </TableCell>
                <TableCell classes={{ root: classes.headerCell }}>
                  {columns[1].label}
                </TableCell>
                <TableCell
                  classes={{ root: classes.headerCell }}
                  align={columns[2].align}
                >
                  {columns[2].label}
                </TableCell>
                <TableCell
                  classes={{ root: classes.headerCellRight }}
                  align={columns[3].align}
                >
                  {columns[3].label}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dataObjects && dataObjects.map((row: any, index: number) => {
                return (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={index}
                    classes={{ hover: classes.tableRow }}
                    onClick={() =>
                      handleObjectId(
                        row.artist_id,
                        row.artist_firstname,
                        row.artist_surname,
                        row.title,
                        row.year,
                        row.id_object
                      )
                    }
                  >
                    <TableCell classes={{ root: classes.tableCell }}>
                      {row.artist_surname}
                    </TableCell>
                    <TableCell classes={{ root: classes.tableCell }}>
                      {row.title}
                    </TableCell>
                    <TableCell classes={{ root: classes.tableCell }}>
                      {row.year}
                    </TableCell>
                    <TableCell classes={{ root: classes.tableCell }}>
                      {row.id_object}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}
