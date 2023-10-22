import React from 'react';
import { createRoot } from 'react-dom/client';
import AppWrapper from './components/AppWrapper';
import { BrowserRouter } from 'react-router-dom';
import './css/styles.css';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
  <BrowserRouter>
    <AppWrapper />
  </BrowserRouter>
);
