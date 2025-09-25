/**
 * Renders a list of nodes in a tree-based hierarchy using Reagraph
 * Tooltips automatically position themselves based on available space
 */
import "./ArchitectureDiagram.css";
import { useState, useEffect, useRef } from "react";
import { GraphCanvas, lightTheme } from "reagraph";
import ArchitectureItem from "../ArchitectureItem/ArchitectureItem";
import { serviceNodes, connections } from "../ArchitectureData";

export default function ArchitectureDiagram({ id }: { id: string }) {
  const [clickedNodeId, setClickedNodeId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleNodeClick = (nodeId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setClickedNodeId(clickedNodeId === nodeId ? null : nodeId);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (clickedNodeId && containerRef.current && 
          !containerRef.current.contains(event.target as Node)) {
        setClickedNodeId(null);
      }
    };

    if (clickedNodeId) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [clickedNodeId]);

  const handleContainerClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget && clickedNodeId) {
      setClickedNodeId(null);
    }
  };

  return (
    <section id={id} className="architecture_section">
      <header>
        <h1>System Architecture</h1>
      </header>
      
      <div 
        ref={containerRef}
        style={{ position: "relative", width: '90%', height: '100%' }}
        onClick={handleContainerClick}
      >
        <GraphCanvas
          layoutType="hierarchicalTd"
          nodes={serviceNodes}
          edges={connections}
          labelType="none"
          theme={{
            ...lightTheme,
            canvas: {
              ...lightTheme.canvas,
              background: undefined
            }
          }}
            // controls the height of the graph
            // 1550 lets nodes look spread out, but tooltips have enough space
            // a higher max distance is akin to looking at the nodes closer together
          maxDistance={1550}
          renderNode={({ node }) => (
            <ArchitectureItem
              icon_img={node.data.icon_img}
              details={node.data.popup_text}
              isClicked={clickedNodeId === node.id}
              onClick={(event) => handleNodeClick(node.id, event)}
            />
          )}
        />
      </div>
    </section>
  );
}