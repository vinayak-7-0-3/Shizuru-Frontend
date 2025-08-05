import { BaseTrack } from '../types';
import { useMusicPlayer } from '../contexts/MusicPlayerContext';

interface TrackCardProps {
  track: BaseTrack;
}

const TrackCard = ({ track }: TrackCardProps) => {
  const { playTrack } = useMusicPlayer();

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handlePlay = () => {
    playTrack(track);
  };

  return (
    <div className="group cursor-pointer">
      <div className="bg-gray-50 dark:bg-white/10 rounded-2xl p-4 border border-black/20 dark:border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
        {/* Album Art */}
        <div className="relative mb-4 overflow-hidden rounded-xl">
          <img
            src={track.cover_url || '/default-cover.jpg'}
            alt={track.title}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
          />
         
          {/* Play Button Overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <button 
              onClick={handlePlay}
              className="bg-white/20 backdrop-blur-sm border border-white/30 text-white p-3 rounded-full hover:bg-white/30 transition-all duration-300"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </button>
          </div>
        </div>
        
        {/* Track Info */}
        <div className="text-black/80 dark:text-white">
          <h3 className="font-semibold text-lg mb-1 truncate">
            {track.title}
          </h3>
          <p className="text-black/80 dark:text-white/70 text-sm mb-2 truncate">
            {track.artist}
          </p>
          <div className="flex justify-between items-center">
            {track.album && (
              <p className="text-black/80 dark:text-white/50 text-xs truncate mb-2">
                {track.album}
              </p>
            )}
            {track.duration && (
              <span className="text-black/80 dark:text-white/60 text-xs">
                {formatDuration(Math.trunc(track.duration / 1000))}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackCard;