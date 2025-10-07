import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import configureAmplify from "./amplify-configure.ts";
import './index.css'
import App from './App.tsx'
import AuthProvider from './context/AuthProvider.tsx';

configureAmplify();
createRoot(document.getElementById('root')!).render(
  <StrictMode>
        <AuthProvider>
          <App />
        </AuthProvider>
  </StrictMode>,
)
