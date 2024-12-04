import React from 'react';
import '../Dashboard.css';

const Footer = () => (
  <footer className="footer">
    <p>{new Date().toLocaleString()}</p>
    <p>&copy; 2024 Traffic Dashboard</p>
  </footer>
);

export default Footer;
