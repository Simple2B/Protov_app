import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Theme,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { ReactElement } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Provenance.css";

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
}));

interface Column {
  id: "ownerID" | "action" | "verificationMethods" | "date";
  label: string;
  minWidth?: number;
  align?: "left";
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: "ownerID", label: "Owner ID", minWidth: 150 },
  { id: "date", label: "Date", minWidth: 250 },
  {
    id: "action",
    label: "Action",
    minWidth: 250,
    align: "left",
    format: (value: number) => value.toLocaleString("en-US"),
  },
  {
    id: "verificationMethods",
    label: "Verification methods",
    minWidth: 390,
    align: "left",
    format: (value: number) => value.toLocaleString("en-US"),
  },
];

export default function Provenance(): ReactElement {
  const classes = useStyle();
  const location: any = useLocation().state;

  const navigate = useNavigate();
  const handleBack = () => {
    navigate("/result", {
      state: { searchItem: "Provenance", responseData: location.allData },
    });
  };

  const handleHome = () => {
    navigate("/");
  };
  return (
    <div className="provenance">
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

      <h1 className="provenance__title">Provenance</h1>
      <div className="provenance__address">
        {location.data.artist_surname}, {location.data.title},{" "}
        {location.data.year}
      </div>
      <div className="provenance__id">object ID: {location.data.id_object}</div>
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
              {Object.values(location.responseData).map((row: any) => {
                return (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={row.owner_id}
                  >
                    <TableCell classes={{ root: classes.tableCell }}>
                      {row.owner_id}
                    </TableCell>
                    <TableCell classes={{ root: classes.tableCell }}>
                      {row.date}
                    </TableCell>
                    <TableCell classes={{ root: classes.tableCell }}>
                      {row.action}
                    </TableCell>
                    <TableCell classes={{ root: classes.tableCell }}>
                      {Object.keys(row.verification_methods).length === 1 ? (
                        Object.keys(row.verification_methods)
                      ) : (
                        <>
                          {Object.keys(row.verification_methods)[0]}
                          {", "}
                          {Object.keys(row.verification_methods)[1]}
                        </>
                      )}
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
