// import React, { useEffect, useState } from "react";
// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import axios from "axios";
// import {
//   AppBar,
//   Toolbar,
//   Tabs,
//   Tab,
//   Button,
//   Card,
//   CardContent,
//   Typography,
//   Grid,
//   Container,
//   Box,
// } from "@mui/material";
// import LocationOnIcon from "@mui/icons-material/LocationOn";
// import WbSunnyIcon from "@mui/icons-material/WbSunny";
// import TrafficIcon from "@mui/icons-material/Traffic";
// import { makeStyles } from "@mui/styles";

// const useStyles = makeStyles({
//   appBar: {
//     background: "linear-gradient(90deg, #6a11cb, #2575fc)",
//     boxShadow: "0px 4px 20px rgba(0,0,0,0.2)",
//   },
//   heroSection: {
//     background: "linear-gradient(120deg, #f6d365, #fda085)",
//     color: "#fff",
//     borderRadius: "12px",
//     padding: "3rem 2rem",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//     marginBottom: "2rem",
//   },
//   heroContent: {
//     flex: 1,
//     paddingRight: "2rem",
//   },
//   heroImage: {
//     flex: 1,
//     maxWidth: "400px",
//   },
//   card: {
//     background: "#ffffff",
//     boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
//     borderRadius: "8px",
//     padding: "1.5rem",
//     textAlign: "center",
//     transition: "transform 0.2s ease",
//     "&:hover": {
//       transform: "scale(1.05)",
//     },
//   },
//   mapContainer: {
//     borderRadius: "12px",
//     overflow: "hidden",
//     boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
//     marginTop: "2rem",
//   },
// });

// const Dashboard = () => {
//   const classes = useStyles();
//   const [location, setLocation] = useState(null);
//   const [weather, setWeather] = useState(null);
//   const [traffic, setTraffic] = useState(null);
//   const [news, setNews] = useState([]);
//   const [activeTab, setActiveTab] = useState(0);

//   useEffect(() => {
//     navigator.geolocation.getCurrentPosition((position) => {
//       const { latitude, longitude } = position.coords;
//       setLocation({ latitude, longitude });
//     });
//   }, []);
//   useEffect(() => {
//     const fetchWeather = async () => {
//       if (!location) return;
//       const { data } = await axios.get(
//         `https://api.openweathermap.org/data/2.5/weather?lat=${location.latitude}&lon=${location.longitude}&appid=4b3120747b9ef1f222316cf9cf47bd7a&units=metric`
//       );
//       setWeather(data);
//     };

//     const fetchTraffic = async () => {
//       if (!location) return;
//       const { data } = await axios.get(
//         `https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json?point=${location.latitude},${location.longitude}&key=5QpZLwcTD1Gz8dJ0O7o1u9vGokfRF1Og`
//       );
//       setTraffic(data);
//     };

//     const fetchNews = async () => {
//       const { data } = await axios.get(
//         `https://api.bing.microsoft.com/v7.0/news/search?q=traffic&count=10`,
//         {
//           headers: {
//             "Ocp-Apim-Subscription-Key": "5d37de4bda40423b8904c2a8fcc2b755",
//           },
//         }
//       );
//       setNews(data.value);
//     };

//     fetchWeather();
//     fetchTraffic();
//     fetchNews();
//   }, [location]);

//   return (
//     <Box
//       sx={{ backgroundColor: "#f9fafc", minHeight: "100vh", padding: "2rem 0" }}
//     >
//       {/* Navigation */}
//       <AppBar position="static" className={classes.appBar}>
//         <Toolbar>
//           <Typography variant="h6" sx={{ flexGrow: 1 }}>
//             Traffic Dashboard
//           </Typography>
//           <Tabs
//             value={activeTab}
//             onChange={(e, newValue) => setActiveTab(newValue)}
//             textColor="inherit"
//             indicatorColor="secondary"
//           >
//             <Tab label="Dashboard" />
//             <Tab label="Predict" />
//             <Tab label="Manage" />
//           </Tabs>
//         </Toolbar>
//       </AppBar>

//       <Container>
//         {/* Hero Section */}
//         <Box className={classes.heroSection}>
//           <Box className={classes.heroContent}>
//             <Typography variant="h3" gutterBottom>
//               Welcome to Your Dashboard
//             </Typography>
//             <Typography variant="h6" gutterBottom>
//               Real-time traffic updates, weather forecasts, and more at your
//               fingertips.
//             </Typography>
//             <Button variant="contained" color="secondary" size="large">
//               Explore Features
//             </Button>
//           </Box>
//           <img
//             src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSj-rBuiUH47r__O_3a3BkpdsX3lOTs7vdaHg&s"
//             alt="Dashboard Illustration"
//             className={classes.heroImage}
//           />
//         </Box>

//         {/* Cards */}
//         <Grid container spacing={4}>
//           <Grid item xs={12} sm={4}>
//             <Card className={classes.card}>
//               <WbSunnyIcon fontSize="large" sx={{ color: "#f39c12" }} />
//               <Typography variant="h6">Weather</Typography>
//               <Typography variant="body1">
//                 {weather
//                   ? `${weather.main.temp}°C, ${weather.weather[0].description}`
//                   : "Loading..."}
//               </Typography>
//             </Card>
//           </Grid>
//           <Grid item xs={12} sm={4}>
//             <Card className={classes.card}>
//               <TrafficIcon fontSize="large" sx={{ color: "#27ae60" }} />
//               <Typography variant="h6">Traffic</Typography>
//               <Typography variant="body1">
//                 {traffic
//                   ? `${traffic.flowSegmentData.currentSpeed} km/h`
//                   : "Loading..."}
//               </Typography>
//             </Card>
//           </Grid>
//           <Grid item xs={12} sm={4}>
//             <Card className={classes.card}>
//               <LocationOnIcon fontSize="large" sx={{ color: "#2980b9" }} />
//               <Typography variant="h6">Location</Typography>
//               <Typography variant="body1">
//                 {location
//                   ? `${location.latitude}, ${location.longitude}`
//                   : "Loading..."}
//               </Typography>
//             </Card>
//           </Grid>
//         </Grid>

//         {/* Map */}
//         {location && (
//           <Box className={classes.mapContainer}>
//             <MapContainer
//               center={[location.latitude, location.longitude]}
//               zoom={13}
//               style={{ height: "400px" }}
//             >
//               <TileLayer
//                 url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                 attribution="&copy; OpenStreetMap contributors"
//               />
//               <Marker position={[location.latitude, location.longitude]}>
//                 <Popup>Your current location</Popup>
//               </Marker>
//             </MapContainer>
//           </Box>
//         )}
//       </Container>
//     </Box>
//   );
// };

// export default Dashboard;

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./Dashboard.css";
import "leaflet.heat";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTachometerAlt,
  faCar,
  faClock,
  faRoad,
  faExclamationCircle,
  faShieldAlt,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import {
  AppBar,
  Toolbar,
  Drawer,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Box,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import TrafficIcon from "@mui/icons-material/Traffic";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ArticleIcon from "@mui/icons-material/Article";
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { Form, Row, Col, Container, Alert, Spinner } from "react-bootstrap";
const DrawerContent = styled(Box)({
  width: 250,
  padding: "1rem",
  backgroundColor: "#f5f5f5",
});

const DashboardContainer = styled(Box)({
  minHeight: "100vh",
  backgroundColor: "#eef1f5",
  padding: "2rem",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
});

const HeroSection = styled(Box)({
  width: "100%",
  padding: "2rem",
  background: "linear-gradient(120deg, #007bff, #007bff)",
  color: "#fff",
  borderRadius: "16px",
  marginBottom: "2rem",
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  gap: "2rem",
});

const HeroContent = styled(Box)({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
});

const StyledCard = styled(Card)({
  backgroundColor: "#ffffff",
  borderRadius: "12px",
  boxShadow: "0px 6px 20px rgba(0, 0, 0, 0.1)",
  padding: "1.5rem",
  transition: "transform 0.3s ease-in-out",
  "&:hover": {
    transform: "scale(1.05)",
  },
  textAlign: "center",
});

const NewsList = styled(Box)({
  width: "100%",
  marginTop: "2rem",
});
const HeatmapLayer = ({ data }) => {
  const map = useMap();

  useEffect(() => {
    if (!data.length) return;

    const heatLayer = L.heatLayer(data, {
      radius: 25,
      blur: 15,
      maxZoom: 17,
    }).addTo(map);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [data, map]);

  return null;
};
const Dashboard = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [location, setLocation] = useState(null);
  const [weather, setWeather] = useState(null);
  const [traffic, setTraffic] = useState(null);
  const [news, setNews] = useState([]);
  const [heatmapData, setHeatmapData] = useState([]);
  const [trafficData, setTrafficData] = useState(null);
  const [predictedData, setPredictedData] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState({
    name: "Bangalore",
    latitude: 12.9716,
    longitude: 77.5946,
  });

  const [userData, setuserData] = useState();
  const getUserData = () => {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  };
  const [regions] = useState([
    { name: "Bangalore", latitude: 12.9716, longitude: 77.5946 },
    { name: "Mumbai", latitude: 19.076, longitude: 72.8777 },
    { name: "Delhi", latitude: 28.7041, longitude: 77.1025 },
  ]);

  useEffect(() => {
    setuserData(getUserData());
  }, []);
  const navigate = useNavigate();
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      setLocation({ latitude, longitude });
    });
  }, []);
  function ChangeMapView({ center }) {
    const map = useMap();
    map.setView(center, map.getZoom());
    return null;
  }
  const handleRegionChange = async (e) => {
    const selectedRegion = regions.find(
      (region) => region.name === e.target.value
    );
    if (selectedRegion) {
      const { name, latitude, longitude } = selectedRegion;
      setSelectedRegion(selectedRegion);
      // setFormData({ ...formData, region: name, latitude, longitude });
      setLocation({ latitude, longitude });
    }
  };

  useEffect(() => {
    const fetchWeather = async () => {
      if (!location) return;
      const { data } = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${location.latitude}&lon=${location.longitude}&appid=4b3120747b9ef1f222316cf9cf47bd7a&units=metric`
      );
      setWeather(data);
    };

    const fetchTraffic = async () => {
      if (!location) return;
      const { data } = await axios.get(
        `https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json?point=${location.latitude},${location.longitude}&key=5QpZLwcTD1Gz8dJ0O7o1u9vGokfRF1Og`
      );
      setTraffic(data);
    };

    const fetchNews = async () => {
      const { data } = await axios.get(
        `https://api.bing.microsoft.com/v7.0/news/search?q=traffic&count=10`,
        {
          headers: {
            "Ocp-Apim-Subscription-Key": "a14994d42f804c0b974e2f65784cdfb9",
          },
        }
      );
      setNews(data.value);
    };
    const fetchTrafficData = async () => {
      if (!location) return;
      const { latitude, longitude } = location;
      const { data } = await axios.get(
        `https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json?point=${latitude},${longitude}&key=5QpZLwcTD1Gz8dJ0O7o1u9vGokfRF1Og`
      );
      console.log(data);
      const processedData = data?.flowSegmentData?.coordinates?.coordinate?.map(
        (coord) => [
          coord.latitude,
          coord.longitude,
          1, // Weight for heatmap intensity (can be adjusted based on traffic speed)
        ]
      );
      setHeatmapData(processedData);
    };
    const generateBBox = (lat, lon, delta = 0.01) => {
      return `${lon - delta},${lat - delta},${lon + delta},${lat + delta}`;
    };

    // Fetch Traffic Stats
    const fetchTrafficStats = async () => {
      if (!location) return;
      const { latitude, longitude } = location;

      try {
        const response = await axios.get(
          `https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json`,
          {
            params: {
              point: `${latitude},${longitude}`,
              key: "5QpZLwcTD1Gz8dJ0O7o1u9vGokfRF1Og",
            },
          }
        );

        const trafficData = response.data.flowSegmentData;
        console.log("Traffic Data:", trafficData);

        setTrafficData({
          currentSpeed: trafficData.currentSpeed,
          freeFlowSpeed: trafficData.freeFlowSpeed,
          currentTravelTime: trafficData.currentTravelTime,
          freeFlowTravelTime: trafficData.freeFlowTravelTime,
          roadClosure: trafficData.roadClosure,
          confidence: trafficData.confidence,
        });
      } catch (error) {
        console.error("Error fetching traffic stats:", error);
      }
    };
    fetchWeather();
    fetchTraffic();
    fetchNews();
    fetchTrafficData();
    fetchTrafficStats();
  }, [location]);

  useEffect(() => {
    const fetchPredictions = async () => {
      const trafficResponse = await axios.get(
        `https://api.tomtom.com/traffic/services/4/flowSegmentData/relative0/10/json?point=${selectedRegion?.latitude},${selectedRegion?.longitude}&key=5QpZLwcTD1Gz8dJ0O7o1u9vGokfRF1Og`
      );
      const response = await axios.post("http://localhost:5000/predict_lstm", {
        region: selectedRegion?.name,
        latitude: selectedRegion?.latitude,
        longitude: selectedRegion?.longitude,
        currentTrafficData: "100,120,110",
        weatherData: JSON.stringify({
          temperature: (weather.main.temp - 273.15).toFixed(2), // Convert Kelvin to Celsius
          condition: weather.weather[0].description,
        }),
        trafficData: JSON.stringify({
          speed: trafficResponse.data.flowSegmentData.currentSpeed,
          freeFlowSpeed: trafficResponse.data.flowSegmentData.freeFlowSpeed,
          congestionLevel: trafficResponse.data.flowSegmentData.confidence,
        }),
        news: news.map((item) => item.name),
        currentTrafficData: [100, 120, 110],
      });

      const trafficData = trafficResponse.data.flowSegmentData;

      // Calculate the new volumes based on traffic data
      const adjustedPredictions = Object.entries(predictionData).reduce(
        (acc, [interval, prediction]) => {
          // Assuming trafficData.speed and freeFlowSpeed are available for calculation
          const adjustmentFactor =
            trafficData.currentSpeed / trafficData.freeFlowSpeed;
          const updatedVolume = prediction.volume * adjustmentFactor;

          acc[interval] = {
            ...prediction,
            volume: updatedVolume, // Adjusted volume based on the current traffic data
          };
          return acc;
        }
      );
      console.log(adjustedPredictions);
      setPredictedData(adjustedPredictions);
    };
    if (selectedRegion && weather) {
      fetchPredictions();
    }
  }, [selectedRegion, weather]);
  const TrafficStatsCard = ({ trafficData }) => {
    if (!trafficData) return <p>Loading traffic data...</p>;

    const stats = [
      {
        icon: faTachometerAlt,
        label: "Current Speed",
        value: `${trafficData.currentSpeed} km/h`,
      },
      {
        icon: faCar,
        label: "Free Flow Speed",
        value: `${trafficData.freeFlowSpeed} km/h`,
      },
      {
        icon: faClock,
        label: "Travel Time (Current)",
        value: `${(trafficData.currentTravelTime / 60).toFixed(2)} mins`,
      },
      {
        icon: faClock,
        label: "Travel Time (Free Flow)",
        value: `${(trafficData.freeFlowTravelTime / 60).toFixed(2)} mins`,
      },
      {
        icon: faRoad,
        label: "Road Closure",
        value: trafficData.roadClosure ? "Yes" : "No",
      },
      {
        icon: faShieldAlt,
        label: "Confidence Score",
        value: trafficData.confidence,
      },
    ];

    return (
      <div className="traffic-grid">
        <h2>Traffic Statistics</h2>
        <div className="grid-container">
          {stats.map((stat, index) => (
            <div className="grid-item" key={index}>
              <FontAwesomeIcon icon={stat.icon} className="grid-icon" />
              <div>
                <h4>{stat.label}</h4>
                <p>{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
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
            Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <DrawerContent>
          <Typography variant="h6">Navigation</Typography>
          <List>
            <ListItem button>
              <ListItemText
                primary="Dashboard"
                onClick={() => {
                  navigate("/dashboard");
                }}
              />
            </ListItem>
            <ListItem button>
              <ListItemText
                primary="Route Plan"
                onClick={() => {
                  navigate("/route-plan");
                }}
              />
            </ListItem>
            {userData?.userType == "Admin" ? (
              <ListItem button>
                <ListItemText
                  primary="Block Routes"
                  onClick={() => {
                    navigate("/block-map");
                  }}
                />
              </ListItem>
            ) : (
              <div />
            )}
          </List>
        </DrawerContent>
      </Drawer>

      <DashboardContainer>
        <HeroSection>
          <HeroContent>
            <Typography variant="h4">Welcome to TrafficX!</Typography>
            <Typography style={{ padding: 5 }}>
              Stay updated with live traffic, weather conditions,get shortest
              routes, many more and news.
            </Typography>
            <Button variant="contained" color="secondary" size="large">
              Explore Now
            </Button>
          </HeroContent>
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSj-rBuiUH47r__O_3a3BkpdsX3lOTs7vdaHg&s"
            alt="Dashboard Hero"
            style={{ borderRadius: "12px", maxWidth: "50%" }}
          />
        </HeroSection>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <StyledCard>
              <WbSunnyIcon fontSize="large" color="warning" />
              <Typography variant="h6">Weather</Typography>
              <Typography>
                {weather
                  ? `${weather.main.temp}°C - ${weather.weather[0].description}`
                  : "Loading..."}
              </Typography>
            </StyledCard>
          </Grid>
          <Grid item xs={12} sm={4}>
            <StyledCard>
              <TrafficIcon fontSize="large" color="success" />
              <Typography variant="h6">Traffic</Typography>
              <Typography>
                {traffic
                  ? `${traffic.flowSegmentData.currentSpeed} km/h`
                  : "Loading..."}
              </Typography>
            </StyledCard>
          </Grid>
          <Grid item xs={12} sm={4}>
            <StyledCard>
              <LocationOnIcon fontSize="large" color="info" />
              <Typography variant="h6">Location</Typography>
              <Typography>
                {location
                  ? `${location.latitude.toFixed(
                      2
                    )}, ${location.longitude.toFixed(2)}`
                  : "Loading..."}
              </Typography>
              <Form.Group className="mb-3">
                <Form.Label style={{ marginRight: 8 }}>Region</Form.Label>
                <Form.Select onChange={handleRegionChange} required>
                  <option value="">Select a region</option>
                  {regions.map((region) => (
                    <option key={region.name} value={region.name}>
                      {region.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </StyledCard>
          </Grid>
        </Grid>

        {/* {location && (
          <Box sx={{ marginTop: "2rem", width: "100%", height: "400px" }}>
            <MapContainer
              center={[location.latitude, location.longitude]}
              zoom={13}
              style={{ height: "100%", borderRadius: "12px" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />
              <Marker position={[location.latitude, location.longitude]}>
                <Popup>Your current location</Popup>
              </Marker>
            </MapContainer>
          </Box>
        )} */}
        {location && (
          <Box sx={{ marginTop: "2rem", width: "100%", height: "400px" }}>
            <MapContainer
              center={[location.latitude, location.longitude]}
              zoom={13}
              style={{ height: "100%", borderRadius: "12px" }}
            >
              <ChangeMapView center={[location.latitude, location.longitude]} />
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />
              <HeatmapLayer data={heatmapData} />
              <Marker position={[location.latitude, location.longitude]}>
                <Popup>Your current location</Popup>
              </Marker>
            </MapContainer>
          </Box>
        )}
        <TrafficStatsCard trafficData={trafficData} />
        <NewsList>
          <Typography variant="h5" sx={{ marginBottom: "1rem" }}>
            Latest News
          </Typography>
          {news.map((article, index) => (
            <Card
              key={index}
              sx={{
                marginBottom: "1rem",
                padding: "1rem",
                backgroundColor: "#fff",
                borderRadius: "8px",
              }}
            >
              <Typography variant="h6">{article.name}</Typography>
              <Typography>{article.description}</Typography>
              <Button href={article.url} target="_blank">
                Read More
              </Button>
            </Card>
          ))}
        </NewsList>
      </DashboardContainer>
    </>
  );
};

export default Dashboard;
