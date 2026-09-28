import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import { AuthProvider } from './context/AuthContext'
import { ReservasProvider } from './context/ReservasContext'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MotionConfig reducedMotion="user">
    <BrowserRouter>
      <AuthProvider>
        <ReservasProvider>
          <App />
        </ReservasProvider>
      </AuthProvider>
    </BrowserRouter>
    </MotionConfig>
  </React.StrictMode>,
)