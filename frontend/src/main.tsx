import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import CustomToaster from './components/CustomToaster.tsx'
import { BrowserRouter as Router } from 'react-router-dom'
import ProviderWrapper from './components/ProviderWrapper.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div className="flex flex-col flex-1 h-full min-h-screen">
      <Router>
        <ProviderWrapper>
          <App />
          <CustomToaster />
        </ProviderWrapper>
      </Router>
    </div>
  </StrictMode>
)
