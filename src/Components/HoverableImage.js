import React, { useState } from 'react';

const HoverableImage = ({ 
  src, 
  alt, 
  className = "", 
  hoverClassName = "transform scale-150 z-50 shadow-2xl",
  containerClassName = "relative inline-block",
  enableHover = true
}) => {
  const [isHovered, setIsHovered] = useState(false);

  if (!enableHover) {
    return <img src={src} alt={alt} className={className} />;
  }

  return (
    <div className={`${containerClassName} ${isHovered ? 'z-50' : ''}`}>
      <img
        src={src}
        alt={alt}
        className={`${className} transition-all duration-300 ease-in-out cursor-pointer ${
          isHovered ? hoverClassName : ''
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      />
    </div>
  );
};

export default HoverableImage;