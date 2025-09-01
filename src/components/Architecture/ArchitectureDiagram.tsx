/**
 * Renders a list of ArchitectureItems in a tree-based hierarchy using Reagraph
 * TODO
 * 
 */
import "./ArchitectureDiagram.css";
import { GraphCanvas, lightTheme } from "reagraph";
import ArchitectureItem from "./ArchitectureItem/ArchitectureItem";
import { serviceNodes, connections } from "./ArchitectureData";

export default function ArchitectureDiagram({id} : {id: string}){
    return(
        <section id={id} className="architecture_section">
            <header>
                <h1>System Architecture</h1>
            </header>
            <div style={{ position: "relative", width: '90%', height: '75%'}}>
                <GraphCanvas
                        layoutType="hierarchicalTd"
                        nodes={serviceNodes}
                        edges={connections}
                        theme={{
                            ...lightTheme,
                            canvas: {
                                ...lightTheme.canvas,
                                // transparent background
                                background: undefined
                            }
                        }}
                        //gives the graph a more spread out look
                        maxDistance={1020}
                        renderNode={({ node }) => (
                            <ArchitectureItem
                                icon_img={node.data.icon_img}
                                popup_text={node.data.popup_text}
                            />
                        )}
                    />
            </div>
        </section>
    )
}

