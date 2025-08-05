import "./Logo.css"
export default function Logo({id}: {id: string}){
    return (
        <section id={id} className="logo_section">
            <h1>Lapis</h1>
            <div className="img_container">
                <img src="lapis_lazuli.png"/>
            </div>
            <h2 className="subtitle">A Minecraft bot.</h2>
        </section>
    )
}