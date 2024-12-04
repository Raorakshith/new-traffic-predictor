import React, { useEffect } from 'react';
import '../Dashboard.css';

const Map = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://api.tomtom.com/maps-sdk-for-web/6.x/6.x-sdk.js';
    script.onload = () => {
      const tt = window.tt;
      const map = tt.map({
        key: '5QpZLwcTD1Gz8dJ0O7o1u9vGokfRF1Og',
        container: 'map',
        center: [0, 0],
        zoom: 10,
      });
      map.addControl(new tt.NavigationControl());
    };
    document.body.appendChild(script);
  }, []);

  return <div id="map" className="map-container"></div>;
};

export default Map;
