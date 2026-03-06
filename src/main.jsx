import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { HelmetProvider } from 'react-helmet-async'
import NotificationProvider from "./context/NotifycationContex.js"
import { SocketProvider } from './context/SocketContext.js'
const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <SocketProvider>
        <QueryClientProvider client={queryClient}>
          <NotificationProvider>
            <App />
          </NotificationProvider>
      </QueryClientProvider>
      </SocketProvider>
    </HelmetProvider>
  </StrictMode>,
)
