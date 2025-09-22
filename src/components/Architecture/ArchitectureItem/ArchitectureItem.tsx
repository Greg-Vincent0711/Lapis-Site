/**
 * circular component representing a microservice used for the bot
 */

import { Html } from '@react-three/drei';
import "./ArchitectureItem.css";
import { type ArchitectureItemType } from "../../../types/types";
export default function ArchitectureItem({icon_img, onClick}: ArchitectureItemType) {
    return (
       <Html center>
         <div className="node_style" onClick={onClick}>
            <img src={icon_img}/>
         </div>
       </Html>
    )
}