import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Provider } from './context/context';
import { SpeechProvider } from '@speechly/react-client'

const appID = process.env.REACT_APP_SPPECHLY_APP_KEY;
ReactDOM.render(
  // <React.StrictMode>
  <SpeechProvider appId={appID} language="en-US">
    <Provider>
      <App />
    </Provider>
  </SpeechProvider>,
  // </React.StrictMode>,
  document.getElementById('root')
);