import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import HomeIcon from "@mui/icons-material/Home";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import SignalCellularAltRoundedIcon from "@mui/icons-material/SignalCellularAltRounded";
import "./navBar.css";
import { useLocation, useNavigate } from "react-router-dom";

const NavBar = () => {
  const [value, setValue] = React.useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    if (location.pathname === "/") {
      setValue(0);
    } else if (location.pathname === "/edit") {
      setValue(1);
    } else {
      setValue(2);
    }
  }, [location]);

  return (
    <Box sx={{ width: "100%" }} className="nav-bar-root">
      <BottomNavigation
        value={value}
        onChange={(e, newValue) => {
          newValue === 0
            ? navigate("/")
            : newValue === 1
            ? navigate("/add")
            : navigate("analytics");
          setValue(newValue);
        }}
      >
        <BottomNavigationAction
          icon={<HomeIcon style={{ height: "40px", width: "40px" }} />}
        />
        <BottomNavigationAction
          icon={
            <AddCircleRoundedIcon style={{ height: "40px", width: "40px" }} />
          }
        />
        <BottomNavigationAction
          icon={
            <SignalCellularAltRoundedIcon
              style={{ height: "40px", width: "40px" }}
            />
          }
        />
      </BottomNavigation>
    </Box>
  );
};

export default NavBar;
