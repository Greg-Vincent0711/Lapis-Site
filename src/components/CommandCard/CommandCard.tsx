import { useState } from 'react';
import './CommandCard.css';

const commands = [
  {
    title: "Lapis' Commands",
    items: [
      { command: "!ss", desc: "Set your seed – passed to C executable to find info about your world." },
      { command: "!deleteImg", desc: "Delete an image stored for a location." },
      { command: "!saveImg", desc: "Store an image for a saved place." },
    ],
  },
  {
    title: "Advanced Commands",
    items: [
      { command: "!listCoords", desc: "List all saved coordinates in your world." },
      { command: "!exportData", desc: "Export your saved locations as a .json file." },
    ],
  },
  // Add more sets as needed
];

export default function CommandCard() {
  const [index, setIndex] = useState(0);

  const handlePrev = () => {
    setIndex((prev) => (prev === 0 ? commands.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setIndex((prev) => (prev === commands.length - 1 ? 0 : prev + 1));
  };

  const current = commands[index];

  return (
    <div className="discord-card">
      <div className="header">
        <img src="/lapis-icon.png" alt="Lapis" className="bot-icon" />
        <span className="bot-name">Lapis</span>
        <span className="bot-tag">APP</span>
        <span className="time-stamp">1:11 PM</span>
      </div>

      <div className="content-box">
        <h3>{current.title}</h3>
        <ul>
          {current.items.map((item, idx) => (
            <li key={idx}>
              <span className="command">{item.command}</span> – {item.desc}
            </li>
          ))}
        </ul>
      </div>

      <div className="button-row">
        <button onClick={handlePrev}>&lt;</button>
        <button onClick={handleNext}>&gt;</button>
      </div>
    </div>
  );
}
