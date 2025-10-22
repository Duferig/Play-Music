import React, { useState, useEffect, useCallback } from 'react';
import type { Song } from './types';
import Player from './components/Player';
import Playlist from './components/Playlist';
import FolderUploader from './components/DriveInput';
import { useAudioPlayer } from './hooks/useAudioPlayer';

const API_URL = 'http://localhost:3000'; // The address of our backend server

const App: React.FC = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSongs = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch(`${API_URL}/api/songs`);
      if (!response.ok) {
        throw new Error('Failed to fetch playlist from server.');
      }
      const data = await response.json();
      // Prepend the server URL to the audioUrl if it's a relative path
      const songsWithFullUrl = data.map((song: Song) => ({
        ...song,
        audioUrl: song.audioUrl.startsWith('http') ? song.audioUrl : `${API_URL}${song.audioUrl}`
      }));
      setSongs(songsWithFullUrl);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    }
  }, []);

  // Fetch initial playlist on component mount
  useEffect(() => {
    fetchSongs();
  }, [fetchSongs]);


  const {
    currentSong,
    currentSongIndex,
    isPlaying,
    progress,
    duration,
    currentTime,
    togglePlayPause,
    playSong,
    nextSong,
    prevSong,
    seek
  } = useAudioPlayer(songs, null);

  const handleUploadFolder = async (files: FileList) => {
    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    Array.from(files).forEach(file => {
      // The second argument to append is the filename
      formData.append('songs', file, file.name);
    });

    try {
      const response = await fetch(`${API_URL}/api/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      // Refresh the playlist after successful upload
      await fetchSongs();

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred during upload.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSong = (index: number) => {
    playSong(index);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col lg:flex-row p-4 lg:p-8 gap-8">
      <main className="flex-grow lg:w-2/3 lg:max-w-3xl flex items-center justify-center">
        <Player
          currentSong={currentSong}
          isPlaying={isPlaying}
          progress={progress}
          duration={duration}
          currentTime={currentTime}
          onTogglePlayPause={togglePlayPause}
          onNext={nextSong}
          onPrev={prevSong}
          onSeek={seek}
        />
      </main>
      <aside className="flex flex-col lg:w-1/3 lg:max-w-md gap-8 h-[90vh] lg:h-auto">
        <FolderUploader onUploadFolder={handleUploadFolder} isLoading={isLoading} />
        {error && (
            <div className="bg-red-800/50 text-red-200 p-3 rounded-lg -mt-4">
                <p className="font-bold">An Error Occurred:</p>
                <p className="text-sm">{error}</p>
            </div>
        )}
        <Playlist
          songs={songs}
          currentSongIndex={currentSongIndex}
          onSelectSong={handleSelectSong}
          isPlaying={isPlaying}
        />
      </aside>
    </div>
  );
};

export default App;
