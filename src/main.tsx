import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import configureAmplify from "./amplify-configure.ts";
import './index.css'
import App from './App.tsx'
import AuthProvider from './context/AuthProvider.tsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
configureAmplify();

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <AuthProvider>
      <RouterProvider router={router}/>
      </AuthProvider>
  </StrictMode>,
)
