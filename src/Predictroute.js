import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  DirectionsRenderer,
  TrafficLayer,
  useJsApiLoader,
  Marker,
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
} from "@mui/material";
import axios from "axios";
import { Place, Flag } from "@mui/icons-material"; // Importing icons
const containerStyle = {
  width: "100%",
  height: "600px",
};

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

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyD590z__itIHB85Rrz0XJxEpi-PVYPs2b0",
    libraries: ["places"],
  });
  if (!isLoaded) return <CircularProgress />;

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
        } else {
          alert("Error fetching directions: " + status);
        }
        setLoading(false);
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

  //   const geocodeLatLng = async (lat, lng) => {
  //     const geocodeApiKey = "AIzaSyD590z__itIHB85Rrz0XJxEpi-PVYPs2b0"; // Your Google Maps API Key
  //     try {
  //       const response = await axios.get(
  //         `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${geocodeApiKey}`
  //       );
  //       const place = response.data.results[0]?.address_components.find((comp) =>
  //         comp.types.includes("locality")
  //       )?.long_name;

  //       return place || "Unknown location";
  //     } catch (error) {
  //       console.error("Error during geocoding:", error);
  //       return "Unknown location";
  //     }
  //   };

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
    const bingNewsApiKey = "5d37de4bda40423b8904c2a8fcc2b755";

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
  };

  return (
    <Container>
      <Typography variant="h4" textAlign="center" gutterBottom>
        Route Planner with Traffic, Weather, and News Insights
      </Typography>

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
            {directions && (
              <DirectionsRenderer
                directions={directions}
                routeIndex={optimalRouteIndex}
                options={{
                  polylineOptions: {
                    strokeColor: "#ff0000",
                    strokeWeight: 4,
                  },
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
                onClick={() => handleRouteSelect(index)}
              >
                <ListItemText
                  primary={`Route ${index + 1}`}
                  secondary={`Distance: ${detail.distance}, Duration: ${detail.duration}, Traffic Speed: ${detail.trafficSpeed} km/h, Traffic Volume: ${detail.trafficVolume}, ETA: ${detail.estimatedArrivalTime}`}
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
              <Place style={{ fontSize: "40px", color: "#1976d2" }} />
              {/* Start Icon */}
              <Typography variant="subtitle1" style={{ fontWeight: "bold" }}>
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
              <Flag style={{ fontSize: "40px", color: "#43a047" }} />
              {/* End Icon */}
              <Typography variant="subtitle1" style={{ fontWeight: "bold" }}>
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
                <a href={article.url} target="_blank" rel="noopener noreferrer">
                  {article.name}
                </a>
              </li>
            ))}
          </ul>
        </Paper>
      )}
    </Container>
  );
};

export default RoutePlanner;
