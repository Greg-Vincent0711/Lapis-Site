import React from 'react';
import Logo from './components/Logo/Logo';
import Explanation from './components/Explanation/Explanation';
import Design from './components/SystemDesign/SystemDesign';
import "./App.css"

const App: React.FC = () => {
  return (
    <div className="app-container">
      <div className="sidebar">
        <ul>
          <li><a href="#logo">Lapis.bot</a></li>
          <li><a href="#ex">What can Lapis do?</a></li>
          <li><a href="#design">System Design</a></li>
        </ul>
      </div>
      <div className="main-content">
            <Logo id={"logo"}/>
            <Explanation id={"ex"}/>
            <Design id={"design"}/>
      </div>
    </div>
  );
};

export default App;
