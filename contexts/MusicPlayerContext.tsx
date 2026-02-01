import React, { createContext, useContext, useState, useRef, useEffect, ReactNode, useCallback } from 'react';
import { BaseTrack } from '../types';

interface MusicPlayerContextType {
  currentTrack: BaseTrack | null;
  queue: BaseTrack[];
  history: BaseTrack[];
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isFullScreen: boolean;
  playTrack: (track: BaseTrack, albumTracks?: BaseTrack[]) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  togglePlay: () => void;
  seekTo: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleFullScreen: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  addToQueue: (track: BaseTrack) => void;
  clearQueue: () => void;
  removeFromQueue: (index: number) => void;
}

const MusicPlayerContext = createContext<MusicPlayerContextType | undefined>(undefined);

export const useMusicPlayer = () => {
  const context = useContext(MusicPlayerContext);
  if (!context) {
    throw new Error('useMusicPlayer must be used within a MusicPlayerProvider');
  }
  return context;
};

interface MusicPlayerProviderProps {
  children: ReactNode;
}

export const MusicPlayerProvider = ({ children }: MusicPlayerProviderProps) => {
  const [currentTrack, setCurrentTrack] = useState<BaseTrack | null>(null);
  const [queue, setQueue] = useState<BaseTrack[]>([]);
  const [history, setHistory] = useState<BaseTrack[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(1);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Play the next track in queue
  const playNextInQueue = useCallback(() => {
    if (queue.length > 0) {
      const [nextTrack, ...remainingQueue] = queue;
      if (currentTrack) {
        setHistory(prev => [...prev, currentTrack]);
      }
      setCurrentTrack(nextTrack);
      setQueue(remainingQueue);
      if (audioRef.current) {
        audioRef.current.src = `/api/stream/${nextTrack.file_unique_id}`;
        audioRef.current.play();
        setIsPlaying(true);
      }
    } else {
      setIsPlaying(false);
    }
  }, [queue, currentTrack]);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.volume = volume;
    }

    const audio = audioRef.current;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleDurationChange = () => setDuration(audio.duration);
    const handleEnded = () => {
      // Auto-play next track in queue when current track ends
      playNextInQueue();
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [playNextInQueue]);

  const playTrack = (track: BaseTrack, albumTracks?: BaseTrack[]) => {
    if (!audioRef.current) return;

    // Add current track to history if it exists
    if (currentTrack) {
      setHistory(prev => [...prev, currentTrack]);
    }

    // If albumTracks is provided, set up the queue with remaining tracks
    if (albumTracks && albumTracks.length > 0) {
      const trackIndex = albumTracks.findIndex(
        t => (t.track_id && t.track_id === track.track_id) ||
          (t.file_unique_id && t.file_unique_id === track.file_unique_id)
      );
      if (trackIndex !== -1 && trackIndex < albumTracks.length - 1) {
        // Set remaining tracks after the current one as the queue
        setQueue(albumTracks.slice(trackIndex + 1));
      } else {
        // Track not found in album or is the last track, clear queue
        setQueue([]);
      }
    }

    const isSameTrack = currentTrack?.track_id === track.track_id ||
      currentTrack?.file_unique_id === track.file_unique_id;

    if (!isSameTrack) {
      setCurrentTrack(track);
      audioRef.current.src = `/api/stream/${track.file_unique_id}`;
    }

    audioRef.current.play();
    setIsPlaying(true);
  };

  const pauseTrack = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const resumeTrack = () => {
    if (audioRef.current && currentTrack) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      pauseTrack();
    } else {
      resumeTrack();
    }
  };

  const seekTo = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const setVolume = (newVolume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      setVolumeState(newVolume);
    }
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const nextTrack = () => {
    if (queue.length > 0) {
      playNextInQueue();
    }
  };

  const previousTrack = () => {
    // If current time > 3 seconds, restart the current track
    if (currentTime > 3) {
      seekTo(0);
      return;
    }

    // Otherwise, go back to the previous track in history
    if (history.length > 0) {
      const prevTrack = history[history.length - 1];
      const newHistory = history.slice(0, -1);

      // Add current track to the front of the queue
      if (currentTrack) {
        setQueue(prev => [currentTrack, ...prev]);
      }

      setHistory(newHistory);
      setCurrentTrack(prevTrack);

      if (audioRef.current) {
        audioRef.current.src = `/api/stream/${prevTrack.file_unique_id}`;
        audioRef.current.play();
        setIsPlaying(true);
      }
    } else {
      // No history, just restart current track
      seekTo(0);
    }
  };

  const addToQueue = (track: BaseTrack) => {
    setQueue(prev => [...prev, track]);
  };

  const clearQueue = () => {
    setQueue([]);
  };

  const removeFromQueue = (index: number) => {
    setQueue(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <MusicPlayerContext.Provider
      value={{
        currentTrack,
        queue,
        history,
        isPlaying,
        currentTime,
        duration,
        volume,
        isFullScreen,
        playTrack,
        pauseTrack,
        resumeTrack,
        togglePlay,
        seekTo,
        setVolume,
        toggleFullScreen,
        nextTrack,
        previousTrack,
        addToQueue,
        clearQueue,
        removeFromQueue,
      }}
    >
      {children}
    </MusicPlayerContext.Provider>
  );
};