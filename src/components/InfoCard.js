import React from "react";
import animationData from "./vehicles.json"; // Your Lottie animation file
import "./InfoCard.css";
import Lottie from "lottie-react";
import aibot from './aijson.json'

const InfoCard = ({userData}) => {
  return (
    <div className="enhanced-container">
      <div className="info-section">
      <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start",
              borderRadius:8
            }}
          >
            <Lottie
              animationData={aibot}
              loop
              style={{
                width: 80,
                height: 80,
                marginRight: 10,breakBefore:8 // Add spacing between Lottie and the text
              }}
            />
            <h1 className="gradient-text" style={{ margin: 0 }}>
              Welcome {userData?.username}
            </h1>
          </div>
        <p className="description">
          Our Traffic Prediction System leverages historical traffic data to
          reduce traffic issues and predict future trends. By analyzing
          patterns, it aims to offer efficient solutions for traffic management
          and future planning.
        </p>
      </div>
      <div className="animation-section">
        <Lottie
          animationData={animationData}
          style={{ width: 400, height: 400 }}
        />
      </div>
    </div>
  );
};

export default InfoCard;
