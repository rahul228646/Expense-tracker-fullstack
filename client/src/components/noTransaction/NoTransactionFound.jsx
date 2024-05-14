import { Typography } from "@mui/material";
import React from "react";

const NoTransactionFound = ({ title }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: "20px",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <img
        src="/src/assets/no_transaction.png"
        style={{ height: "10em", width: "10em" }}
      />
      <Typography
        style={{
          fontWeight: "bold",
          textAlign: "center",
          whiteSpace: "pre-wrap",
        }}
      >
        {title}
      </Typography>
    </div>
  );
};

export default NoTransactionFound;
