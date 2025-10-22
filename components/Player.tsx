
import React from 'react';
import type { Song } from '../types';
import PlayIcon from './icons/PlayIcon';
import PauseIcon from './icons/PauseIcon';
import NextIcon from './icons/NextIcon';
import PrevIcon from './icons/PrevIcon';
import MusicNoteIcon from './icons/MusicNoteIcon';

interface PlayerProps {
  currentSong: Song | null;
  isPlaying: boolean;
  progress: number;
  duration: number;
  currentTime: number;
  onTogglePlayPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onSeek: (time: number) => void;
}

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const Player: React.FC<PlayerProps> = ({
  currentSong,
  isPlaying,
  progress,
  duration,
  currentTime,
  onTogglePlayPause,
  onNext,
  onPrev,
  onSeek,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-white p-8 h-full">
      <div className="w-full max-w-sm aspect-square bg-gray-800 rounded-2xl shadow-2xl mb-8 flex items-center justify-center overflow-hidden">
        {currentSong ? (
          <img
            src={currentSong.albumArtUrl}
            alt={currentSong.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <MusicNoteIcon className="w-24 h-24 text-gray-500" />
        )}
      </div>

      <div className="w-full max-w-sm text-center">
        <h2 className="text-3xl font-bold truncate">
          {currentSong?.title || 'No Song Loaded'}
        </h2>
        <p className="text-lg text-gray-400 mt-1">
          {currentSong?.artist || 'Select a playlist'}
        </p>
      </div>

      <div className="w-full max-w-sm mt-8">
        <div className="relative h-2 bg-gray-700 rounded-full">
          <div
            className="absolute top-0 left-0 h-2 bg-indigo-500 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
           <input
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={(e) => onSeek(Number(e.target.value))}
                className="absolute w-full h-2 opacity-0 cursor-pointer"
                disabled={!currentSong}
            />
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-2">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className="flex items-center justify-center space-x-8 mt-8">
        <button
          onClick={onPrev}
          disabled={!currentSong}
          className="text-gray-400 hover:text-white transition duration-200 disabled:text-gray-600 disabled:cursor-not-allowed"
        >
          <PrevIcon className="w-8 h-8" />
        </button>
        <button
          onClick={onTogglePlayPause}
          disabled={!currentSong}
          className="bg-indigo-600 text-white rounded-full p-5 shadow-lg hover:bg-indigo-500 transition duration-200 disabled:bg-indigo-900 disabled:cursor-not-allowed"
        >
          {isPlaying ? <PauseIcon className="w-8 h-8" /> : <PlayIcon className="w-8 h-8" />}
        </button>
        <button
          onClick={onNext}
          disabled={!currentSong}
          className="text-gray-400 hover:text-white transition duration-200 disabled:text-gray-600 disabled:cursor-not-allowed"
        >
          <NextIcon className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
};

export default Player;
