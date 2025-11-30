import React from 'react';

interface SliderProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  descriptionLeft: string;
  descriptionRight: string;
}

export const Slider: React.FC<SliderProps> = ({ 
  label, 
  value, 
  onChange,
  descriptionLeft,
  descriptionRight
}) => {
  const sliderId = `slider-${label.replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <div className="mb-6">
      <div className="flex justify-between items-end mb-2">
        <label htmlFor={sliderId} className="text-white font-semibold text-lg cursor-pointer">
          {label}
        </label>
        <span className="text-accent font-mono font-bold text-xl" aria-hidden="true">{value}%</span>
      </div>
      <div className="relative h-8 flex items-center">
        <input
          id={sliderId}
          type="range"
          min="0"
          max="100"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full z-10"
          aria-label={label}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={value}
        />
        {/* Track Background Gradient to visualize intensity */}
        <div className="absolute top-1/2 left-0 w-full h-1 -mt-0.5 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 rounded pointer-events-none"></div>
      </div>
      <div className="flex justify-between text-xs text-gray-500 mt-1 uppercase tracking-wider" aria-hidden="true">
        <span>{descriptionLeft}</span>
        <span>{descriptionRight}</span>
      </div>
    </div>
  );
};