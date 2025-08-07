import {useState} from "react"
import "./CommandCard.css"
import commandInfo from "./commands.json";
export default function CommandCard() {
  const [index, setIndex] = useState(0);
  

  const handlePrev = () => {
    setIndex((prev) => (prev === 0 ? commandInfo.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setIndex((prev) => (prev === commandInfo.length - 1 ? 0 : prev + 1));
  };

  const current = commandInfo[index];

  return (
    <div className="command-card">
      <header className="command-header">
        <div className="command-indicator">
          <span className="command-prefix">/</span>
          <h3 className="command-name">{current.command}</h3>
        </div>
        <div className="pagination-dots">
          {commandInfo.map((_, i) => (
            <div 
              key={i} 
              className={`dot ${i === index ? 'active' : ''}`}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      </header>
      
      <main className="command-content">
        <p className="command-description">{current.description}</p>
      </main>

      <div className="navigation-controls">
        <button 
          onClick={handlePrev} 
          className="nav-button prev"
          aria-label="Previous command"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M10 2L4 8l6 6v-4l-2-2 2-2V2z"/>
          </svg>
        </button>
        <span className="command-counter">
          {index + 1} of {commandInfo.length}
        </span>
        <button 
          onClick={handleNext} 
          className="nav-button next"
          aria-label="Next command"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M6 2v4l2 2-2 2v4l6-6L6 2z"/>
          </svg>
        </button>
      </div>
    </div>
  );
}