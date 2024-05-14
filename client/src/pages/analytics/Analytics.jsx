import React, { useState } from "react";
import AnalyticsChart from "../../components/analyticsChart/AnalyticsChart";
import { MenuItem, Select, Typography } from "@mui/material";
import "./analytics.css";
import { useSelector } from "react-redux";
import { selectUser } from "../../slice/user";
import TransactionItem from "../../components/transactionItem/TransactionItem";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import DateTabs from "../../components/dateTabs/DateTabs";
import { useNavigate } from "react-router-dom";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import NoTransactionFound from "../../components/noTransaction/NoTransactionFound";

function descendingComparator(a, b, orderBy) {
  if (a?.sort === false || b?.sort === false) return 0;
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function sortFunction(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const Analytics = () => {
  const { expenses, income } = useSelector((state) => selectUser(state));
  const [dataSelector, setDataSelector] = useState("expenses");
  const [order, setOrder] = useState("desc");
  const [data, setData] = useState(expenses);
  const [selectedTab, setSelectedTab] = useState("day");
  const [selectedTransaction, setSelectedTransaction] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setDataSelector(e.target.value);
    switch (e.target.value) {
      case "expenses":
        setData(expenses);
        break;
      case "income":
        setData(income);
        break;
    }
  };

  const updateTab = (tab) => {
    setSelectedTab(tab);
  };

  const updateTransactionSelection = (id) => {
    setSelectedTransaction(
      data?.find((transaction) => transaction?.id === id)?.id
    );
  };

  const sortedData = React.useMemo(() => {
    return data && sortFunction(data, getComparator(order, "amount"));
  }, [data, order]);

  return (
    <div className="analytics-root">
      <div className="analytics-header">
        <KeyboardArrowLeftIcon
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
        />
        <div style={{ width: "100%" }}>
          <Typography
            style={{
              fontWeight: "bold",
            }}
          >
            Statistics
          </Typography>
        </div>
      </div>
      <div className="transaction-selection-area">
        {data?.length > 0 && (
          <DateTabs selectedTab={selectedTab} updateTab={updateTab} />
        )}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Select
            sx={{ height: "40px", width: data?.length > 0 ? "auto" : "100%" }}
            name="transactionStatus"
            value={dataSelector}
            onChange={handleChange}
            className="data-selection"
          >
            <MenuItem value={"expenses"}>Expense</MenuItem>
            <MenuItem value={"income"}>Income</MenuItem>
          </Select>
        </div>
        {data?.length > 0 && (
          <AnalyticsChart
            transactionData={data}
            xAxisOption={selectedTab}
            updateTransactionSelection={updateTransactionSelection}
          />
        )}
      </div>
      {data?.length > 0 ? (
        <div className="transactions-area">
          <div className="transactions-area-header">
            <Typography style={{ fontSize: "20px", fontWeight: "bold" }}>
              {dataSelector === "expenses" ? "Top Spendings" : "Top Earnings"}
            </Typography>
            <ArrowDownwardIcon
              style={{
                transform: order === "desc" ? "rotate(0deg)" : "rotate(180deg)",
              }}
              onClick={() =>
                setOrder((prev) => (prev === "desc" ? "asc" : "desc"))
              }
            />
          </div>
          <div className="transaction-area-content">
            {sortedData?.map((transaction) => {
              return (
                <div
                  key={transaction?.id}
                  className={`analytic-item ${
                    selectedTransaction === transaction?.id
                      ? "selected-item"
                      : ""
                  }`}
                >
                  <TransactionItem
                    key={transaction?.id}
                    data={transaction}
                    selected={selectedTransaction === transaction?.id}
                  />
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div style={{ marginTop: "30px" }}>
          <NoTransactionFound
            title={`No transaction found.\n Try changing the filters . . .`}
          />
        </div>
      )}
    </div>
  );
};

export default Analytics;
