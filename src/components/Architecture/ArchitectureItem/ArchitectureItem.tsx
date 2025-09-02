/**
 * circular component representing a microservice used for the bot
 */

import { Html } from '@react-three/drei';
import { useState } from "react"
import "./ArchitectureItem.css";
import { type ArchitectureItemType } from "../../../types/types";
export default function ArchitectureItem({ icon_img, popup_text}: ArchitectureItemType) {
    const [isHovered, setIsHovered] = useState(false);
    return (
       <Html center>
         <div className={`node_style ${isHovered && ""}`}
             onMouseEnter={() => setIsHovered(true)}
             onMouseLeave={() => setIsHovered(false)}
             >
            <img src={icon_img}/>
         </div>
       </Html>
    )
}