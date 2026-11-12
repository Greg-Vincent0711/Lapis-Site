/**
 * System architecture section.
 * Desktop/tablet: interactive Reagraph canvas (lazy-loaded).
 * Phones: lightweight, CSS-only hierarchy of the AWS services.
 */
import "./ArchitectureDiagram.css";
import { lazy, Suspense } from "react";
import ArchitectureTree from "../ArchitectureTree/ArchitectureTree";
import useMediaQuery, { MOBILE_QUERY } from "../../../utils/useMediaQuery";

const ArchitectureGraph = lazy(() => import("./ArchitectureGraph"));

export default function ArchitectureDiagram({ id }: { id: string }) {
  const isMobile = useMediaQuery(MOBILE_QUERY);

  return (
    <section id={id} className="architecture_section">
      <header>
        <h1>System Architecture</h1>
      </header>

      {isMobile ? (
        <ArchitectureTree />
      ) : (
        <Suspense fallback={null}>
          <ArchitectureGraph />
        </Suspense>
      )}
    </section>
  );
}
