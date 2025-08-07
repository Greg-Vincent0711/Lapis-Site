import CommandCard from "../CommandCard/CommandCard"
import "./Explanation.css"
export default function Explanation({ id = "explanation" }) {
    return (
      <section id={id} className="explanation-section">
        <div className="content-container">
          <header className="section-header">
            <h1 className="main-title">What can Lapis do?</h1>
            <h2 className="subtitle">Some brief ramblings on why I made this...</h2>
          </header>
  
          <div className="expl-content">
            <p className="expl-text">
              During one of many 2 week Minecraft phases, I was tired of having to take a screenshot of 
              new discoveries or important locations in my Minecraft world, and then haphazardly 
              scroll through a bunch of photos on my phone to find what I was looking for a couple days later.
              And as such I got to work on building something I thought was pretty cool that quickly became complex.
            </p>
            <p className="expl-text">
              The command descriptions below are general, send !helpme to get specific usage details.
            </p>
          </div>
  
          <div className="command-showcase">
            <CommandCard />
          </div>
        </div>
        </section>
    )}