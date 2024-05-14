import React from "react";
import { dateTabs } from "../../constants";
import { Typography } from "@mui/material";
import "./dateTab.css";

const DateTabs = ({ selectedTab, updateTab }) => {
  return (
    <div className="date-tabs-root">
      {dateTabs?.map((tab, idx) => {
        return (
          <div
            key={tab?.id}
            className={`date-tab ${
              selectedTab === tab?.value ? "selected-tab" : ""
            }`}
            onClick={() => {
              updateTab(tab?.value);
            }}
          >
            <Typography>{tab.label}</Typography>
          </div>
        );
      })}
    </div>
  );
};

export default DateTabs;
