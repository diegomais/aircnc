import React, { useState } from 'react';
import api from './services/api';
import './App.css';

import logo from './assets/logo.svg';

function App() {
  const [email, setEmail] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();

    const response = await api.post('/sessions', { email });

    localStorage.setItem('aircnc:user', response.data._id);
  }

  return (
    <div className="container">
      <img src={logo} alt="AirCnC" />

      <div className="content">
        <p>
          Offer <strong>spots</strong> for software developers and find
          <strong> talents</strong> for your company.
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="email">
            E-mail
            <input
              id="email"
              type="email"
              placeholder="Enter your e-mail address"
              value={email}
              onChange={e => setEmail(e.target.value)}
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
