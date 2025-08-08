/**
 * circular component representing a technology used for the bot
 * On hover, a text blurb appears giving a small explanation on why that tech was used
 * Use the same glassmorphism effect
 */
import { useState } from "react"
import "./ArchitectureItem.css";
import { type ArchitectureItem } from "../../../types/types";
export default function ArchitectureItem({ icon_img, popup_text }: ArchitectureItem) {
    const [hover, setHover] = useState(false);

    return (
        <div className="main_item" 
             onMouseEnter={() => setHover(true)}
             onMouseLeave={() => setHover(false)}
             >
            <img src={icon_img}/>
            {hover && <div className="explanation">
                    {popup_text}
                </div>}
        </div>
    )
}