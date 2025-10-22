import { useState, useRef, useEffect, useCallback } from 'react';
import { Song } from '../types';

export const useAudioPlayer = (songs: Song[], initialIndex: number | null) => {
  const [currentSongIndex, setCurrentSongIndex] = useState<number | null>(initialIndex);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (currentSongIndex !== null && songs[currentSongIndex]) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      audioRef.current = new Audio(songs[currentSongIndex].audioUrl);

      const audio = audioRef.current;
      
      const setAudioData = () => {
        setDuration(audio.duration);
        setCurrentTime(audio.currentTime);
      };

      const setAudioTime = () => setCurrentTime(audio.currentTime);

      const handleEnded = () => {
        // Go to next song, don't set isPlaying to false to enable autoplay
        setCurrentSongIndex(prevIndex => {
            if (prevIndex === null) return 0;
            return (prevIndex + 1) % songs.length;
        });
      };

      audio.addEventListener('loadeddata', setAudioData);
      audio.addEventListener('timeupdate', setAudioTime);
      audio.addEventListener('ended', handleEnded);

      if (isPlaying) {
        audio.play().catch(e => {
            if (e.name !== 'AbortError') {
                console.error("Error playing audio:", e);
            }
        });
      }

      return () => {
        audio.removeEventListener('loadeddata', setAudioData);
        audio.removeEventListener('timeupdate', setAudioTime);
        audio.removeEventListener('ended', handleEnded);
        audio.pause();
      };
    }
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSongIndex, songs]);

  useEffect(() => {
    if (audioRef.current) {
        if(isPlaying) {
            audioRef.current.play().catch(e => {
                if (e.name !== 'AbortError') {
                    console.error("Error playing audio:", e);
                }
            });
        } else {
            audioRef.current.pause();
        }
    }
  }, [isPlaying]);


  const togglePlayPause = useCallback(() => {
    if (currentSongIndex === null && songs.length > 0) {
        setCurrentSongIndex(0);
    }
    setIsPlaying(prev => !prev);
  }, [currentSongIndex, songs.length]);
  
  const playSong = useCallback((index: number) => {
    setCurrentSongIndex(index);
    setIsPlaying(true);
  }, []);

  const nextSong = useCallback(() => {
    if (songs.length === 0) return;
    setCurrentSongIndex(prevIndex => 
        prevIndex === null ? 0 : (prevIndex + 1) % songs.length
    );
    setIsPlaying(true);
  }, [songs.length]);

  const prevSong = useCallback(() => {
    if (songs.length === 0) return;
    setCurrentSongIndex(prevIndex => 
        prevIndex === null ? 0 : (prevIndex - 1 + songs.length) % songs.length
    );
    setIsPlaying(true);
  }, [songs.length]);
  
  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };
  
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return {
    currentSong: currentSongIndex !== null ? songs[currentSongIndex] : null,
    currentSongIndex,
    isPlaying,
    duration,
    currentTime,
    progress,
    togglePlayPause,
    playSong,
    nextSong,
    prevSong,
    seek
  };
};
