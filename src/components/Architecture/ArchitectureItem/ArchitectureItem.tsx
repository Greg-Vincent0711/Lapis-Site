/**
 * circular component representing a technology used for the bot
 * On hover, a text blurb appears giving a small explanation on why that tech was used
 * Use the same glassmorphism effect
 */

// allows regular html components to be rendered within 3js
import { Html } from '@react-three/drei';
import { useState } from "react"
import "./ArchitectureItem.css";
import { type ArchitectureItemType } from "../../../types/types";
export default function ArchitectureItem({ icon_img, popup_text }: ArchitectureItemType) {
    const [hover, setHover] = useState(false);
    return (
       <Html center>
         <div className="main_item" 
             onMouseEnter={() => setHover(true)}
             onMouseLeave={() => setHover(false)}
             >
            <img src={icon_img}/>
            {hover && <div className="explanation">
                    {popup_text}
                </div>}
         </div>
       </Html>
    )
}