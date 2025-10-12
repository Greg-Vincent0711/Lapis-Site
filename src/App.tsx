import React from 'react';
import HomePage from './components/HomePage/HomePage';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

/**
 * TODO
 * - Protected route to show users locations they saved
 * - Responsive design setup 
 * - Accessibility stuff
 * - Adding some other advanced feature(i11n maybe)
 */

/**
 * just has route setup stuff
 */

const App: React.FC = () => {
  return (
      <HomePage/>
  );
};

export default App;
