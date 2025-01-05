import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { SnackbarProvider } from "notistack";

createRoot(document.getElementById('root')).render(
  <SnackbarProvider maxSnack={300}
  autoHideDuration={3000}
    // The important part:
    anchorOrigin={{
      vertical: 'top',     // 'top' or 'bottom'
      horizontal: 'right', // 'left', 'center', or 'right'
    }}
  >
  <StrictMode>
    <App />
  </StrictMode>
  </SnackbarProvider>,
)
