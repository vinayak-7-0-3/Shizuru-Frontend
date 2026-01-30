import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { BaseTrack, BaseArtist, BaseAlbum } from '@/types';
import TrackCard from './TrackCard';
import ArtistCard from './ArtistCard';
import AlbumCard from './AlbumCard';

import ChangingHeroSection from './ChangingHeroSection';
import SectionHeader from './SectionHeader';

const HomePage = () => {
  const router = useRouter();
  const [featuredTracks, setFeaturedTracks] = useState<BaseTrack[]>([]);
  const [topArtists, setTopArtists] = useState<BaseArtist[]>([]);
  const [recentAlbums, setRecentAlbums] = useState<BaseAlbum[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tracksRes, artistsRes, albumsRes] = await Promise.all([
          fetch('/api/songs?page=1&limit=6'),
          fetch('/api/artists?page=1&limit=8'),
          fetch('/api/albums?page=1&limit=6')
        ]);

        if (!tracksRes.ok || !artistsRes.ok || !albumsRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const [tracksData, artistsData, albumsData]: [
          BaseTrack[],
          BaseArtist[],
          BaseAlbum[]
        ] = await Promise.all([
          tracksRes.json(),
          artistsRes.json(),
          albumsRes.json()
        ]);

        setFeaturedTracks(tracksData);
        setTopArtists(artistsData);
        setRecentAlbums(albumsData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        router.push('/500');
        // Don't set loading to false; keep spinner until redirect happens
      }
    };

    fetchData();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-neutral-900 to-black text-black dark:text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      {/* Hero Section */}
      <ChangingHeroSection tracks={featuredTracks} />


      {/* Main Content */}
      <div className="px-6 pb-20 bg-white dark:bg-black max-w-7xl mx-auto">
        {/* Featured Tracks */}
        <section className="mb-12">
          <SectionHeader title="Featured Tracks" />
          <div className="flex flex-col space-y-2">
            {featuredTracks.slice(1, 7).map((track, index) => (
              <TrackCard key={track.track_id || index} track={track} layout="list" />
            ))}
          </div>
        </section>

        {/* Top Artists */}
        <section className="mb-12">
          <SectionHeader title="Top Artists" />
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {topArtists.map((artist, index) => (
              <ArtistCard key={artist.artist_id || index} artist={artist} />
            ))}
          </div>
        </section>

        {/* Recent Albums */}
        <section className="mb-12">
          <SectionHeader title="Recent Albums" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentAlbums.map((album, index) => (
              <AlbumCard key={album.album_id || index} album={album} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;