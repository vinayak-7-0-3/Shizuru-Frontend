import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Mic2 } from 'lucide-react';
import MainLayout from '../../components/MainLayout';
import SectionHeader from '../../components/SectionHeader';
import TrackCard from '../../components/TrackCard';
import AlbumCard from '../../components/AlbumCard';
import { ArtistDetailed, BaseTrack, BaseAlbum } from '@/types';

const ArtistDetailPage = () => {
    const router = useRouter();
    const { id } = router.query;
    const [artist, setArtist] = useState<ArtistDetailed | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        const fetchArtist = async () => {
            try {
                const res = await fetch(`/api/artists/${id}`);
                if (!res.ok) throw new Error('Failed to fetch artist');
                const data = await res.json();
                setArtist(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching artist:', error);
                setLoading(false);
            }
        };

        fetchArtist();
    }, [id]);

    if (loading) {
        return (
            <MainLayout>
                <div className="min-h-screen flex items-center justify-center bg-white dark:bg-neutral-900 text-black dark:text-white">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                </div>
            </MainLayout>
        );
    }

    if (!artist) {
        return (
            <MainLayout>
                <div className="min-h-screen flex items-center justify-center bg-white dark:bg-neutral-900 text-black dark:text-white">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold mb-2">Artist Not Found</h2>
                        <button
                            onClick={() => router.back()}
                            className="text-purple-500 hover:text-purple-400"
                        >
                            Go Back
                        </button>
                    </div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout immersive>
            <div className="min-h-screen bg-white dark:bg-neutral-900 text-black dark:text-white pb-24">
                {/* Hero Section */}
                <div className="relative min-h-[28rem] h-auto w-full overflow-hidden flex flex-col">
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${artist.cover_url || '/default-artist.jpg'})` }}
                    >
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-neutral-900 to-transparent" />

                    <div className="relative flex-1 max-w-7xl mx-auto px-6 flex items-start md:items-end pt-28 md:pt-0 pb-12">
                        <div className="flex flex-col md:flex-row items-center md:items-end gap-8">
                            <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white dark:border-neutral-800 shadow-2xl">
                                <Image
                                    src={artist.cover_url || '/default-artist.jpg'}
                                    alt={artist.name}
                                    width={160}
                                    height={160}
                                    className="w-full h-full object-cover"
                                    unoptimized
                                />
                            </div>
                            <div className="text-center md:text-left">
                                <div className="flex items-center justify-center md:justify-start gap-2 text-white/90 mb-2">
                                    <div className="bg-purple-500 p-1 rounded-full">
                                        <Mic2 size={12} className="text-white" />
                                    </div>
                                    <span className="text-sm font-bold uppercase tracking-wider mix-blend-difference">Verified Artist</span>
                                </div>
                                <h1 className="text-5xl md:text-7xl font-bold mb-4 drop-shadow-xl">{artist.name}</h1>
                                {artist.bio && (
                                    <p className="max-w-2xl text-lg text-black/80 dark:text-white/80 line-clamp-2">
                                        {artist.bio}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 mt-8 space-y-12">
                    {/* Top Tracks */}
                    {artist.tracks && artist.tracks.length > 0 && (
                        <section>
                            <SectionHeader title="Popular" />
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {artist.tracks.slice(0, 6).map((track: BaseTrack, index: number) => (
                                    <TrackCard key={track.track_id || index} track={track} />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Albums */}
                    {artist.albums && artist.albums.length > 0 && (
                        <section>
                            <SectionHeader title="Albums" />
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                                {artist.albums.map((album: BaseAlbum, index: number) => (
                                    <AlbumCard key={album.album_id || index} album={album} />
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </MainLayout>
    );
};

export default ArtistDetailPage;
