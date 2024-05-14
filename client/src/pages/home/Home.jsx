import React, { useEffect, useState } from "react";
import "./home.css";
import Background from "../../components/background/Background";
import { CircularProgress, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import Card from "../../components/card/Card";
import TransactionItem from "../../components/transactionItem/TransactionItem";
import { getUserInfo, selectUser, selectUserLoading } from "../../slice/user";
import NoTransactionFound from "../../components/noTransaction/NoTransactionFound";
import { getComparator, sortFunction } from "../../utils";

const Home = () => {
  const user = useSelector((state) => selectUser(state));
  const loading = useSelector((state) => selectUserLoading(state));
  const [transctions, setTransactions] = useState();

  useEffect(() => {
    setTransactions(user?.transactions);
  }, [user]);

  const sortedTransactions = React.useMemo(() => {
    return (
      transctions && sortFunction(transctions, getComparator("desc", "date"))
    );
  }, [transctions]);

  return (
    <div className="home-root">
      <Background />
      <div className="home-header">
        <Typography className="home-greeting">Good afternoon</Typography>
        <Typography className="home-name">{user?.name}</Typography>
      </div>
      <div style={{ marginTop: "20px" }}>
        <Card />
      </div>

      {loading || user?.transactions?.length > 0 ? (
        <div className="transaction-data">
          <Typography className="transaction-data-title">
            Transaction History
          </Typography>
          {sortedTransactions?.map((transaction) => {
            return <TransactionItem key={transaction?.id} data={transaction} />;
          })}
        </div>
      ) : loading ? (
        <div style={{ marginTop: "20px" }}>
          <CircularProgress />
        </div>
      ) : (
        <div style={{ marginTop: "20px" }}>
          <NoTransactionFound title={"No transaction found"} />
        </div>
      )}
    </div>
  );
};

export default Home;
