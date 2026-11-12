/**
 * Lightweight, mobile-friendly view of the AWS service hierarchy.
 * Built from the same data as the Reagraph diagram; tap a service to
 * reveal what it does.
 */
import { useState } from "react";
import "./ArchitectureTree.css";
import { serviceNodes, connections } from "../ArchitectureData";
import type { ArchitectureDataType } from "../../../types/types";

const childrenOf = new Map<string, string[]>();
connections.forEach(({ source, target }) => {
  childrenOf.set(source, [...(childrenOf.get(source) ?? []), target]);
});
const nodeById = new Map(serviceNodes.map((n) => [n.id, n]));
const targets = new Set(connections.map((c) => c.target));
const roots = serviceNodes.filter((n) => !targets.has(n.id));

export default function ArchitectureTree() {
  const [openId, setOpenId] = useState<string | null>(null);

  const renderNode = (node: ArchitectureDataType) => {
    const isOpen = openId === node.id;
    const children = (childrenOf.get(node.id) ?? [])
      .map((id) => nodeById.get(id))
      .filter((n): n is ArchitectureDataType => n !== undefined);
    const detailId = `arch-detail-${node.id}`;

    return (
      <li key={node.id}>
        <button
          type="button"
          className={`arch_tree_node${isOpen ? " is_open" : ""}`}
          aria-expanded={isOpen}
          aria-controls={detailId}
          onClick={() => setOpenId(isOpen ? null : node.id)}
        >
          <img src={node.data.icon_img} alt="" />
          <span className="arch_tree_label">{node.label}</span>
          <svg className="arch_tree_chevron" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
            <path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        {isOpen && (
          <p id={detailId} className="arch_tree_detail">
            {node.data.popup_text}
          </p>
        )}
        {children.length > 0 && <ul>{children.map(renderNode)}</ul>}
      </li>
    );
  };

  return (
    <div className="arch_tree">
      <p className="arch_tree_hint">Tap a service to see what it does.</p>
      <ul>{roots.map(renderNode)}</ul>
    </div>
  );
}
