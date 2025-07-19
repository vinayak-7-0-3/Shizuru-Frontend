import { BaseAlbum } from '../types';

interface AlbumCardProps {
  album: BaseAlbum;
}

const AlbumCard = ({ album }: AlbumCardProps) => {
  return (
    <div className="group cursor-pointer">
      <div className="bg-black/10 dark:bg-white/10 rounded-2xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
        {/* Album Art */}
        <div className="relative mb-4 overflow-hidden rounded-xl">
          <img
            src={album.cover_url || '/default-album.jpg'}
            alt={album.title}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
          />
          
          {/* Play Button Overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <button className="bg-white/20 backdrop-blur-sm border border-white/30 text-white p-3 rounded-full hover:bg-white/30 transition-all duration-300">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Album Info */}
        <div className="text-black/70 dark:text-white">
          <h3 className="font-semibold text-lg mb-1 truncate">
            {album.title}
          </h3>
          <p className="text-black/70 dark:text-white/70 text-sm mb-2 truncate">
            {album.artist}
          </p>
          
          <div className="flex justify-between items-center">
            <span className="text-black/70 dark:text-white/50 text-xs">
              {album.track_count} tracks
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlbumCard;