import "./Explanation.css"
import CommandCard from "../CommandCard/CommandCard"
export default function Explanation({id}: {id: string}){
    return(
        <section id={id} className="exp_section">
            <h2 id="section_title">What can Lapis do? </h2>
            <h3>Some brief ramblings on why I made this...</h3>
            <p id="ex_paragraph">During one of many 2 week Minecraft phases, I was tired of having to take a screenshot of 
                new discoveries or important locations in my Minecraft world, and then haphazardly
                scroll through a bunch of photos on my phone to find what I was looking for a couple days later. This gave me the idea
                to store information somewhere and grab it through Discord. Originally, that's all Lapis was going to be!
                Then I got intrigued by the idea of turning this into an indepth professional development project. And here we are.
            </p>
            <CommandCard/>
        </section>
    )
}