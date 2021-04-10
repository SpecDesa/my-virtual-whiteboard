
import React from 'react';
import ReactDOM from 'react-dom';
//For routing pages
import { BrowserRouter } from 'react-router-dom'

// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap/dist/js/bootstrap.min.js';

//Components and css 
import './index.css';
import App from './App';

// Not used
// import reportWebVitals from './reportWebVitals';

/**
 * Renders React browser router for not refreshing and losing state between redirects.
 */
ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
