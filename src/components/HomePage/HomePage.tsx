import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Logo from '../Logo/Logo';
import Explanation from '../Explanation/Explanation';
import ArchitectureDiagram from '../Architecture/ArchitectureDiagram/ArchitectureDiagram';
import AuthModal from '../AuthModal/AuthModal';
import SiteNav from '../SiteNav/SiteNav';
import "./HomePage.css"
/**
 * TODO
 * - Setup Dashboard page
 * - Accessibility stuff
 * - Adding some other advanced feature(i11n maybe)
 */
const HomePage: React.FC = () => {
  const [showLogin, setShowLogin] = useState(false);
  const toggleModal = () => setShowLogin(!showLogin);
  const { hash } = useLocation();

  // arriving from another page via /#section: the router doesn't scroll to the anchor on its own
  useEffect(() => {
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView();
    }
  }, [hash]);

  return (
      <div className="app-container">
        <SiteNav page="home" onSignIn={toggleModal}/>

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
