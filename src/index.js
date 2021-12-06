import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Provider } from './context/context';
import { SpeechProvider } from '@speechly/react-client'

ReactDOM.render(
  // <React.StrictMode>
  <SpeechProvider appId="a0166699-ba25-48d4-aaf0-8cfc8e8c04c0" language="en-US">
    <Provider>
      <App />
    </Provider>
  </SpeechProvider>,
  // </React.StrictMode>,
  document.getElementById('root')
);