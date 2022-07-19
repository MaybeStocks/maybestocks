import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import CssBaseline from '@mui/material/CssBaseline';
import { ProvideAuth } from './hooks/useAuth.js';
import { BrowserRouter } from 'react-router-dom';
// import "bootstrap/dist/css/bootstrap.min.css";

// import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <>
    <CssBaseline />
    <BrowserRouter>
    <ProvideAuth>
        <App />
    </ProvideAuth>
    </BrowserRouter>
    </>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
