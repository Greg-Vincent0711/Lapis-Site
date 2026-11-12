import "./Logo.css"
export default function Logo({id}: {id: string}){
    return (
        <section id={id} className="logo_section">
            <h1>Lapis</h1>
            <div className="img_container">
                <img src="lapis_lazuli.png" alt="Pixel-art lapis lazuli" width={360} height={360}/>
            </div>
            <h2 className="subtitle">A Minecraft service.</h2>
        </section>
    )
}