import React, {useState} from 'react';
import Logo from './components/Logo/Logo';
import Explanation from './components/Explanation/Explanation';
import ArchitectureDiagram from './components/Architecture/ArchitectureDiagram/ArchitectureDiagram';
import AuthModal from './components/AuthModal/AuthModal';
import "./App.css"
import useAuth from './context/useAuth';

/**
 * TODO
 * - Protected route to show users locations they saved
 * - Responsive design setup 
 * - Accessibility stuff
 * - Adding some other advanced feature(i11n maybe)
 */
const App: React.FC = () => {
  const [showLogin, setShowLogin] = useState(false);
  const toggleModal = () => setShowLogin(!showLogin);
  const { currentUser, userSignOut } = useAuth();

  const handleClick = () => {
    if(currentUser == null){
      toggleModal();
    } else{
      /**
       * we don't need to toggle, since the modal shouldn't be open here
       */
      userSignOut();
    }
  }

  return (
      <div className="app-container">
        <section className="sidebar">
          <ul>
            <li><a href="#logo">Lapis.bot</a></li>
            <li><a href="#ex">What can Lapis do?</a></li>
            <li><a href="#design">System Architecture</a></li>
            {/** Add the link feature for this */}
            {currentUser !== null && <li><a> Saved Locations </a></li>}
          </ul>
        </section>
        <section className="login_bar">
            <button className="login_button" onClick={handleClick}>{currentUser == null ? "Sign In" : "Sign Out"}</button>
        </section>

        <main className="main-content">
              <Logo id={"logo"}/>
              <Explanation id={"ex"}/>
              <ArchitectureDiagram id={"design"}/>
        </main>
        <AuthModal showLogin={showLogin} toggle={toggleModal}/>
      </div>
  );
};

export default App;
