import React, { useEffect, useMemo, useState } from "react";
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
  Chip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import TrafficIcon from "@mui/icons-material/Traffic";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ArticleIcon from "@mui/icons-material/Article";
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import {
  Form,
  Row,
  Col,
  Container,
  Alert,
  Spinner,
  Badge,
} from "react-bootstrap";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import MobileStepper from "@material-ui/core/MobileStepper";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import ErrorBoundary from "../ErrorBoundary";
import aibot from "../components/aijson.json";
import Lottie from "lottie-react";
import Typist from "react-typist";
import "react-typist/dist/Typist.css";
import TypingEffect from "../components/TextTyping";
import InfoCard from "../components/InfoCard";

const MyCollection = [
  {
    label: "First Picture",
    imgPath:
      "https://media.geeksforgeeks.org/wp-content/uploads/20210208000010/1.png",
  },
  {
    label: "Second Picture",
    imgPath:
      "https://media.geeksforgeeks.org/wp-content/uploads/20210208000009/2.png",
  },
  {
    label: "Third Picture",
    imgPath:
      "https://media.geeksforgeeks.org/wp-content/uploads/20210208000008/3.png",
  },
];

const paragraph =
  "       Our Traffic Prediction System leverages historical traffic data to predict future traffic trends and provide optimal routes for better travel planning. By analyzing patterns, it forecasts traffic conditions for the next 7 days, ensuring efficiency, reduced congestion, and enhanced user experience.";
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
  const memoizedText = useMemo(() => paragraph, [paragraph]);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    setShouldRender(true); // Trigger only once when the component mounts.
  }, []);
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
        setShouldRender(true);
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
      const trafficDataw = trafficResponse.data.flowSegmentData;

      // Generate a `currentTrafficData` array dynamically from the TomTom data
      // Example: [currentSpeed, freeFlowSpeed, confidence] as mock data points
      const currentTrafficData = [
        trafficDataw.currentSpeed,
        trafficDataw.freeFlowSpeed,
        Math.round(trafficDataw.confidence * 100), // Convert confidence to percentage
      ];
      const response = await axios.post("http://localhost:5000/predict_lstm", {
        region: selectedRegion?.name,
        latitude: selectedRegion?.latitude,
        longitude: selectedRegion?.longitude,
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
        currentTrafficData: currentTrafficData,
      });

      const trafficData = trafficResponse.data.flowSegmentData;

      // Calculate the new volumes based on traffic data
      console.log(response.data);
      // const adjustedPredictions = Object.entries(
      //   response.data.predictions
      // ).reduce((acc, [interval, prediction]) => {
      //   // Assuming trafficData.speed and freeFlowSpeed are available for calculation
      //   const adjustmentFactor =
      //     trafficData.currentSpeed / trafficData.freeFlowSpeed;
      //   const updatedVolume = prediction.volume * adjustmentFactor;

      //   acc[interval] = {
      //     ...prediction,
      //     volume: updatedVolume, // Adjusted volume based on the current traffic data
      //   };
      //   return acc;
      // });
      const adjustedPredictions = Object.entries(
        response.data.predictions
      ).reduce((acc, [interval, prediction]) => {
        // Mock adjustment factor
        const adjustmentFactor =
          trafficData.currentSpeed / trafficData.freeFlowSpeed;

        // Adjust the volume for more realism
        const timeFactor = interval.includes("hours")
          ? 1
          : interval.includes("days")
          ? 1.5
          : 1;
        const updatedVolume = Math.fround(
          prediction.volume * adjustmentFactor * timeFactor
        ).toFixed(2);

        acc[interval] = {
          ...prediction,
          volume: updatedVolume, // Adjusted volume based on speed and interval
        };

        // Dynamically adjust category based on volume
        if (updatedVolume > 120) acc[interval].category = "High";
        else if (updatedVolume > 60) acc[interval].category = "Medium";
        else acc[interval].category = "Low";

        return acc;
      }, {});
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
  const getBadgeVariant = (category) => {
    switch (category) {
      case "Low":
        return "success";
      case "Medium":
        return "warning";
      case "High":
        return "danger";
      default:
        return "secondary";
    }
  };

  return (
    <ErrorBoundary>
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
              {userData?.userType == "Admin" ? (
                <ListItem button>
                  <ListItemText
                    primary="Metrics"
                    onClick={() => {
                      navigate("/metrics");
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
          <div
            style={{
              width: "100%",
              maxHeight: "500px",
              overflow: "hidden",
              marginBottom: 20,
            }}
          >
            <Carousel
              showThumbs={false}
              showArrows={true}
              autoPlay
              infiniteLoop
              dynamicHeight={false}
              showStatus={false}
              interval={3000}
            >
              <div>
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTeyDJNQbuEATQ_ifsd4FsDbtv-VERlGCOkyQ&s"
                  alt="Slide 1"
                  style={{ objectFit: "cover", height: "500px", width: "100%" }}
                />
              </div>
              <div>
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZ4K0Nobh_mYQkJghY-ttK7EoHDFt8pPmvmg&s"
                  alt="Slide 2"
                  style={{ objectFit: "cover", height: "500px", width: "100%" }}
                />
              </div>
              <div>
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6NazUK01ok4xX4yP_HYsAggTZyWLU8xOw7g&s"
                  alt="Slide 3"
                  style={{ objectFit: "cover", height: "500px", width: "100%" }}
                />
              </div>
            </Carousel>
          </div>

          {/* {shouldRender ? (
            <div
              style={{
                margin: "20px auto",
                textAlign: "center",
                maxWidth: "800px",
                fontFamily: "Arial, sans-serif",
                fontSize: "18px",
                lineHeight: "1.6",
              }}
            >
              <TypingEffect text={memoizedText} speed={150} />
            </div>
          ) : (
            <div />
          )} */}
          {/* <div
            style={{
              margin: "20px auto",
              textAlign: "center",
              maxWidth: "800px",
              fontFamily: "Arial, sans-serif",
              fontSize: "18px",
              lineHeight: "1.6",
            }}
          >
            <TypingEffect text={paragraph} speed={150} />
          </div> */}
          <InfoCard userData={userData} />
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
                <Typography variant="h6">Current Location</Typography>
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
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: 'flex-start',
              padding: "20px",
              backgroundColor: "#f5f5f5",
              borderRadius: "10px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              margin: "10px 0",
            }}
          >
            <h2
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                color: "#2c3e50",
                margin: "0 0 10px",
              }}
            >
              Live Traffic Density Map
            </h2>
            <p
              style={{
                fontSize: "16px",
                color: "#7f8c8d",
                textAlign: "center",
                margin: "0",
              }}
            >
              Navigate through {selectedRegion?.name?selectedRegion?.name:""}’s real-time traffic insights to plan
              your journey efficiently.
            </p>
          </div>

          {location && (
            <Box sx={{ marginTop: "2rem", width: "100%", height: "400px" }}>
              <MapContainer
                center={[location.latitude, location.longitude]}
                zoom={13}
                style={{ height: "100%", borderRadius: "12px" }}
              >
                <ChangeMapView
                  center={[location.latitude, location.longitude]}
                />
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
          <Box sx={{ p: 3 }}>
            {predictedData && (
              <div>
                <Typography variant="h4" gutterBottom align="center">
                  Traffic Predictions
                </Typography>
                <Grid container spacing={3}>
                  {Object.entries(predictedData).map(
                    ([interval, prediction]) => (
                      <Grid item xs={12} sm={6} md={4} key={interval}>
                        <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
                          <CardContent>
                            <Typography
                              variant="h6"
                              align="center"
                              gutterBottom
                              sx={{
                                textTransform: "uppercase",
                                fontWeight: "bold",
                              }}
                            >
                              {interval.replace("_", " ")} Prediction
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                mb: 2,
                              }}
                            >
                              <Chip
                                label={prediction.category}
                                color={getBadgeVariant(prediction.category)}
                                sx={{ fontSize: "0.85rem", fontWeight: "bold" }}
                              />
                            </Box>
                            <Typography variant="body1" gutterBottom>
                              <strong>Volume:</strong> {prediction.volume}
                              {" k"}
                              vehicles/hour
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                              <strong>Description:</strong>{" "}
                              {prediction.description}
                            </Typography>
                            <Typography variant="body2">
                              <strong>Recommendation:</strong>{" "}
                              {prediction.recommendation}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    )
                  )}
                </Grid>
              </div>
            )}
          </Box>
        </DashboardContainer>
      </>
    </ErrorBoundary>
  );
};

export default Dashboard;
