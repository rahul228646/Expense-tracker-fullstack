import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/home/Home";
import Add from "./pages/updateExpense/Add";
import Analytics from "./pages/analytics/Analytics";
import NavBar from "./components/navBar/NavBar";
import { useSelector } from "react-redux";
import { selectUserId } from "./slice/user";
import Welcome from "./pages/createUser/Welcome";

const ExpenseTracker = () => {
  const userId = useSelector((state) => selectUserId(state));
  return (
    <>
      <Router>
        {userId ? (
          <>
            <Routes>
              <Route exact path="/" element={<Home />} />
              <Route
                exact
                path="/add"
                element={<Add title="Add Expense" buttonText="Add" />}
              />
              <Route
                exact
                path="/edit"
                element={<Add title="Update Expense" buttonText="Update" />}
              />
              <Route exact path="/analytics" element={<Analytics />} />
            </Routes>
            <NavBar />
          </>
        ) : (
          <Routes>
            <Route exact path="/" element={<Welcome />} />
          </Routes>
        )}
      </Router>
    </>
  );
};

export default ExpenseTracker;
