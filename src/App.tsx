import React, {useState, useContext} from 'react';
import Logo from './components/Logo/Logo';
import Explanation from './components/Explanation/Explanation';
import ArchitectureDiagram from './components/Architecture/ArchitectureDiagram/ArchitectureDiagram';
import AuthModal from './components/AuthModal/AuthModal';
import "./App.css"
import AuthContext from './context/authContext';

/**
 * TODO
 * - Custom Login page
 * - Protected route to show users locations they saved
 * - Responsive design setup 
 * - Accessibility stuff
 * - Adding some other advanced feature(i11n maybe)
 */
const App: React.FC = () => {
  const [showLogin, setShowLogin] = useState(false);
  const toggleLogin = () => setShowLogin(!showLogin);
  const authCTX = useContext(AuthContext);

  return (
      <div className="app-container">
        <section className="sidebar">
          <ul>
            <li><a href="#logo">Lapis.bot</a></li>
            <li><a href="#ex">What can Lapis do?</a></li>
            <li><a href="#design">System Architecture</a></li>
          </ul>
        </section>
        {/**Login Section */}
        <section className="login_bar">
          <button className="login_button" onClick={toggleLogin}>Sign In</button>
        </section>

        <main className="main-content">
              <Logo id={"logo"}/>
              <Explanation id={"ex"}/>
              <ArchitectureDiagram id={"design"}/>
        </main>
        <AuthModal showLogin={showLogin} toggle={toggleLogin}/>
      </div>
  );
};

export default App;
