import { useMusicPlayer } from '../contexts/MusicPlayerContext';
import { useEffect, useState, useCallback } from 'react';
import { SkipBack, SkipForward, Play, Pause, Volume2, VolumeX } from "lucide-react";

const FullPlayer = () => {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    togglePlay,
    seekTo,
    setVolume,
    toggleFullScreen,
    nextTrack,
    previousTrack,
  } = useMusicPlayer();

  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [mouseTimer, setMouseTimer] = useState<NodeJS.Timeout | null>(null);

  // Handle mouse movement for auto-hide controls
  const handleMouseMove = useCallback(() => {
    setShowControls(true);

    if (mouseTimer) {
      clearTimeout(mouseTimer);
    }

    const timer = setTimeout(() => {
      setShowControls(false);
    }, 3000); // Hide after 3 seconds of no movement

    setMouseTimer(timer);
  }, [mouseTimer]);

  // Handle mouse leave to hide controls immediately
  const handleMouseLeave = useCallback(() => {
    if (mouseTimer) {
      clearTimeout(mouseTimer);
    }
    setShowControls(false);
  }, [mouseTimer]);

  // Prevent body scroll when full screen player is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.body.style.cursor = showControls ? 'default' : 'none';

    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.cursor = 'default';
    };
  }, [showControls]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (mouseTimer) {
        clearTimeout(mouseTimer);
      }
    };
  }, [mouseTimer]);

  if (!currentTrack) return null;

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = (parseFloat(e.target.value) / 100) * duration;
    seekTo(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value) / 100);
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Enhanced Blurred Background */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-110"
          style={{
            backgroundImage: `url(${currentTrack.cover_url || '/default-cover.jpg'})`,
            filter: 'blur(60px) brightness(0.4)',
          }}
        />
        <div className="absolute inset-0 backdrop-blur-xl bg-black/60" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
      </div>

      {/* Header - Fade with controls */}
      <div className={`relative z-10 flex items-center justify-between p-4 md:p-6 safe-area-top transition-opacity duration-500 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        <button
          onClick={toggleFullScreen}
          className="p-2 rounded-full hover:bg-white/15 transition-all duration-200 backdrop-blur-sm"
          aria-label="Close full screen player"
        >
          <svg className="w-5 h-5 md:w-6 md:h-6" fill="white" viewBox="0 0 24 24">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        </button>
        <h1 className="text-base md:text-lg font-medium drop-shadow-lg text-white/90">Now Playing</h1>
        <div className="w-9 md:w-10"></div>
      </div>

      {/* Main Content Container - Proper flex layout */}
      <div className="relative z-10 flex-1 flex flex-col min-h-0 text-white">
        {/* Content Area - Scrollable if needed */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 md:px-12 py-4">
          {/* Album Art - Better proportions */}
          <div className="mb-6 md:mb-8">
            <div className="relative group">
              <div className="w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-96 lg:h-96 max-w-[70vw] max-h-[35vh] aspect-square rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm">
                <img
                  src={currentTrack.cover_url || '/default-cover.jpg'}
                  alt={currentTrack.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="eager"
                />
              </div>
              {/* Subtle reflection effect */}
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-3/4 h-8 bg-gradient-to-b from-white/5 to-transparent rounded-full blur-xl"></div>
            </div>
          </div>

          {/* Track Info - Better typography */}
          <div className="text-center mb-6 md:mb-8 max-w-2xl">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-3 drop-shadow-lg leading-tight tracking-tight">
              {currentTrack.title}
            </h2>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/80 mb-1 md:mb-2 drop-shadow-md font-medium">
              {currentTrack.artist}
            </p>
            {currentTrack.album && (
              <p className="text-sm sm:text-base md:text-lg text-white/60 drop-shadow-sm">
                {currentTrack.album}
              </p>
            )}
          </div>
        </div>

        {/* Bottom Controls - Fixed at bottom with proper spacing */}
        <div className={`flex-shrink-0 transition-all duration-500 pb-12 md:pb-24 ${showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {/* Progress Bar - Slimmer and elegant */}
          <div className="px-6 md:px-12 lg:px-16 mb-4 md:mb-6">
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={handleSeek}
              className="w-full h-1 bg-white/15 rounded-full appearance-none cursor-pointer progress-slider backdrop-blur-sm"
              aria-label="Seek track progress"
            />
            <div className="flex justify-between text-xs md:text-sm text-white/60 mt-2 drop-shadow-sm">
              <span className="font-mono tabular-nums">{formatTime(currentTime)}</span>
              <span className="font-mono tabular-nums">{formatTime(duration)}</span>
            </div>
          </div>

          {/* Main Controls - More refined */}
          <div className="flex items-center justify-center relative w-full mb-4 md:mb-6">
            {/* Playback Controls */}
            <div className="flex items-center gap-6 md:gap-8 lg:gap-12">
              <button
                onClick={previousTrack}
                className="p-2 md:p-3 rounded-full hover:bg-white/10 transition-all duration-200 backdrop-blur-sm hover:scale-110 group"
                aria-label="Previous track"
              >
                <SkipBack className="w-4 h-4 fill-white text-white drop-shadow" />
              </button>

              <button
                onClick={togglePlay}
                className="p-4 md:p-5 rounded-full text-black hover:scale-110 transition-all duration-300 shadow-2xl backdrop-blur-sm ring-2 ring-white/10 group"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 text-white" />
                ) : (
                  <Play className="w-5 h-5 text-white" />
                )}
              </button>

              <button
                onClick={nextTrack}
                className="p-2 md:p-3 rounded-full hover:bg-white/10 transition-all duration-200 backdrop-blur-sm hover:scale-110 group"
                aria-label="Next track"
              >
                <SkipForward className="w-4 h-4 fill-white text-white drop-shadow" />
              </button>
            </div>
            {/* Volume Control - absolutely positioned right side */}
            <div className="absolute right-6 md:right-12 flex items-center">
              <div className="relative">
                <button
                  onClick={() => setShowVolumeSlider(!showVolumeSlider)}
                  className="p-2 rounded-full hover:bg-white/10 transition-all duration-200 backdrop-blur-sm hover:scale-110"
                  aria-label="Toggle volume control"
                >
                  {volume === 0 ? (
                    <VolumeX className="w-4 h-4 text-white/70" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-white/70" />
                  )}
                </button>

                {/* Slider opens upward */}
                <div className={`absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center transition-all duration-300 ${showVolumeSlider ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume * 100}
                    onChange={handleVolumeChange}
                    className="volume-slider w-24 md:w-28 rotate-[-90deg] origin-bottom"
                    aria-label="Volume control"
                  />
                  <span className="text-white/60 text-xs md:text-sm mt-2 font-mono tabular-nums">
                    {Math.round(volume * 100)}
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <style jsx>{`
        .progress-slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          border: none;
          transition: all 0.2s ease;
        }
        .progress-slider::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 4px 12px rgba(0,0,0,0.4);
        }
        .progress-slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        }
        
        .volume-slider {
          appearance: none;
          height: 6px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 9999px;
          outline: none;
          cursor: pointer;
          transition: background 0.3s ease;
        }

        .volume-slider:hover {
          background: rgba(255, 255, 255, 0.6);
        }

        .volume-slider::-webkit-slider-thumb {
          appearance: none;
          height: 14px;
          width: 14px;
          background: white;
          border-radius: 9999px;
          box-shadow: 0 0 4px rgba(0,0,0,0.3);
          transition: transform 0.2s ease;
        }

        .volume-slider::-webkit-slider-thumb:hover {
          transform: scale(1.2);
        }

        .volume-slider::-moz-range-thumb {
          height: 14px;
          width: 14px;
          background: white;
          border: none;
          border-radius: 9999px;
        }

        /* Custom progress bar styling */
        .progress-slider::-webkit-slider-track {
          background: rgba(255,255,255,0.15);
          border-radius: 9999px;
          height: 4px;
        }
        /* Safe area support */
        .safe-area-top {
          padding-top: max(1rem, env(safe-area-inset-top));
        }
        .safe-area-bottom {
          padding-bottom: max(1rem, env(safe-area-inset-bottom));
        }

        /* Responsive adjustments */
        @media (max-height: 700px) {
          .mb-6 { margin-bottom: 1rem; }
          .mb-8 { margin-bottom: 1.5rem; }
          .pb-4 { padding-bottom: 0.75rem; }
          .pb-6 { padding-bottom: 1rem; }
        }

        @media (max-height: 600px) {
          .mb-4 { margin-bottom: 0.75rem; }
          .mb-6 { margin-bottom: 1rem; }
          .pb-4 { padding-bottom: 0.5rem; }
        }
      `}</style>
    </div>
  );
};

export default FullPlayer;