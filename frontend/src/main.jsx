import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import axios from 'axios'

if (import.meta.env.VITE_API_URL) {
  let apiUrl = import.meta.env.VITE_API_URL;
  if (apiUrl.endsWith('/api')) {
    apiUrl = apiUrl.slice(0, -4);
  }
  axios.defaults.baseURL = apiUrl;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
