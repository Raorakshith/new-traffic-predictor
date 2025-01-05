// import React, { useEffect, useState } from "react";
// import { Box, Grid, Card, CardContent, Typography } from "@mui/material";
// import { Bar } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";
// import {
//   Container,
//   Button,
//   CircularProgress,
//   Paper,
//   List,
//   ListItem,
//   ListItemText,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   TextField,
//   Select,
//   MenuItem,
//   InputLabel,
//   FormControl,
//   Drawer,
//   IconButton,
//   AppBar,
//   Toolbar,
// } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import { styled } from "@mui/system";
// import MenuIcon from "@mui/icons-material/Menu";
// // Register Chart.js components
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend
// );

// function MetricsPage() {
//   const metrics = {
//     accuracy: 0.945,
//     precision: 0.93,
//     recall: 0.91,
//     f1Score: 0.9,
//   };
//   const DrawerContent = styled(Box)({
//     width: 250,
//     padding: "1rem",
//     backgroundColor: "#f5f5f5",
//   });
//   const chartData = {
//     labels: ["Accuracy", "Precision", "Recall", "F1 Score"],
//     datasets: [
//       {
//         label: "Model Metrics",
//         data: [
//           metrics.accuracy * 100,
//           metrics.precision * 100,
//           metrics.recall * 100,
//           metrics.f1Score * 100,
//         ],
//         backgroundColor: ["#4636FF", "#6941E2", "#EF5026", "#36CFC9"],
//         borderColor: ["#4636FF", "#6941E2", "#EF5026", "#36CFC9"],
//         borderWidth: 1,
//       },
//     ],
//   };

//   const chartOptions = {
//     responsive: true,
//     plugins: {
//       legend: {
//         display: true,
//         position: "top",
//       },
//       tooltip: {
//         callbacks: {
//           label: (tooltipItem) => `${tooltipItem.raw.toFixed(2)}%`,
//         },
//       },
//     },
//     scales: {
//       y: {
//         beginAtZero: true,
//         max: 100,
//       },
//     },
//   };
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const navigate = useNavigate();
//   const [userData, setuserData] = useState();
//   const getUserData = () => {
//     const userData = localStorage.getItem("user");
//     return userData ? JSON.parse(userData) : null;
//   };

//   useEffect(() => {
//     setuserData(getUserData());
//   }, []);

//   return (
//     <>
//       <AppBar position="static" sx={{ backgroundColor: "#334455" }}>
//         <Toolbar>
//           <IconButton
//             edge="start"
//             color="inherit"
//             aria-label="menu"
//             onClick={() => setDrawerOpen(true)}
//           >
//             <MenuIcon />
//           </IconButton>
//           <Typography variant="h6" sx={{ flexGrow: 1 }}>
//             Traffix Route Planner
//           </Typography>
//         </Toolbar>
//       </AppBar>

//       <Drawer
//         anchor="left"
//         open={drawerOpen}
//         onClose={() => setDrawerOpen(false)}
//         style={{
//           width: "300px",
//           backgroundColor: "#2c3e50", // Dark background for a modern look
//           color: "#ecf0f1", // Light text for contrast
//           padding: "10px",
//         }}
//       >
//         <DrawerContent
//           style={{
//             padding: "20px",
//             display: "flex",
//             flexDirection: "column",
//             height: "100%",
//           }}
//         >
//           <Typography
//             variant="h6"
//             style={{
//               color: "#5b5b5b",
//               fontWeight: "bold",
//               marginBottom: "20px",
//               textAlign: "center",
//               borderBottom: "1px solid #7f8c8d",
//               paddingBottom: "10px",
//             }}
//           >
//             TraffiX
//           </Typography>
//           <List style={{ flexGrow: 1 }}>
//             <ListItem button style={{ marginBottom: "10px" }}>
//               <ListItemText
//                 primary="Dashboard"
//                 primaryTypographyProps={{
//                   style: {
//                     fontSize: "16px",
//                     fontWeight: "500",
//                     color: "#5b5b5b",
//                   },
//                 }}
//                 onClick={() => {
//                   navigate("/dashboard");
//                 }}
//               />
//             </ListItem>
//             <ListItem button style={{ marginBottom: "10px" }}>
//               <ListItemText
//                 primary="Route Plan"
//                 primaryTypographyProps={{
//                   style: {
//                     fontSize: "16px",
//                     fontWeight: "500",
//                     color: "#5b5b5b",
//                   },
//                 }}
//                 onClick={() => {
//                   navigate("/route-plan");
//                 }}
//               />
//             </ListItem>
//             {userData?.userType === "Admin" && (
//               <>
//                 <ListItem button style={{ marginBottom: "10px" }}>
//                   <ListItemText
//                     primary="Block Routes"
//                     primaryTypographyProps={{
//                       style: {
//                         fontSize: "16px",
//                         fontWeight: "500",
//                         color: "#5b5b5b",
//                       },
//                     }}
//                     onClick={() => {
//                       navigate("/block-map");
//                     }}
//                   />
//                 </ListItem>
//                 <ListItem button style={{ marginBottom: "10px" }}>
//                   <ListItemText
//                     primary="Metrics"
//                     primaryTypographyProps={{
//                       style: {
//                         fontSize: "16px",
//                         fontWeight: "500",
//                         color: "#5b5b5b",
//                       },
//                     }}
//                     onClick={() => {
//                       navigate("/metrics");
//                     }}
//                   />
//                 </ListItem>
//               </>
//             )}
//           </List>
//           <div
//             style={{
//               textAlign: "center",
//               borderTop: "1px solid #7f8c8d",
//               padding: "10px 0",
//               marginTop: "20px",
//             }}
//           >
//             <Typography
//               variant="caption"
//               style={{ color: "#bdc3c7", fontSize: "12px" }}
//             >
//               © 2024 Traffic Insights
//             </Typography>
//           </div>
//         </DrawerContent>
//       </Drawer>
//       <Box sx={{ padding: 3 }}>
//         <Typography variant="h4" gutterBottom>
//           Model Metrics Dashboard
//         </Typography>
//         <Grid container spacing={4}>
//           <Grid item xs={12} md={4}>
//             <Card>
//               <CardContent>
//                 <Typography variant="h6">Accuracy</Typography>
//                 <Typography variant="h4" color="primary">
//                   {(metrics.accuracy * 100).toFixed(2)}%
//                 </Typography>
//               </CardContent>
//             </Card>
//           </Grid>
//           <Grid item xs={12} md={4}>
//             <Card>
//               <CardContent>
//                 <Typography variant="h6">Precision</Typography>
//                 <Typography variant="h4" color="secondary">
//                   {(metrics.precision * 100).toFixed(2)}%
//                 </Typography>
//               </CardContent>
//             </Card>
//           </Grid>
//           <Grid item xs={12} md={4}>
//             <Card>
//               <CardContent>
//                 <Typography variant="h6">Recall</Typography>
//                 <Typography variant="h4" color="error">
//                   {(metrics.recall * 100).toFixed(2)}%
//                 </Typography>
//               </CardContent>
//             </Card>
//           </Grid>
//           <Grid item xs={12} md={4}>
//             <Card>
//               <CardContent>
//                 <Typography variant="h6">F1 Score</Typography>
//                 <Typography variant="h4" color="info">
//                   {(metrics.f1Score * 100).toFixed(2)}%
//                 </Typography>
//               </CardContent>
//             </Card>
//           </Grid>
//           <Grid item xs={12}>
//             <Card>
//               <CardContent>
//                 <Typography variant="h6" gutterBottom>
//                   Metrics Comparison Graph
//                 </Typography>
//                 <Bar data={chartData} options={chartOptions} />
//               </CardContent>
//             </Card>
//           </Grid>
//         </Grid>
//       </Box>
//     </>
//   );
// }

// export default MetricsPage;

import React, { useEffect, useState } from "react";
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
import {
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/system";
import MenuIcon from "@mui/icons-material/Menu";
import TrafficVisualizations from "./components/TrafficVisualizations";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function MetricsPage() {
  const [metrics, setMetrics] = useState({
    accuracy: 0,
    precision: 0,
    recall: 0,
    f1Score: 0,
  });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const DrawerContent = styled(Box)({
    width: 250,
    padding: "1rem",
    backgroundColor: "#f5f5f5",
  });

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

  const fetchMetrics = async () => {
    try {
      const response = await fetch("http://localhost:5000/get_model_metrics");
      const data = await response.json();

      if (data.status === "success") {
        const { Accuracy, Precision, Recall, "F1 Score": F1Score } = data.metrics.svm_metrics;
        setMetrics({
          accuracy: Accuracy,
          precision: Precision,
          recall: Recall,
          f1Score: F1Score,
        });
      } else {
        console.error("Failed to fetch metrics:", data);
      }
    } catch (error) {
      console.error("Error fetching metrics:", error);
    }
  };
const [userData, setuserData] = useState();

  const getUserData = () => {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  };
  useEffect(() => {
    fetchMetrics();
    setuserData(getUserData());
  }, []);

  const chartData = {
    labels: ["Accuracy", "Precision", "Recall", "F1 Score"],
    datasets: [
      {
        label: "SVM Model Metrics",
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

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: "#334455" }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => setDrawerOpen(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Traffix Route Planner
          </Typography>
        </Toolbar>
      </AppBar>

       <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                style={{
                  width: "300px",
                  backgroundColor: "#2c3e50", // Dark background for a modern look
                  color: "#ecf0f1", // Light text for contrast
                  padding: "10px",
                }}
              >
                <DrawerContent
                  style={{
                    padding: "20px",
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                  }}
                >
                  <Typography
                    variant="h6"
                    style={{
                      color: "#5b5b5b",
                      fontWeight: "bold",
                      marginBottom: "20px",
                      textAlign: "center",
                      borderBottom: "1px solid #7f8c8d",
                      paddingBottom: "10px",
                    }}
                  >
                    TraffiX
                  </Typography>
                  <List style={{ flexGrow: 1 }}>
                    <ListItem button style={{ marginBottom: "10px" }}>
                      <ListItemText
                        primary="Dashboard"
                        primaryTypographyProps={{
                          style: {
                            fontSize: "16px",
                            fontWeight: "500",
                            color: "#5b5b5b",
                          },
                        }}
                        onClick={() => {
                          navigate("/dashboard");
                        }}
                      />
                    </ListItem>
                    <ListItem button style={{ marginBottom: "10px" }}>
                      <ListItemText
                        primary="Route Plan"
                        primaryTypographyProps={{
                          style: {
                            fontSize: "16px",
                            fontWeight: "500",
                            color: "#5b5b5b",
                          },
                        }}
                        onClick={() => {
                          navigate("/route-plan");
                        }}
                      />
                    </ListItem>
                    {userData?.userType === "Admin" && (
                      <>
                        <ListItem button style={{ marginBottom: "10px" }}>
                          <ListItemText
                            primary="Block Routes"
                            primaryTypographyProps={{
                              style: {
                                fontSize: "16px",
                                fontWeight: "500",
                                color: "#5b5b5b",
                              },
                            }}
                            onClick={() => {
                              navigate("/block-map");
                            }}
                          />
                        </ListItem>
                        <ListItem button style={{ marginBottom: "10px" }}>
                          <ListItemText
                            primary="Metrics"
                            primaryTypographyProps={{
                              style: {
                                fontSize: "16px",
                                fontWeight: "500",
                                color: "#5b5b5b",
                              },
                            }}
                            onClick={() => {
                              navigate("/metrics");
                            }}
                          />
                        </ListItem>
                      </>
                    )}
                  </List>
                  <div
                    style={{
                      textAlign: "center",
                      borderTop: "1px solid #7f8c8d",
                      padding: "10px 0",
                      marginTop: "20px",
                    }}
                  >
                    <Typography
                      variant="caption"
                      style={{ color: "#bdc3c7", fontSize: "12px" }}
                    >
                      © 2024 Traffic Insights
                    </Typography>
                  </div>
                </DrawerContent>
              </Drawer>

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
        <TrafficVisualizations/>
      </Box>
    </>
  );
}

export default MetricsPage;
