/**
 * Shared layout for the legal pages (Privacy Policy, Data Usage Policy).
 */
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import SiteNav from "../SiteNav/SiteNav";
import { CONTACT_EMAIL, EFFECTIVE_DATE } from "./legalConfig";
import "./LegalPage.css";

type LegalPageProps = {
  title: string;
  /** link to the companion policy shown under the title */
  related: { to: string; label: string };
  children: React.ReactNode;
};

export default function LegalPage({ title, related, children }: LegalPageProps) {
  useEffect(() => {
    document.title = `${title} · Lapis.bot`;
    window.scrollTo(0, 0);
    return () => {
      document.title = "Lapis.bot";
    };
  }, [title]);

  return (
    <div className="legal_page">
      <SiteNav page="legal" />
      <Link to="/" className="legal_back">
        <span aria-hidden="true">←</span> Back to Home
      </Link>
      <main className="legal_card">
        <header className="legal_header">
          <h1>{title}</h1>
          <p className="legal_meta">Effective {EFFECTIVE_DATE}</p>
          <p className="legal_meta">
            See also: <Link to={related.to}>{related.label}</Link>
          </p>
        </header>
        {children}
      </main>
    </div>
  );
}
