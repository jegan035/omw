import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {HelmetProvider} from 'react-helmet-async';
import reportWebVitals from './reportWebVitals';
import{PayPalScriptProvider } from '@paypal/react-paypal-js'
import { StoreProvider } from './store';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


library.add(fas);

ReactDOM.render(
  <React.StrictMode>
    <StoreProvider>
    <HelmetProvider>
    <FontAwesomeIcon icon={[]} />
   <PayPalScriptProvider deferLoading={true}>
    <App />
    </PayPalScriptProvider>
    </HelmetProvider>
    </StoreProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
