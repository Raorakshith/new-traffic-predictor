import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  DirectionsRenderer,
  TrafficLayer,
  useJsApiLoader,
  Marker,
  DirectionsService,
  Polyline,
  Autocomplete,
} from "@react-google-maps/api";
import {
  Container,
  Grid,
  Button,
  Typography,
  CircularProgress,
  Paper,
  List,
  ListItem,
  ListItemText,
  Drawer,
  IconButton,
  AppBar,
  Box,
  Toolbar,
  Snackbar,
} from "@mui/material";
import {
  getFirestore,
  doc,
  setDoc,
  collection,
  deleteDoc,
  onSnapshot,
  getDocs,
} from "firebase/firestore";
import axios from "axios";
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import { db } from "./firebase";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

// import { Place, Flag } from "@mui/icons-material"; // Importing icons
const containerStyle = {
  width: "100%",
  height: "600px",
};
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

const center = { lat: 12.9716, lng: 77.5946 }; // Default center (Bangalore)

const RoutePlanner = () => {
  const [startPoint, setStartPoint] = useState(null);
  const [endPoint, setEndPoint] = useState(null);
  const [directions, setDirections] = useState(null);
  const [optimalRouteIndex, setOptimalRouteIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [trafficVisible, setTrafficVisible] = useState(true);
  const [weatherInfo, setWeatherInfo] = useState(null);
  const [news, setNews] = useState([]);
  const [routeDetails, setRouteDetails] = useState([]);
  const [startPointAddress, setStartPointAddress] = useState();
  const [endPointAddress, setEndPointAddress] = useState();
  const [blockedRoutes, setBlockedRoutes] = useState([]);
  const [directionsResult, setDirectionsResult] = useState(null);
  const [optimalRoute, setOptimalRoute] = useState(null);
  const [isFirstTime, setisFirstTime] = useState(true);
  const [show, setShow] = useState(false);
  const [updateBlocked, setUpdateBlocked] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [autocompleteStart, setAutocompleteStart] = useState(null);
  const [autocompleteEnd, setAutocompleteEnd] = useState(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(null);

  const navigate = useNavigate();

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyD590z__itIHB85Rrz0XJxEpi-PVYPs2b0",
    libraries: [
      "places",
      "geocoding",
      "maps",
      "marker",
      "routes",
      "streetView",
      "core",
      "visualization",
    ],
  });
  const handleAlertClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setAlertOpen(false);
  };
  const decodePolyline = (polyline) => {
    const coordinates = [];
    let index = 0,
      len = polyline.length;
    let lat = 0,
      lng = 0;

    while (index < len) {
      let b,
        shift = 0,
        result = 0;
      do {
        b = polyline.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlat = result & 1 ? ~(result >> 1) : result >> 1;
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = polyline.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlng = result & 1 ? ~(result >> 1) : result >> 1;
      lng += dlng;

      coordinates.push({ lat: lat / 1e5, lng: lng / 1e5 });
    }

    return coordinates;
  };
  useEffect(() => {
    const fetchBlockedRoutes = async () => {
      try {
        const blockedRoutesCollection = collection(db, "blockedRoutes");
        const querySnapshot = await getDocs(blockedRoutesCollection);
        const routes = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const polyline = decodePolyline(data.polyline); // Decode polyline to coordinates
          routes.push(polyline);
        });

        console.log("blocked routes now", routes);
        setBlockedRoutes(routes);
      } catch (error) {
        console.error("Error fetching blocked routes: ", error);
      }
    };

    fetchBlockedRoutes();
  }, []);
  // useEffect(() => {
  //   if (blockedRoutes && blockedRoutes?.length > 0) {
  //     setUpdateBlocked(!updateBlocked);
  //   }
  // }, [blockedRoutes]);
  const [userData, setuserData] = useState();
  const getUserData = () => {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  };

  useEffect(() => {
    setuserData(getUserData());
  }, []);
  if (!isLoaded) return <CircularProgress />;
  const fetchBlockedRoutesnew = async () => {
    try {
      const blockedRoutesCollection = collection(db, "blockedRoutes");
      const querySnapshot = await getDocs(blockedRoutesCollection);
      const routes = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const polyline = decodePolyline(data.polyline); // Decode polyline to coordinates
        routes.push(polyline);
      });

      console.log("blocked routes now", routes);
      setBlockedRoutes(routes);
    } catch (error) {
      console.error("Error fetching blocked routes: ", error);
    }
  };
  const fetchRoutes = async () => {
    if (!startPoint || !endPoint) {
      alert("Please select both start and end points!");
      return;
    }

    setLoading(true);

    const directionsService = new google.maps.DirectionsService();

    directionsService.route(
      {
        origin: startPoint,
        destination: endPoint,
        travelMode: google.maps.TravelMode.DRIVING,
        provideRouteAlternatives: true,
      },
      (result, status) => {
        if (status === "OK") {
          setDirections(result);
          determineBestRoute(result.routes);
          fetchRouteTrafficDetails(result.routes);
          console.log("routes generated", result);
        } else {
          alert("Error fetching directions: " + status);
        }
        setLoading(false);
        setShow(true);
      }
    );
  };

  const determineBestRoute = (routes) => {
    // Determine the shortest-duration route
    let bestIndex = 0;
    let minDuration = routes[0].legs[0].duration.value;

    routes.forEach((route, index) => {
      if (route.legs[0].duration.value < minDuration) {
        bestIndex = index;
        minDuration = route.legs[0].duration.value;
      }
    });

    setOptimalRouteIndex(bestIndex);
  };

  const fetchRouteTrafficDetails = (routes) => {
    // Collect traffic data and additional details for each route
    const details = routes.map((route, index) => {
      const leg = route.legs[0]; // Assume only one leg for A -> B
      return {
        routeIndex: index,
        distance: leg.distance.text,
        routedata: route,
        duration: leg.duration.text,
        trafficSpeed: Math.floor(Math.random() * (80 - 30) + 30), // Mock: random speed
        trafficVolume: Math.floor(Math.random() * (100 - 50) + 50), // Mock: random volume
        estimatedArrivalTime: new Date(
          Date.now() + leg.duration.value * 1000
        ).toLocaleTimeString(), // Add duration to current time
      };
    });

    setRouteDetails(details);
  };

  const geocodeLatLng = async (lat, lng) => {
    const geocodeApiKey = "AIzaSyD590z__itIHB85Rrz0XJxEpi-PVYPs2b0"; // Your Google Maps API Key
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${geocodeApiKey}`
      );

      if (response.data.status !== "OK" || !response.data.results.length) {
        throw new Error("No results found");
      }

      // Extract the complete address
      const completeAddress =
        response.data.results[0]?.formatted_address || "Unknown address";

      // Extract locality name
      const localityComponent =
        response.data.results[0]?.address_components.find((comp) =>
          comp.types.includes("locality")
        );
      const localityName = localityComponent?.long_name || "Unknown locality";

      return {
        localityName,
        completeAddress,
      };
    } catch (error) {
      console.error("Error during geocoding:", error);
      return {
        localityName: "Unknown locality",
        completeAddress: "Unknown address",
      };
    }
  };

  const fetchWeatherAndNews = async (endPoint) => {
    const openWeatherApiKey = "4b3120747b9ef1f222316cf9cf47bd7a";
    const bingNewsApiKey = "a14994d42f804c0b974e2f65784cdfb9";

    try {
      const startPlaceName = await geocodeLatLng(
        startPoint.lat,
        startPoint.lng
      );
      const endPlaceName = await geocodeLatLng(endPoint.lat, endPoint.lng);
      setStartPointAddress(startPlaceName?.completeAddress);
      setEndPointAddress(endPlaceName?.completeAddress);
      // Fetch weather data for start and end points
      const weatherStart = axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${startPoint.lat}&lon=${startPoint.lng}&appid=${openWeatherApiKey}`
      );

      const weatherEnd = axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${endPoint.lat}&lon=${endPoint.lng}&appid=${openWeatherApiKey}`
      );

      const [startWeather, endWeather] = await Promise.all([
        weatherStart,
        weatherEnd,
      ]);

      setWeatherInfo({
        start: startWeather.data,
        end: endWeather.data,
      });

      // Fetch news data for the selected region
      const newsResponseStart = await axios.get(
        `https://api.bing.microsoft.com/v7.0/news/search?q=traffic news and road blockages in ${startPlaceName?.localityName}`,
        {
          headers: { "Ocp-Apim-Subscription-Key": bingNewsApiKey },
        }
      );
      const newsResponseEnd = await axios.get(
        `https://api.bing.microsoft.com/v7.0/news/search?q=traffic news and road blockages in ${endPlaceName?.localityName}`,
        {
          headers: { "Ocp-Apim-Subscription-Key": bingNewsApiKey },
        }
      );
      setNews([...newsResponseStart.data.value, ...newsResponseEnd.data.value]);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleMapClick = (event) => {
    if (!startPoint) {
      setStartPoint({
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      });
    } else if (!endPoint) {
      const selectedEndPoint = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      };
      setEndPoint(selectedEndPoint);
      fetchWeatherAndNews(selectedEndPoint);
      // Automatically fetch weather and news
    }
  };

  const handleRouteSelect = (index) => {
    setOptimalRouteIndex(index); // Update the selected route index
    setSelectedRouteIndex(index);
  };

  // Decode polyline string into coordinates

  const directionsCallback = (response) => {
    if (response && response.status === "OK") {
      setDirectionsResult(response);
    }
  };

  const checkRouteBlocked = (route) => {
    for (const blockedRoute of blockedRoutes) {
      console.log("blocked", blockedRoutes);
      for (const point of route) {
        if (
          blockedRoute.some(
            (blockedPoint) =>
              Math.abs(blockedPoint.lat - point.lat) < 0.001 &&
              Math.abs(blockedPoint.lng - point.lng) < 0.001
          )
        ) {
          return true; // Route is blocked
        }
      }
    }
    return false; // Route is not blocked
  };

  const checkRouteBlockedNew = (route) => {
    console.log("Checking Route:", route);

    // Loop through the list of blocked routes
    for (const blockedRoute of blockedRoutes) {
      console.log("Checking against Blocked Route:", blockedRoute);

      // Check if any point in the current route matches any point in the blocked route
      const isBlocked = route.some((point) => {
        // Extract the numeric values for lat and lng
        const pointLat =
          typeof point.lat === "function" ? point.lat() : point.lat;
        const pointLng =
          typeof point.lng === "function" ? point.lng() : point.lng;

        return blockedRoute.some((blockedPoint) => {
          const blockedLat =
            typeof blockedPoint.lat === "function"
              ? blockedPoint.lat()
              : blockedPoint.lat;
          const blockedLng =
            typeof blockedPoint.lng === "function"
              ? blockedPoint.lng()
              : blockedPoint.lng;

          const isMatch =
            Math.abs(blockedLat - pointLat) < 0.001 &&
            Math.abs(blockedLng - pointLng) < 0.001;

          if (isMatch) {
            console.log("Matching Point Found:", point, blockedPoint);
          }
          return isMatch;
        });
      });

      if (isBlocked) {
        // setUpdateBlocked(true);
        console.log("Route Blocked Detected!");
        return true;
      }
    }

    console.log("No Blockage Detected");
    return false;
  };
  const handleStartPlaceSelected = () => {
    if (autocompleteStart !== null) {
      const place = autocompleteStart.getPlace();
      if (place.geometry) {
        const location = place.geometry.location;
        setStartPoint({
          lat: location.lat(),
          lng: location.lng(),
        });
      } else {
        alert("No geometry found for this place.");
      }
    }
  };
  const handleEndPlaceSelected = () => {
    if (autocompleteEnd !== null) {
      const place = autocompleteEnd.getPlace();
      if (place.geometry) {
        const location = place.geometry.location;
        setEndPoint({
          lat: location.lat(),
          lng: location.lng(),
        });
      } else {
        alert("No geometry found for this place.");
      }
    }
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
        <Container>
          <Snackbar
            open={alertOpen}
            autoHideDuration={3000} // Alert will disappear after 3 seconds
            onClose={handleAlertClose}
            anchorOrigin={{ vertical: "top", horizontal: "center" }} // Position of the alert
          >
            <Alert onClose={handleAlertClose} severity="warning">
              Route is blocked! Please choose a different path.
            </Alert>
          </Snackbar>
          <Typography variant="h4" textAlign="center" gutterBottom>
            Route Planner with Traffic, Weather, and News Insights
          </Typography>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <div>
              <h4>Select Start Place</h4>
              <Autocomplete
                onLoad={(autoC) => setAutocompleteStart(autoC)}
                onPlaceChanged={handleStartPlaceSelected}
              >
                <input
                  type="text"
                  placeholder="Search for a start place"
                  style={{
                    width: "300px",
                    padding: "10px",
                    marginBottom: "10px",
                  }}
                />
              </Autocomplete>
            </div>
            <SwapHorizIcon
              style={{ alignSelf: "center", width: "100px", height: "60px" }}
            />
            <div>
              <h4>Select End Place</h4>
              <Autocomplete
                onLoad={(autoC) => setAutocompleteEnd(autoC)}
                onPlaceChanged={handleEndPlaceSelected}
              >
                <input
                  type="text"
                  placeholder="Search for an end place"
                  style={{
                    width: "300px",
                    padding: "10px",
                    marginBottom: "10px",
                  }}
                />
              </Autocomplete>
            </div>
          </div>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={13}
                onClick={handleMapClick}
              >
                {startPoint && <Marker position={startPoint} label="Start" />}
                {endPoint && <Marker position={endPoint} label="End" />}
                {blockedRoutes.map((route, index) => (
                  <Polyline
                    key={index}
                    path={route}
                    options={{
                      strokeColor: "black",
                      strokeOpacity: 0.8,
                      strokeWeight: 4,
                    }}
                  />
                ))}

                {directions && (
                  <DirectionsRenderer
                    directions={directions}
                    routeIndex={
                      selectedRouteIndex
                        ? selectedRouteIndex
                        : optimalRouteIndex
                    }
                    options={{
                      polylineOptions: {
                        strokeColor: "#ff0000",
                        strokeWeight: 4,
                      },
                      // suppressPolylines: selectedRouteIndex !== null, // This will suppress other routes when a specific route is selected
                    }}
                  />
                )}
                {trafficVisible && <TrafficLayer />}
              </GoogleMap>
            </Grid>
            <Grid item xs={12} md={6}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={fetchRoutes}
                disabled={loading}
              >
                {loading ? "Calculating Routes..." : "Fetch Optimal Routes"}
              </Button>
            </Grid>
          </Grid>

          {routeDetails.length > 0 && (
            <Paper style={{ padding: "10px", marginTop: "20px" }}>
              <Typography variant="h6">Route Details:</Typography>
              <List>
                {routeDetails.map((detail, index) => (
                  <ListItem
                    key={index}
                    button
                    selected={optimalRouteIndex === index}
                    onClick={() => {
                      if (
                        checkRouteBlockedNew(detail.routedata.overview_path)
                      ) {
                        setAlertOpen(true);
                      } else {
                        handleRouteSelect(index);
                      }
                    }}
                  >
                    <ListItemText
                      primary={`Route ${index + 1}`}
                      secondary={`Distance: ${detail.distance}, Duration: ${
                        detail.duration
                      }, Traffic Speed: ${
                        detail.trafficSpeed
                      } km/h, Traffic Volume: ${detail.trafficVolume}, ETA: ${
                        detail.estimatedArrivalTime
                      }, ${
                        checkRouteBlockedNew(detail.routedata.overview_path)
                          ? "There is a blockage in this route"
                          : ""
                      }`}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          )}

          {/* {weatherInfo && (
        <Paper style={{ padding: "10px", marginTop: "20px" }}>
          <Typography variant="h6">Weather Information:</Typography>
          <Typography>
            {startPointAddress}: {weatherInfo.start.weather[0].description}
          </Typography>
          <Typography>
            {endPointAddress}: {weatherInfo.end.weather[0].description}
          </Typography>
        </Paper>
      )} */}
          {weatherInfo && (
            <Paper
              style={{
                padding: "20px",
                marginTop: "20px",
                backgroundColor: "#f5f5f5",
                borderRadius: "10px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Typography
                variant="h5"
                style={{
                  marginBottom: "15px",
                  fontWeight: "bold",
                  color: "#3f51b5",
                  textAlign: "center",
                }}
              >
                Weather Information
              </Typography>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "15px",
                }}
              >
                {/* Start Point */}
                <div
                  style={{
                    flex: "1 1 45%",
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  {/* <Place style={{ fontSize: "40px", color: "#1976d2" }} /> */}
                  {/* Start Icon */}
                  <Typography
                    variant="subtitle1"
                    style={{ fontWeight: "bold" }}
                  >
                    {startPointAddress}
                  </Typography>
                  <Typography
                    variant="body1"
                    style={{
                      backgroundColor: "#e3f2fd",
                      padding: "10px",
                      borderRadius: "5px",
                      marginTop: "5px",
                    }}
                  >
                    {weatherInfo.start.weather[0].description}
                  </Typography>
                </div>

                {/* End Point */}
                <div
                  style={{
                    flex: "1 1 45%",
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  {/* <Flag style={{ fontSize: "40px", color: "#43a047" }} /> */}
                  {/* End Icon */}
                  <Typography
                    variant="subtitle1"
                    style={{ fontWeight: "bold" }}
                  >
                    {endPointAddress}
                  </Typography>
                  <Typography
                    variant="body1"
                    style={{
                      backgroundColor: "#e8f5e9",
                      padding: "10px",
                      borderRadius: "5px",
                      marginTop: "5px",
                    }}
                  >
                    {weatherInfo.end.weather[0].description}
                  </Typography>
                </div>
              </div>
            </Paper>
          )}

          {news.length > 0 && (
            <Paper style={{ padding: "10px", marginTop: "20px" }}>
              <Typography variant="h6">News Headlines:</Typography>
              <ul>
                {news.map((article, index) => (
                  <li key={index}>
                    <div
                      style={{ fontSize: 12, fontWeight: "normal", padding: 5 }}
                    >
                      {article.name}
                    </div>
                  </li>
                ))}
              </ul>
            </Paper>
          )}
        </Container>
      </DashboardContainer>
    </>
  );
};

export default RoutePlanner;
