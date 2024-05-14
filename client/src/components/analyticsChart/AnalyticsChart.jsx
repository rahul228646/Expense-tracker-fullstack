import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const AnalyticsChart = ({
  transactionData,
  xAxisOption,
  updateTransactionSelection,
}) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    switch (xAxisOption) {
      case "day":
        return date.toLocaleDateString("en-US", { weekday: "short" });
      case "week":
        const firstDayOfWeek = new Date(
          date.setDate(date.getDate() - date.getDay())
        );
        const lastDayOfWeek = new Date(
          date.setDate(date.getDate() - date.getDay() + 6)
        );
        return `${firstDayOfWeek.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })} - ${lastDayOfWeek.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })}`;
      case "month":
        return date.toLocaleDateString("en-US", { month: "short" });
      case "year":
        return date.toLocaleDateString("en-US", { year: "numeric" });
      default:
        return dateString;
    }
  };

  const handleChartClick = (event, elements) => {
    if (elements.length > 0) {
      const firstElement = elements[0];
      const index = firstElement.index;
      const selectedData = transactionData[index];
      updateTransactionSelection(selectedData?.id);
    }
  };

  const data = {
    labels: transactionData.map((transaction) => formatDate(transaction.date)),
    datasets: [
      {
        data: transactionData.map((transaction) => transaction.amount),
        fill: false,
        backgroundColor: "#2196f3",
        borderColor: "#2196f3",
        pointRadius: 5,
        pointHoverRadius: 7,
        tension: 0.4,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: false,
      },
    },

    scales: {
      x: {
        border: {
          display: false,
        },
        ticks: {
          display: true,
        },
        grid: {
          display: false,
        },
      },
      y: {
        display: false,
        grid: {
          display: false,
        },
      },
    },
    onClick: handleChartClick,
  };

  return <Line data={data} options={options} />;
};

export default AnalyticsChart;
