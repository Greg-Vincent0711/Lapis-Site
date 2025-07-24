/**
 * Title saying Lapis
 */
import "./Logo.css"
export default function Logo(){
    return (
        <section className="logo_section">
            <h1>Lapis</h1>
            <div className="img_container">
                <img src="lapis_lazuli.png"/>
            </div>
            <h2>A multi-purpose bot for Minecraft</h2>
        </section>
    )
}