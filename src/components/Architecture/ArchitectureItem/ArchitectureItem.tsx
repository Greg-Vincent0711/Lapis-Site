/**
 * circular component representing a microservice used for the bot
 */
import { Html } from '@react-three/drei';
import { useEffect, useRef, useState } from 'react';
import "./ArchitectureItem.css";
import { type ArchitectureItemType } from "../../../types/types";

export default function ArchitectureItem({
  icon_img, 
  isClicked, 
  details, 
  onClick,
}: ArchitectureItemType & { 
  onClick?: (event: React.MouseEvent) => void;
}) {
  const nodeRef = useRef<HTMLDivElement>(null);
  const [tooltipPosition, setTooltipPosition] = useState<'right' | 'left'>('right');
  
  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    onClick?.(event);
  };

  // Calculate optimal tooltip position - left or right only
  useEffect(() => {
    if (!isClicked || !nodeRef.current) return;

    const calculatePosition = () => {
      const nodeElement = nodeRef.current;
      if (!nodeElement) return;

      const rect = nodeElement.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      
      
      // Available space on each side
      const spaceLeft = rect.left;
      const spaceRight = viewportWidth - rect.right;

      setTooltipPosition(spaceRight >= spaceLeft ? "right" : "left");
    };

    // Calculate position immediately
    calculatePosition();
    console.log('Tooltip position:', tooltipPosition);
    
    // Recalculate on window resize
    const handleResize = () => calculatePosition();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isClicked]);

  // Determine the CSS classes to apply
  const getNodeClasses = () => {
    let classes = 'node_style';
    
    if (isClicked) {
      classes += ` tooltip-${tooltipPosition}`;
    }
    
    return classes;
  };
  
  return (
    <Html center>
      <div 
        ref={nodeRef}
        className={getNodeClasses()} 
        onClick={handleClick} 
        style={{ cursor: 'pointer' }}
      >
        {isClicked && (
          <div className="tooltip">
            {details}
          </div>
        )}
        <img src={icon_img} alt="Service icon" />
      </div>
    </Html>
  );
}