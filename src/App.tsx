import React from 'react';
import Logo from './components/Logo/Logo';
import "./App.css"
const App: React.FC = () => {
  return (
    <div className="app-container">
      <div className="sidebar">
        <ul>
          <li><a>Lapis.bot</a></li>
          <li><a>What can Lapis do?</a></li>
          <li><a>System Design</a></li>
          <li><a>More from the Dev</a></li>
        </ul>
      </div>
      <div className="main-content">
          <Logo/>
      </div>
    </div>
  );
};

export default App;
