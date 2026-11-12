/**
 * Site navigation shared by the home page and the Saved Locations dashboard.
 * Desktop: fixed sidebar + login bar (home page only).
 * ≤1024px: a single top app bar with a dropdown menu (both pages).
 */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../context/useAuth";
import "./SiteNav.css";

type SiteNavProps = {
  /** "home" links to sections on the same page; "dashboard" links back to them. */
  page: "home" | "dashboard";
  /** Opens the sign-in modal (home page only). */
  onSignIn?: () => void;
};

export default function SiteNav({ page, onSignIn }: SiteNavProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { currentUser, userSignOut } = useAuth();
  const navigate = useNavigate();
  const closeMenu = () => setMenuOpen(false);
  const onHome = page === "home";

  const handleLogin = async () => {
    closeMenu();
    if (currentUser == null) {
      onSignIn?.();
      return;
    }
    await userSignOut();
    if (!onHome) navigate("/");
  };

  // same-page anchors on the home page, router links back to them elsewhere
  const sectionLink = (hash: string, label: string, className?: string) =>
    onHome ? (
      <a href={`#${hash}`} className={className} onClick={closeMenu}>{label}</a>
    ) : (
      <Link to={`/#${hash}`} className={className} onClick={closeMenu}>{label}</Link>
    );

  return (
    <header
      className={`site_header${menuOpen ? " menu_open" : ""}${onHome ? "" : " site_header--mobile_only"}`}
    >
      <button
        type="button"
        className="menu_toggle"
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
        aria-controls="site-nav"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span className="menu_toggle_bar" />
        <span className="menu_toggle_bar" />
        <span className="menu_toggle_bar" />
      </button>
      {sectionLink("logo", "Lapis.bot", "mobile_brand")}
      <nav id="site-nav" className="sidebar">
        <ul>
          <li>{sectionLink("logo", "Lapis.bot")}</li>
          <li>{sectionLink("ex", "What can Lapis do?")}</li>
          <li>{sectionLink("design", "System Architecture")}</li>
          {/** ProtectedRoute checks currentUser in main.tsx */}
          {currentUser && (
            <li>
              <Link
                to="/dashboard"
                onClick={closeMenu}
                aria-current={onHome ? undefined : "page"}
              >
                Saved Locations
              </Link>
            </li>
          )}
        </ul>
      </nav>
      <div className="login_bar">
        <button className="login_button" onClick={handleLogin}>
          {currentUser == null ? "Sign In" : "Sign Out"}
        </button>
      </div>
    </header>
  );
}
