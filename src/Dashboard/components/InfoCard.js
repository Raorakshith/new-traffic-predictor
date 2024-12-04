import React from 'react';
import '../Dashboard.css';

const InfoCard = ({ title, value, icon }) => (
  <div className="info-card">
    <div className="info-icon">{icon}</div>
    <div>
      <h3>{title}</h3>
      <p>{value}</p>
    </div>
  </div>
);

export default InfoCard;
