/**
 * Renders a list of nodes in a tree-based hierarchy using Reagraph
 * Also has the context menu explaining what each service is used for.
 */
import {useState} from "react";
import "./ArchitectureDiagram.css";
import { GraphCanvas, lightTheme, type InternalGraphNode } from "reagraph";
// ArchitectureItems are individual nodes
import ArchitectureItem from "../ArchitectureItem/ArchitectureItem";
// hydrated with data from ArchitectureData
import { serviceNodes, connections } from "../ArchitectureData";

export default function ArchitectureDiagram({id} : {id: string}){
    const [clickedNode, setClickedNode] = useState<InternalGraphNode | undefined>(undefined);
    return(
        <section id={id} className="architecture_section">
            <header>
                <h1>System Architecture</h1>
            </header>
                <div style={{ position: "relative", width: '90%', height: '100%'}}>
                    <GraphCanvas
                            layoutType="hierarchicalTd"
                            nodes={serviceNodes}
                            edges={connections}
                            // onNodeClick={(node) => setClickedNode(node)}
                            // minNodeSize={15}
                            labelType="none"
                            theme={{
                                ...lightTheme,
                                canvas: {
                                    ...lightTheme.canvas,
                                    // transparent background
                                    background: undefined
                                }
                            }}
                            // controls the height of the graph
                            // 1150 lets nodes look spread out but not too far
                            // a higher max distance is akin to looking at the nodes closer together
                            maxDistance={1150}
                            renderNode={({ node }) => (
                                <ArchitectureItem
                                    icon_img={node.data.icon_img}
                                    onClick={() => setClickedNode(node)}
                                />
                            )}
                        />
                </div>
                {clickedNode !== undefined && (
                     <div className="overlay-box">
                        <h3>{clickedNode.label}</h3>
                        <p>{clickedNode.data?.popup_text}</p>
                        <button onClick={() => setClickedNode(undefined)}>Close</button>
                   </div>
                 )}
        </section>
    )
}