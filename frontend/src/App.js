import React from 'react';
import './App.css';

import logo from './assets/logo.svg';

function App() {
  return (
    <div className="container">
      <img src={logo} alt="AirCnC" />

      <div className="content">
        <p>
          Offer <strong>spots</strong> for software developers and find
          <strong> talents</strong> for your company.
        </p>

        <form>
          <label htmlFor="email">
            E-mail
            <input
              id="email"
              type="email"
              placeholder="Enter your e-mail address"
            />
          </label>
          <button type="submit" className="btn">
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
