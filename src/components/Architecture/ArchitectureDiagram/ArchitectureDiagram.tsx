/**
 * Renders a list of ArchitectureItems in a tree-based hierarchy using Reagraph
 */
import "./ArchitectureDiagram.css";
import { GraphCanvas, lightTheme } from "reagraph";
import ArchitectureItem from "../ArchitectureItem/ArchitectureItem";
import { serviceNodes, connections } from "../ArchitectureData";
export default function ArchitectureDiagram({id} : {id: string}){
    /**
     * Render a menu on node click
     * Write a blurb for each explaining why a micro-service was used
     * 
     */

    const handleNodeHovered = () => {

    }
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
                        theme={{
                            ...lightTheme,
                            canvas: {
                                ...lightTheme.canvas,
                                // transparent background
                                background: undefined
                            }
                        }}
                        // controls the height of the graph
                        // 1150 allows the nodes to use the space healthily
                        maxDistance={1150}
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