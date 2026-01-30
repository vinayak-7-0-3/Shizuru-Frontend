import { BaseTrack } from '../types';
import { useMusicPlayer } from '../contexts/MusicPlayerContext';
import { Download } from 'lucide-react';

interface TrackCardProps {
  track: BaseTrack;
  layout?: 'card' | 'list';
}

const TrackCard = ({ track, layout = 'card' }: TrackCardProps) => {
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
    <div className="group cursor-pointer w-full">
      {/* List Layout */}
      {layout === 'list' ? (
        <div
          onClick={handlePlay}
          className="flex items-center gap-4 p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors group"
        >
          {/* List Thumb */}
          <div className="relative w-12 h-12 flex-shrink-0">
            <img
              src={track.cover_url || '/default-cover.jpg'}
              alt={track.title}
              className="w-full h-full rounded object-cover"
            />
            {/* Overlay Play Icon (List) */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>

          {/* List Content */}
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <h3 className="font-medium text-black dark:text-white truncate">
              {track.title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
              {track.artist}
            </p>
          </div>

          <div className="hidden md:block w-1/4 text-sm text-gray-500 dark:text-gray-400 truncate">
            {track.album || ''}
          </div>

          <a
            href={`/api/stream/${track.file_unique_id}?download=true&filename=${encodeURIComponent(track.file_name || (track.title || 'track') + '.mp3')}`}
            onClick={(e) => e.stopPropagation()}
            className="p-2 text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors"
            title="Download"
            download
          >
            <Download size={16} />
          </a>

          <div className="text-sm text-gray-500 dark:text-gray-400 w-12 text-right">
            {track.duration && formatDuration(Math.trunc(track.duration / 1000))}
          </div>
        </div>
      ) : (
        /* Card Layout */
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
                  <path d="M8 5v14l11-7z" />
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
                <div className="flex items-center gap-3">
                  <a
                    href={`/api/stream/${track.file_unique_id}?download=true&filename=${encodeURIComponent(track.file_name || (track.title || 'track') + '.mp3')}`}
                    onClick={(e) => e.stopPropagation()}
                    className="text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white transition-colors"
                    title="Download"
                    download
                  >
                    <Download size={14} />
                  </a>
                  <span className="text-black/80 dark:text-white/60 text-xs">
                    {formatDuration(Math.trunc(track.duration / 1000))}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackCard;