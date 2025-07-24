import React from 'react';
import Logo from './components/Logo/Logo';
import Explanation from './components/Explanation/Explanation';
import Design from './components/SystemDesign/Design';
import "./App.css"
const App: React.FC = () => {
  return (
    <div className="app-container">
      <div className="sidebar">
        <ul>
          <li><a href="#logo">Lapis.bot</a></li>
          <li><a href="#ex">What can Lapis do?</a></li>
          <li><a>System Design</a></li>
          <li><a>More from the Dev</a></li>
        </ul>
      </div>
      <div className="main-content">
          <div id="logo">
            <Logo/>
          </div>
          <div id="ex">
            <Explanation/>
          </div>
          <div> 
            <Design/>
          </div>
      </div>
    </div>
  );
};

export default App;
