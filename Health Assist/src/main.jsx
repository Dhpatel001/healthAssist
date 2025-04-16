import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { SocketProvider } from './components/context/SocketContext.jsx'
// import { SocketProvider } from './components/SocketContext.jsx

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <SocketProvider>
    <App/>
    </SocketProvider>
    </BrowserRouter>
  </StrictMode>,
)
