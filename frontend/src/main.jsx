import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import axios from 'axios'

const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
axios.defaults.baseURL = apiUrl;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
