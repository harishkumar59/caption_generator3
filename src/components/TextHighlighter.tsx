"use client";

import React, { useState, useEffect, useRef } from 'react';

interface TextHighlighterProps {
  text: string;
  onHighlightChange?: (highlightedText: string) => void;
}

export default function TextHighlighter({ text, onHighlightChange }: TextHighlighterProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [highlightedText, setHighlightedText] = useState('');
  const textRef = useRef<HTMLDivElement>(null);

  // Split text into words for highlighting
  const words = text.split(' ');

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isPlaying && currentIndex < words.length) {
      interval = setInterval(() => {
        setCurrentIndex(prev => {
          const newIndex = prev + 1;
          if (newIndex >= words.length) {
            setIsPlaying(false);
            return prev;
          }
          return newIndex;
        });
      }, 1000 / playbackSpeed);
    }

    return () => clearInterval(interval);
  }, [isPlaying, currentIndex, words.length, playbackSpeed]);

  useEffect(() => {
    const currentHighlighted = words.slice(0, currentIndex + 1).join(' ');
    setHighlightedText(currentHighlighted);
    if (onHighlightChange) {
      onHighlightChange(currentHighlighted);
    }
  }, [currentIndex, words, onHighlightChange]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setIsPlaying(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <div 
        ref={textRef}
        className="p-4 bg-gray-800 rounded-lg min-h-[200px] max-h-[400px] overflow-y-auto"
      >
        {words.map((word, index) => (
          <span
            key={index}
            className={`inline-block mr-1 ${
              index <= currentIndex ? 'text-orange-400' : 'text-gray-400'
            }`}
          >
            {word}
          </span>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={handlePlayPause}
          className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          Reset
        </button>

        <div className="flex items-center gap-2">
          <span className="text-gray-300">Speed:</span>
          <select
            value={playbackSpeed}
            onChange={(e) => handleSpeedChange(Number(e.target.value))}
            className="bg-gray-700 text-white rounded px-2 py-1"
          >
            <option value={0.5}>0.5x</option>
            <option value={1}>1x</option>
            <option value={1.5}>1.5x</option>
            <option value={2}>2x</option>
          </select>
        </div>

        <div className="flex-1">
          <input
            type="range"
            min="0"
            max={words.length - 1}
            value={currentIndex}
            onChange={(e) => setCurrentIndex(Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
} 