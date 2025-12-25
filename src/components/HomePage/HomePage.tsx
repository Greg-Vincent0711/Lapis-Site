import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import Logo from '../Logo/Logo';
import Explanation from '../Explanation/Explanation';
import ArchitectureDiagram from '../Architecture/ArchitectureDiagram/ArchitectureDiagram';
import AuthModal from '../AuthModal/AuthModal';
import useAuth from '../../context/useAuth';
import "./HomePage.css"
/**
 * TODO
 * - Setup Dashboard page
 * - Responsive design setup 
 * - Accessibility stuff
 * - Adding some other advanced feature(i11n maybe)
 */
const HomePage: React.FC = () => {
  const [showLogin, setShowLogin] = useState(false);
  const toggleModal = () => setShowLogin(!showLogin);
  const { currentUser, userSignOut } = useAuth();
  const handleLogin = () => {
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
            {/** ProtectedRoute checks currentUser in main.tsx */}
            {currentUser && <li><Link to="/dashboard"> Saved Locations </Link></li>}
          </ul>
        </section>
        <section className="login_bar">
            <button className="login_button" onClick={handleLogin}>{currentUser == null ? "Sign In" : "Sign Out"}</button>
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

export default HomePage;
