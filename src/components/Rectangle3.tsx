import React from 'react';

interface Rectangle3Props {
  className?: string;
}

const Rectangle3: React.FC<Rectangle3Props> = ({ className = '' }) => {
  return (
    <div 
      className={`w-[100px] h-[50px] rounded-[10px] ${className}`}
      style={{ backgroundColor: '#fd6e6e' }}
    />
  );
};

export default Rectangle3;