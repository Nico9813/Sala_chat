import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Auth0Provider } from "@auth0/auth0-react";

ReactDOM.render(
  <Auth0Provider
    domain="dev-jx8fysvq.us.auth0.com"
    clientId="d0b0YU95Fq69C0QMovzgxjfv2oY5aXmT"
    redirectUri={window.location.origin}
    audience="https://api-prello/v1"
  >
  <React.StrictMode>
    <App />
  </React.StrictMode>
  </Auth0Provider >,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
