import { BaseArtist } from '@/types';
import Link from 'next/link';
import Image from 'next/image';

interface ArtistCardProps {
  artist: BaseArtist;
}

const ArtistCard = ({ artist }: ArtistCardProps) => {
  return (
    <Link href={`/artist/${artist.artist_id}`}>
      <div className="group cursor-pointer">
        <div className="bg-black/10 dark:bg-white/10 rounded-2xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
          {/* Artist Image */}
          <div className="relative mb-3 overflow-hidden rounded-full aspect-square w-full">
            <Image
              src={artist.cover_url || '/default-artist.jpg'}
              alt={artist.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
              unoptimized
            />

            {/* Play Button Overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <button className="bg-white/20 backdrop-blur-sm border border-white/30 text-white p-2 rounded-full hover:bg-white/30 transition-all duration-300">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Artist Info */}
          <div className="text-black/70 dark:text-white text-center">
            <h3 className="font-semibold text-sm mb-1 truncate">
              {artist.name}
            </h3>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ArtistCard;