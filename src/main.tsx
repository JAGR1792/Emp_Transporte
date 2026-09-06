import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ReservasProvider } from './context/ReservasContext'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ReservasProvider>
          <App />
        </ReservasProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)