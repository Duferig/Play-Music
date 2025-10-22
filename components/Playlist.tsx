import React from 'react';
import type { Song } from '../types';
import PlayIcon from './icons/PlayIcon';

interface PlaylistProps {
  songs: Song[];
  currentSongIndex: number | null;
  onSelectSong: (index: number) => void;
  isPlaying: boolean;
}

const Playlist: React.FC<PlaylistProps> = ({ songs, currentSongIndex, onSelectSong, isPlaying }) => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg p-4 flex-grow flex flex-col">
      <h3 className="text-xl font-bold text-white mb-4 px-2">Up Next</h3>
      <div className="overflow-y-auto flex-grow">
        {songs.length > 0 ? (
          <ul>
            {songs.map((song, index) => (
              <li
                key={song.id}
                onClick={() => onSelectSong(index)}
                className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors duration-200 ${
                  currentSongIndex === index
                    ? 'bg-indigo-600/50'
                    : 'hover:bg-gray-700/70'
                }`}
              >
                <div className="w-12 h-12 bg-gray-700 rounded-md overflow-hidden mr-4 flex-shrink-0">
                  <img
                    src={song.albumArtUrl}
                    alt={song.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-grow truncate">
                  <p className={`font-semibold ${currentSongIndex === index ? 'text-indigo-300' : 'text-white'}`}>
                    {song.title}
                  </p>
                  <p className="text-sm text-gray-400">{song.artist}</p>
                </div>
                {currentSongIndex === index && isPlaying && (
                  <div className="ml-4 text-indigo-300">
                    <svg className="w-5 h-5" viewBox="0 0 100 100" fill="currentColor">
                      <rect className="animate-[grow_1.2s_ease-in-out_infinite]" y="35" width="10" height="65" rx="3"></rect>
                      <rect className="animate-[grow_1.2s_ease-in-out_infinite_0.2s]" x="30" y="15" width="10" height="85" rx="3"></rect>
                      <rect className="animate-[grow_1.2s_ease-in-out_infinite_0.4s]" x="60" y="25" width="10" height="75" rx="3"></rect>
                      <rect className="animate-[grow_1.2s_ease-in-out_infinite_0.6s]" x="90" y="5" width="10" height="95" rx="3"></rect>
                      <style>{`
                        @keyframes grow {
                          0%, 100% { transform: scaleY(0.2); }
                          50% { transform: scaleY(1); }
                        }
                      `}</style>
                    </svg>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 6l12-3" />
            </svg>
            <p className="text-center">Playlist is empty.</p>
            <p className="text-center text-sm">Upload a folder to begin.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Playlist;
