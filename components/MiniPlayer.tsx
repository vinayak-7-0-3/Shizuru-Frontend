import { useMusicPlayer } from '@/contexts/MusicPlayerContext';
import { useState } from 'react';
import Image from 'next/image';

const MiniPlayer = () => {
  const {
    currentTrack,
    queue,
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
    clearQueue,
  } = useMusicPlayer();

  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [showQueueTooltip, setShowQueueTooltip] = useState(false);

  if (!currentTrack) return null;

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = (parseFloat(e.target.value) / 100) * duration;
    seekTo(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value) / 100);
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-lg border-t border-black/10 dark:border-white/10 px-4 py-3 z-50">
      {/* Progress Bar - Top Edge */}
      <div className="absolute top-0 left-0 right-0 h-1 group cursor-pointer z-50">
        <div className="absolute top-0 left-0 bottom-0 bg-black/5 dark:bg-white/5 w-full" />
        <div
          className="absolute top-0 left-0 bottom-0 bg-black dark:bg-white transition-all duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        />
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={handleSeek}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          aria-label="Seek track progress"
        />
      </div>

      <div className="flex items-center gap-4">
        {/* Track Info */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <Image
            src={currentTrack.cover_url || '/cover_art.png'}
            alt={currentTrack.title}
            width={40}
            height={40}
            className="rounded-md object-cover"
            unoptimized
          />
          <div className="min-w-0 flex-1">
            <h4 className="font-medium text-sm truncate text-black dark:text-white">
              {currentTrack.title}
            </h4>
            <p className="text-xs text-black/70 dark:text-white/70 truncate">
              {currentTrack.artist}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={previousTrack}
            className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-black dark:text-white"
            aria-label="Previous track"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
            </svg>
          </button>

          <button
            onClick={togglePlay}
            className="p-2.5 rounded-full bg-black dark:bg-white text-white dark:text-black hover:scale-105 transition-transform"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          <button
            onClick={nextTrack}
            className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-black dark:text-white"
            aria-label="Next track"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
            </svg>
          </button>
        </div>

        {/* Volume Control */}
        <div className="flex items-center gap-2 relative">
          <button
            onClick={() => setShowVolumeSlider(!showVolumeSlider)}
            className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-black dark:text-white"
            aria-label="Toggle volume control"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              {volume === 0 ? (
                <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
              ) : volume < 0.5 ? (
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
              ) : (
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
              )}
            </svg>
          </button>

          {/* Volume Slider Popup */}
          {showVolumeSlider && (
            <div className="absolute bottom-full right-0 mb-2 bg-white dark:bg-neutral-800 p-3 rounded-lg shadow-xl border border-black/10 dark:border-white/10 backdrop-blur-lg">
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume * 100}
                  onChange={handleVolumeChange}
                  className="w-20 h-1 bg-black/20 dark:bg-white/20 rounded-lg appearance-none cursor-pointer volume-slider"
                  aria-label="Volume control"
                />
                <span className="text-xs text-black/70 dark:text-white/70 min-w-[3rem]">
                  {Math.round(volume * 100)}%
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Queue Indicator */}
        {queue.length > 0 && (
          <div className="relative">
            <button
              onClick={clearQueue}
              onMouseEnter={() => setShowQueueTooltip(true)}
              onMouseLeave={() => setShowQueueTooltip(false)}
              className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-black dark:text-white relative"
              aria-label="Clear queue"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M15 6H3v2h12V6zm0 4H3v2h12v-2zM3 16h8v-2H3v2zM17 6v8.18c-.31-.11-.65-.18-1-.18-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3V8h3V6h-5z" />
              </svg>
              <span className="absolute -top-1 -right-1 bg-black dark:bg-white text-white dark:text-black text-xs w-4 h-4 rounded-full flex items-center justify-center font-medium">
                {queue.length}
              </span>
            </button>
            {showQueueTooltip && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black dark:bg-white text-white dark:text-black text-xs rounded whitespace-nowrap">
                {queue.length} in queue (Click to clear)
              </div>
            )}
          </div>
        )}

        {/* Expand Button */}
        <button
          onClick={toggleFullScreen}
          className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-black dark:text-white"
          aria-label="Open full screen player"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
          </svg>
        </button>
      </div>

      <style jsx>{`

        
        .volume-slider::-webkit-slider-thumb {
          appearance: none;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: currentColor;
          cursor: pointer;
        }
        .volume-slider::-moz-range-thumb {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: currentColor;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
};

export default MiniPlayer;