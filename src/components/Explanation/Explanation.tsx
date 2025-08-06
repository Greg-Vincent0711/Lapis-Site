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
  
          <div className="story-content">
            <p className="story-text">
              During one of many 2 week Minecraft phases, I was tired of having to take a screenshot of 
              new discoveries or important locations in my Minecraft world, and then haphazardly 
              scroll through a bunch of photos on my phone to find what I was looking for a couple days later.
            </p>
            <p className="story-text">
              This gave me the idea to store information somewhere and grab it through Discord. Originally, 
              that's all Lapis was going to be! Then I got intrigued by the idea of turning this into an 
              in-depth professional development project. And here we are.
            </p>
          </div>
  
          <div className="command-showcase">
            <CommandCard />
          </div>
        </div>
        </section>
    )}