import React from 'react';
import Routes from './routes';
import './App.css';
import logo from './assets/logo.svg';

function App() {
  return (
    <div className="container">
      <img src={logo} alt="AirCnC" />

      <div className="content">
        <Routes />
      </div>
    </div>
  );
}

export default App;
