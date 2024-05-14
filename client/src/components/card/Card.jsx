import { Typography } from "@mui/material";
import React from "react";
import { selectUser } from "../../slice/user";
import { useSelector } from "react-redux";
import KeyboardDoubleArrowUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import "./card.css";

const Card = () => {
  const user = useSelector((state) => selectUser(state));
  return (
    <div className="card-root">
      <div className="card-header">
        <div className="balance">
          <Typography>Total Balance</Typography>
          <Typography className="total-amount">
            <span>$ </span>
            {user?.balance}
          </Typography>
        </div>
      </div>
      <div className="card-footer">
        <div className="income">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              color: "rgb(221, 221, 221)",
            }}
          >
            <KeyboardDoubleArrowUpIcon />
            <Typography style={{ color: "rgb(221, 221, 221)" }}>
              Income
            </Typography>
          </div>

          <Typography className="income-expense-amount">
            {" "}
            <span>$ </span>
            {user?.totalIncome}
          </Typography>
        </div>
        <div className="expense">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              color: "rgb(221, 221, 221)",
            }}
          >
            <KeyboardDoubleArrowDownIcon />
            <Typography style={{ color: "rgb(221, 221, 221)" }}>
              Expense
            </Typography>
          </div>
          <Typography className="income-expense-amount">
            {" "}
            <span>$ </span>
            {user?.totalExpense}
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default Card;
