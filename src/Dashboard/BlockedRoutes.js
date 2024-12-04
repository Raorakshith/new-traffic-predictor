// import React, { useState } from "react";
// import {
//   GoogleMap,
//   DirectionsRenderer,
//   Marker,
//   useJsApiLoader,
// } from "@react-google-maps/api";
// import {
//   Container,
//   Grid,
//   Button,
//   Typography,
//   CircularProgress,
//   Paper,
//   List,
//   ListItem,
//   ListItemText,
// } from "@mui/material";
// import { getFirestore, doc, setDoc, collection, deleteDoc, onSnapshot } from "firebase/firestore";
// import { initializeApp } from "firebase/app";
// import { db } from "../firebase";



// const containerStyle = {
//   width: "100%",
//   height: "600px",
// };

// const center = { lat: 12.9716, lng: 77.5946 };

// const MapWithAdminControls = () => {
//   const [startPoint, setStartPoint] = useState(null);
//   const [endPoint, setEndPoint] = useState(null);
//   const [directions, setDirections] = useState(null);
//   const [routeDetails, setRouteDetails] = useState([]);
//   const [blockedRoutes, setBlockedRoutes] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const { isLoaded } = useJsApiLoader({
//     googleMapsApiKey: "AIzaSyD590z__itIHB85Rrz0XJxEpi-PVYPs2b0",
//     libraries: ["places"],
//   });
//   React.useEffect(() => {
//     const unsubscribe = onSnapshot(collection(db, "blockedRoutes"), (snapshot) => {
//       const routes = snapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       }));
//       setBlockedRoutes(routes);
//     });
//     return () => unsubscribe();
//   }, []);

//   if (!isLoaded) return <CircularProgress />;

//   const fetchRoutes = async () => {
//     if (!startPoint || !endPoint) {
//       alert("Please select both start and end points!");
//       return;
//     }

//     setLoading(true);
//     const directionsService = new google.maps.DirectionsService();
//     directionsService.route(
//       {
//         origin: startPoint,
//         destination: endPoint,
//         travelMode: google.maps.TravelMode.DRIVING,
//         provideRouteAlternatives: true,
//       },
//       (result, status) => {
//         if (status === "OK") {
//           setDirections(result);
//           const details = result.routes.map((route, index) => {
//             const leg = route.legs[0];
//             return {
//               routeIndex: index,
//               distance: leg.distance.text,
//               duration: leg.duration.text,
//               polyline: route.overview_polyline,
//             };
//           });
//           setRouteDetails(details);
//         } else {
//           alert("Error fetching directions: " + status);
//         }
//         setLoading(false);
//       }
//     );
//   };

//   const handleMapClick = (event) => {
//     if (!startPoint) {
//       setStartPoint({
//         lat: event.latLng.lat(),
//         lng: event.latLng.lng(),
//       });
//     } else if (!endPoint) {
//       setEndPoint({
//         lat: event.latLng.lat(),
//         lng: event.latLng.lng(),
//       });
//     }
//   };

//   const blockRoute = async (route) => {
//     const routeDoc = doc(collection(db, "blockedRoutes"));
//     await setDoc(routeDoc, {
//       id: routeDoc.id,
//       routeIndex: route.routeIndex,
//       distance: route.distance,
//       duration: route.duration,
//       polyline: route.polyline,
//     });
//   };

//   const unblockRoute = async (routeId) => {
//     await deleteDoc(doc(db, "blockedRoutes", routeId));
//   };

//   // Fetch blocked routes from Firestore
 
//   return (
//     <Container>
//       <Typography variant="h4" textAlign="center" gutterBottom>
//         Route Planner with Blocking Feature
//       </Typography>

//       <Grid container spacing={2}>
//         <Grid item xs={12}>
//           <GoogleMap
//             mapContainerStyle={containerStyle}
//             center={center}
//             zoom={13}
//             onClick={handleMapClick}
//           >
//             {startPoint && <Marker position={startPoint} label="Start" />}
//             {endPoint && <Marker position={endPoint} label="End" />}
//             {directions && (
//               <DirectionsRenderer
//                 directions={directions}
//                 options={{
//                   suppressMarkers: true,
//                 }}
//               />
//             )}
//           </GoogleMap>
//         </Grid>
//         <Grid item xs={12} md={6}>
//           <Button
//             variant="contained"
//             color="primary"
//             fullWidth
//             onClick={fetchRoutes}
//             disabled={loading}
//           >
//             {loading ? "Fetching Routes..." : "Show Routes"}
//           </Button>
//         </Grid>
//       </Grid>

//       {routeDetails.length > 0 && (
//         <Paper style={{ padding: "10px", marginTop: "20px" }}>
//           <Typography variant="h6">Available Routes:</Typography>
//           <List>
//             {routeDetails.map((route) => (
//               <ListItem key={route.routeIndex}>
//                 <ListItemText
//                   primary={`Route ${route.routeIndex + 1}: ${route.distance}, ${route.duration}`}
//                 />
//                 <Button
//                   variant="contained"
//                   color="secondary"
//                   onClick={() => blockRoute(route)}
//                 >
//                   Block Route
//                 </Button>
//               </ListItem>
//             ))}
//           </List>
//         </Paper>
//       )}

//       {blockedRoutes.length > 0 && (
//         <Paper style={{ padding: "10px", marginTop: "20px" }}>
//           <Typography variant="h6">Blocked Routes:</Typography>
//           <List>
//             {blockedRoutes.map((route) => (
//               <ListItem key={route.id}>
//                 <ListItemText
//                   primary={`Route ${route.routeIndex + 1}: ${route.distance}, ${route.duration}`}
//                 />
//                 <Button
//                   variant="contained"
//                   color="primary"
//                   onClick={() => unblockRoute(route.id)}
//                 >
//                   Unblock Route
//                 </Button>
//               </ListItem>
//             ))}
//           </List>
//         </Paper>
//       )}
//     </Container>
//   );
// };

// export default MapWithAdminControls;

import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  DirectionsRenderer,
  Marker,
  useJsApiLoader,
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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import {
  getFirestore,
  doc,
  setDoc,
  collection,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase"; // Ensure `firebase.js` exports configured `db` and `storage`

const containerStyle = {
  width: "100%",
  height: "600px",
};

const center = { lat: 12.9716, lng: 77.5946 };

const MapWithAdminControls = () => {
  const [startPoint, setStartPoint] = useState(null);
  const [endPoint, setEndPoint] = useState(null);
  const [directions, setDirections] = useState(null);
  const [routeDetails, setRouteDetails] = useState([]);
  const [blockedRoutes, setBlockedRoutes] = useState([]);
  const [loading, setLoading] = useState(false);

  // Dialog state
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [blockageType, setBlockageType] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyD590z__itIHB85Rrz0XJxEpi-PVYPs2b0",
    libraries: ["places"],
  });

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "blockedRoutes"), (snapshot) => {
      const routes = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBlockedRoutes(routes);
    });
    return () => unsubscribe();
  }, []);

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
          const details = result.routes.map((route, index) => {
            const leg = route.legs[0];
            return {
              routeIndex: index,
              distance: leg.distance.text,
              duration: leg.duration.text,
              polyline: route.overview_polyline,
            };
          });
          setRouteDetails(details);
        } else {
          alert("Error fetching directions: " + status);
        }
        setLoading(false);
      }
    );
  };

  const handleMapClick = (event) => {
    if (!startPoint) {
      setStartPoint({
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      });
    } else if (!endPoint) {
      setEndPoint({
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      });
    }
  };

  const openBlockDialog = (route) => {
    console.log(route)
    setSelectedRoute(route);
    setOpenDialog(true);
  };

  const handleBlockRoute = async () => {
    if (!blockageType || !description) {
      alert("Please fill all the details.");
      return;
    }

    try {
      let imageUrl = null;

      if (image) {
        const storageRef = ref(storage, `images/${image.name}`);
        await uploadBytes(storageRef, image);
        imageUrl = await getDownloadURL(storageRef);
      }

      const routeDoc = doc(collection(db, "blockedRoutes"));
      await setDoc(routeDoc, {
        id: routeDoc.id,
        routeIndex: selectedRoute.routeIndex,
        distance: selectedRoute.distance,
        duration: selectedRoute.duration,
        polyline: selectedRoute.polyline,
        blockageType,
        description,
        image: imageUrl,
      });

      alert("Route blocked successfully!");
      setOpenDialog(false);
      setBlockageType("");
      setDescription("");
      setImage(null);
    } catch (error) {
      console.error("Error blocking route:", error);
      alert("Failed to block the route. Please try again.");
    }
  };

  const unblockRoute = async (routeId) => {
    await deleteDoc(doc(db, "blockedRoutes", routeId));
  };

  return (
    <Container>
      <Typography variant="h4" textAlign="center" gutterBottom>
        Route Planner with Blocking Feature
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
                options={{
                  suppressMarkers: true,
                }}
              />
            )}
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
            {loading ? "Fetching Routes..." : "Show Routes"}
          </Button>
        </Grid>
      </Grid>

      {routeDetails.length > 0 && (
        <Paper style={{ padding: "10px", marginTop: "20px" }}>
          <Typography variant="h6">Available Routes:</Typography>
          <List>
            {routeDetails.map((route) => (
              <ListItem key={route.routeIndex}>
                <ListItemText
                  primary={`Route ${route.routeIndex + 1}: ${route.distance}, ${route.duration}`}
                />
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => openBlockDialog(route)}
                >
                  Block Route
                </Button>
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      {blockedRoutes.length > 0 && (
        <Paper style={{ padding: "10px", marginTop: "20px" }}>
          <Typography variant="h6">Blocked Routes:</Typography>
          <List>
            {blockedRoutes.map((route) => (
              <ListItem key={route.id}>
                <ListItemText
                  primary={`Route ${route.routeIndex + 1}: ${route.distance}, ${route.duration}`}
                  secondary={
                    <>
                      <Typography>Type: {route.blockageType}</Typography>
                      <Typography>Description: {route.description}</Typography>
                      {route.image && (
                        <img
                          src={route.image}
                          alt={`Blocked route ${route.routeIndex + 1}`}
                          style={{
                            width: "100px",
                            height: "100px",
                            objectFit: "cover",
                            marginTop: "10px",
                          }}
                        />
                      )}
                    </>
                  }
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => unblockRoute(route.id)}
                >
                  Unblock Route
                </Button>
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      {/* Dialog for blocking route */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Block Route</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Blockage Type</InputLabel>
            <Select
              value={blockageType}
              onChange={(e) => setBlockageType(e.target.value)}
            >
              <MenuItem value="Road Block">Road Block</MenuItem>
              <MenuItem value="Accident">Accident</MenuItem>
              <MenuItem value="Flood">Flood</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            margin="normal"
          />
          <Button variant="contained" component="label">
            Upload Image
            <input
              type="file"
              hidden
              onChange={(e) => setImage(e.target.files[0])}
            />
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleBlockRoute} color="primary" variant="contained">
            Block
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MapWithAdminControls;
