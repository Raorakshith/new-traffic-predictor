import React from 'react';
import '../Dashboard.css';

const Header = () => (
  <header className="header">
    <div className="header-content">
      <h1>Welcome to the Smart Traffic Dashboard</h1>
      <p>Your gateway to real-time traffic, weather, and insights.</p>
      <nav>
        <button className="nav-btn">Predict</button>
        <button className="nav-btn">Block Route</button>
        <button className="nav-btn">Manage</button>
      </nav>
    </div>
  </header>
);

export default Header;
