import React from 'react';

export default function CustomImage({ src, alt, className }) {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <img 
        src={src || 'https://via.placeholder.com/300'} 
        alt={alt || 'Imagem do produto'} 
        className={`object-cover w-full h-full ${className || ''}`}
      />
    </div>
  );
} 