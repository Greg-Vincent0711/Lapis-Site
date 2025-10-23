import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import configureAmplify from "./amplify-configure.ts";
import './index.css'
import App from './App.tsx'
import AuthProvider from './context/AuthProvider.tsx';
import { createBrowserRouter, RouterProvider} from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute.tsx';
import Dashboard from './components/Dashboard/Dashboard.tsx';
import CallbackPage from './components/CallbackPage/CallbackPage.tsx';
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
  {
    path: "/auth/callback",
    element: <CallbackPage/>
  }

]);
createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <AuthProvider>
      <RouterProvider router={router}/>
      </AuthProvider>
  </StrictMode>,
)
