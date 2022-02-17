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

const rows = [
  {
    artist: "Picasso",
    title: "Guernica",
    year: "1937",
    objectId: "4734698345",
  },
  {
    artist: "Picasso",
    title: "The Old Guitarist",
    year: "1904",
    objectId: "3457896454",
  },
];

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
  const location = useLocation().state;
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  console.log(location);

  const handleObjectId = (
    artist: string,
    title: string,
    year: string,
    objectId: string
  ) => {
    const data = { artist, title, year, objectId };
    console.log(data);

    if (location === "Provenance") navigate("/provenance", { state: data });
    if (location === "Verify owner") navigate("/verify-owner", { state: data });
    if (location === "Verify object")
      navigate("/verify-object", { state: data });
    if (location === "Transact") navigate("/transact", { state: data });
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
              {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.objectId}
                      classes={{ hover: classes.tableRow }}
                      onClick={() =>
                        handleObjectId(
                          row.artist,
                          row.title,
                          row.year,
                          row.objectId
                        )
                      }
                    >
                      <TableCell classes={{ root: classes.tableCell }}>
                        {row.artist}
                      </TableCell>
                      <TableCell classes={{ root: classes.tableCell }}>
                        {row.title}
                      </TableCell>
                      <TableCell classes={{ root: classes.tableCell }}>
                        {row.year}
                      </TableCell>
                      <TableCell classes={{ root: classes.tableCell }}>
                        {row.objectId}
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
