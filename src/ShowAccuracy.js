import React from "react";
import { Box, Grid, Card, CardContent, Typography } from "@mui/material";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function MetricsPage() {
  const metrics = {
    accuracy: 0.92,
    precision: 0.89,
    recall: 0.91,
    f1Score: 0.90,
  };

  const chartData = {
    labels: ["Accuracy", "Precision", "Recall", "F1 Score"],
    datasets: [
      {
        label: "Model Metrics",
        data: [
          metrics.accuracy * 100,
          metrics.precision * 100,
          metrics.recall * 100,
          metrics.f1Score * 100,
        ],
        backgroundColor: ["#4636FF", "#6941E2", "#EF5026", "#36CFC9"],
        borderColor: ["#4636FF", "#6941E2", "#EF5026", "#36CFC9"],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => `${tooltipItem.raw.toFixed(2)}%`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Model Metrics Dashboard
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Accuracy</Typography>
              <Typography variant="h4" color="primary">
                {(metrics.accuracy * 100).toFixed(2)}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Precision</Typography>
              <Typography variant="h4" color="secondary">
                {(metrics.precision * 100).toFixed(2)}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Recall</Typography>
              <Typography variant="h4" color="error">
                {(metrics.recall * 100).toFixed(2)}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">F1 Score</Typography>
              <Typography variant="h4" color="info">
                {(metrics.f1Score * 100).toFixed(2)}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Metrics Comparison Graph
              </Typography>
              <Bar data={chartData} options={chartOptions} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default MetricsPage;
