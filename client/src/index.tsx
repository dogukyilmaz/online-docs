import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import AuthContextProvider from 'context/AuthContext';
import DocContextProvider from 'context/DocumentContext';

ReactDOM.render(
  <React.StrictMode>
    <AuthContextProvider>
      <DocContextProvider>
        <App />
      </DocContextProvider>
    </AuthContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
