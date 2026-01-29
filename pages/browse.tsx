import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Disc, Mic2, Music, ArrowRight } from 'lucide-react';
import MainLayout from '../components/MainLayout';
import SectionHeader from '../components/SectionHeader';
import AlbumCard from '../components/AlbumCard';
import ArtistCard from '../components/ArtistCard';
import { BaseAlbum, BaseArtist } from '../types';

const BrowsePage = () => {
    const router = useRouter();
    const [trendingAlbums, setTrendingAlbums] = useState<BaseAlbum[]>([]);
    const [popularArtists, setPopularArtists] = useState<BaseArtist[]>([]);
    const [loading, setLoading] = useState(true);

    const browseCategories = [
        {
            title: 'Tracks',
            subtitle: 'Explore all songs',
            icon: Music,
            href: '/browse/tracks',
            color: 'from-pink-500 to-rose-600',
        },
        {
            title: 'Albums',
            subtitle: 'View your albums',
            icon: Disc,
            href: '/browse/albums',
            color: 'from-blue-500 to-cyan-600',
        },
        {
            title: 'Artists',
            subtitle: 'Find your artists',
            icon: Mic2,
            href: '/browse/artists',
            color: 'from-violet-500 to-purple-600',
        }
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch some random data to fill the space
                // We'll fetch slightly more to show a nice grid
                const [albumsRes, artistsRes] = await Promise.all([
                    fetch('/api/albums?page=1&limit=4'),
                    fetch('/api/artists?page=1&limit=8')
                ]);

                if (!albumsRes.ok || !artistsRes.ok) {
                    throw new Error('Failed to fetch browse data');
                }

                const [albumsData, artistsData] = await Promise.all([
                    albumsRes.json(),
                    artistsRes.json()
                ]);

                setTrendingAlbums(albumsData);
                setPopularArtists(artistsData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                // Even if fetch fails, we still want to show the navigation cards
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <MainLayout>
            <div className="min-h-screen bg-white dark:bg-neutral-900 text-black dark:text-white pt-8 px-6 pb-20">
                <div className="max-w-7xl mx-auto space-y-12">

                    {/* Header */}
                    <div>
                        <h1 className="text-4xl font-bold mb-2">Browse</h1>
                        <p className="text-gray-500 dark:text-gray-400">Explore your music collection</p>
                    </div>

                    {/* Navigation Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {browseCategories.map((category) => (
                            <Link
                                key={category.title}
                                href={category.href}
                                className="group relative overflow-hidden rounded-3xl h-40 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
                            >
                                {/* Gradient Background */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-90 transition-opacity`} />

                                {/* Content - Overlay Pattern */}
                                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay" />

                                <div className="relative h-full p-6 flex items-center justify-between">
                                    <div className="flex flex-col h-full justify-between">
                                        <div className="p-3 bg-white/20 backdrop-blur-md w-fit rounded-2xl text-white border border-white/10">
                                            <category.icon size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-white">{category.title}</h3>
                                            <p className="text-white/80 text-sm font-medium">{category.subtitle}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                                        <ArrowRight className="text-white w-6 h-6" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Divider */}
                    <div className="w-full h-px bg-neutral-200 dark:bg-white/10" />

                    {/* Discover Section */}
                    <div className="space-y-12">
                        {loading ? (
                            <div className="w-full h-40 flex items-center justify-center">
                                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
                            </div>
                        ) : (
                            <>
                                {/* Trending Artists */}
                                {popularArtists.length > 0 && (
                                    <section>
                                        <SectionHeader title="Popular Artists" subtitle="Artists you might like" />
                                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                                            {popularArtists.map((artist) => (
                                                <ArtistCard key={artist.artist_id || artist.name} artist={artist} />
                                            ))}
                                        </div>
                                    </section>
                                )}

                                {/* New Albums */}
                                {trendingAlbums.length > 0 && (
                                    <section>
                                        <SectionHeader title="New Arrivals" subtitle="Fresh additions to the library" />
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                            {trendingAlbums.map((album) => (
                                                <AlbumCard key={album.album_id || album.title} album={album} />
                                            ))}
                                        </div>
                                    </section>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default BrowsePage;
