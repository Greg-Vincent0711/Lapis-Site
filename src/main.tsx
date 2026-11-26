import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import configureAmplify from "./amplify-configure.ts";
import App from './App.tsx'
import AuthProvider from './context/AuthProvider.tsx';
import { createBrowserRouter, RouterProvider} from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute.tsx';
import Dashboard from './components/Dashboard/Dashboard.tsx';
import CallbackPage from './components/CallbackPage/CallbackPage.tsx';
import PrivacyPolicy from './components/Legal/PrivacyPolicy.tsx';
import DataUsagePolicy from './components/Legal/DataUsagePolicy.tsx';
import './index.css'

configureAmplify();
const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    errorElement: <div>Error</div>
  },
  {
    path: "/dashboard",
    // protected from a user just typing in /dashboard
    element: <ProtectedRoute>
      <Dashboard/>
    </ProtectedRoute>
  },
  // Discord OAuth page
  {
    path: "/auth/callback",
    element: <CallbackPage/>
  },
  {
    path: "/privacy",
    element: <PrivacyPolicy/>
  },
  {
    path: "/data-usage",
    element: <DataUsagePolicy/>
  }

]);
createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <AuthProvider>
      <RouterProvider router={router}/>
      </AuthProvider>
  </StrictMode>,
)
