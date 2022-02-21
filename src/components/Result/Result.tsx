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
import React, { ReactElement } from "react";
import { useLocation, useNavigate } from "react-router";
import "./Result.css";
import API6Response from "../../fake_api/API6_response.json";
import { axiosInstance } from "../../axios/axiosInstance";

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

  const handleObjectId = (
    artist_surname: string,
    title: string,
    year: string,
    object_id: string
  ) => {
    const data = { artist_surname, title, year, object_id };
    axiosInstance.post("/", object_id).then(function (response) {
      // const responseData = response.data;
    });
    const fakeResponse = API6Response;

    if (location.searchItem === "Provenance")
      navigate("/provenance", {
        state: {
          data,
          responseData: fakeResponse,
          allData: location.responseData,
        },
      });
    if (location.searchItem === "Verify owner")
      navigate("/verify-owner", {
        state: { data, allData: location.responseData },
      });
    if (location.searchItem === "Verify object")
      navigate("/verify-object", {
        state: { data, allData: location.responseData },
      });
    if (location.searchItem === "Transact")
      navigate("/transact", {
        state: { data, allData: location.responseData },
      });
  };

  const classes = useStyle();

  const handleBack = () => {
    navigate("/enter-info");
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
        <TableContainer sx={{ width: 1043 }}>
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
              {location.responseData.map((row: any) => {
                return (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={row.object_id}
                    classes={{ hover: classes.tableRow }}
                    onClick={() =>
                      handleObjectId(
                        row.artist_surname,
                        row.title,
                        row.year,
                        row.object_id
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
                      {row.object_id}
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
