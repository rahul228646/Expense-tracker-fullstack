import React, { useEffect, useState } from "react";
import Background from "../../components/background/Background";
import { Button, TextField, Typography } from "@mui/material";
import "./welcome.css";
import { useDispatch, useSelector } from "react-redux";
import { createUser, selectUserId, selectUserLoading } from "../../slice/user";
import axios from "axios";

const Welcome = () => {
  const [userInfo, setUserInfo] = useState();
  const userId = useSelector((state) => selectUserId(state));
  const loading = useSelector((state) => selectUserLoading(state));
  const dispatch = useDispatch();
  const handleChange = (e) => {
    setUserInfo((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createUser({ userInfo }));
  };

  if (userId) {
    navigate("/home");
  }
  return (
    <div className="welcome-root">
      <Background />
      <Typography
        sx={{
          fontSize: "24px",
          fontWeight: "bold",
          textAlign: "center",
          color: "white",
        }}
      >
        Welcome to Expense Tracker App
      </Typography>
      <Typography
        sx={{
          fontSize: "16px",
          fontWeight: "semibold",
          textAlign: "center",
          color: "white",
          marginTop: "20px",
        }}
      >
        Enter your details to continue
      </Typography>
      <form className="form-root">
        <div className="form-item">
          <label>Name</label>

          <TextField
            variant="outlined"
            onChange={handleChange}
            name="name"
            value={userInfo?.name}
          />
        </div>

        <div className="form-item">
          <label>Balance</label>

          <TextField
            type="number"
            variant="outlined"
            onChange={handleChange}
            name="balance"
            value={userInfo?.balance}
          />
        </div>

        <Button
          type="submit"
          style={{ height: "54px", marginTop: "24px" }}
          variant="contained"
          loading={loading}
          onClick={handleSubmit}
          disabled={!userInfo?.name || !userInfo?.balance}
        >
          Continue
        </Button>
      </form>
    </div>
  );
};

export default Welcome;
