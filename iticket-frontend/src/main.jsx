import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { BasketProvider } from './context/BasketContext.jsx';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <BasketProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </BasketProvider>
    </AuthProvider>
  </StrictMode>
);
