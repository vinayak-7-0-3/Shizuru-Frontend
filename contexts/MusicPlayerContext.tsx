import React, { createContext, useContext, useState, useRef, useEffect, ReactNode } from 'react';
import { BaseTrack } from '../types';

interface MusicPlayerContextType {
  currentTrack: BaseTrack | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isFullScreen: boolean;
  playTrack: (track: BaseTrack) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  togglePlay: () => void;
  seekTo: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleFullScreen: () => void;
  nextTrack: () => void; // TODO
  previousTrack: () => void; // TODO
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
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(1);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.volume = volume;
    }

    const audio = audioRef.current;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleDurationChange = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const playTrack = (track: BaseTrack) => {
    if (!audioRef.current) return;

    if (currentTrack?.track_id !== track.track_id) {
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
    // TODO: Implement next track logic
    console.log('Next track - TODO');
  };

  const previousTrack = () => {
    // TODO: Implement previous track logic
    console.log('Previous track - TODO');
  };

  return (
    <MusicPlayerContext.Provider
      value={{
        currentTrack,
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
      }}
    >
      {children}
    </MusicPlayerContext.Provider>
  );
};