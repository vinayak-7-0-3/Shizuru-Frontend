import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Clock, Calendar, Disc } from 'lucide-react';
import MainLayout from '../../components/MainLayout';
import TrackCard from '../../components/TrackCard';
import SectionHeader from '../../components/SectionHeader';
import { AlbumDetailed } from '../../types';

const AlbumDetailPage = () => {
    const router = useRouter();
    const { id } = router.query;
    const [album, setAlbum] = useState<AlbumDetailed | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        const fetchAlbum = async () => {
            try {
                const res = await fetch(`/api/albums/${id}`);
                if (!res.ok) throw new Error('Failed to fetch album');
                const data = await res.json();
                setAlbum(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching album:', error);
                setLoading(false);
            }
        };

        fetchAlbum();
    }, [id]);

    if (loading) {
        return (
            <MainLayout>
                <div className="min-h-screen flex items-center justify-center bg-white dark:bg-neutral-900 text-black dark:text-white">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            </MainLayout>
        );
    }

    if (!album) {
        return (
            <MainLayout>
                <div className="min-h-screen flex items-center justify-center bg-white dark:bg-neutral-900 text-black dark:text-white">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold mb-2">Album Not Found</h2>
                        <button
                            onClick={() => router.back()}
                            className="text-blue-500 hover:text-blue-400"
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
                <div className="relative h-96 w-full overflow-hidden">
                    <div
                        className="absolute inset-0 bg-cover bg-center blur-2xl opacity-50 dark:opacity-30"
                        style={{ backgroundImage: `url(${album.cover_url || '/default-album.jpg'})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-neutral-900 to-transparent" />

                    <div className="relative h-full max-w-7xl mx-auto px-6 flex items-end pb-8">
                        <div className="flex flex-col md:flex-row items-end md:items-end gap-8 w-full">
                            <img
                                src={album.cover_url || '/default-album.jpg'}
                                alt={album.title}
                                className="w-52 h-52 rounded-2xl shadow-2xl object-cover"
                            />
                            <div className="flex-1 space-y-4">
                                <p className="text-sm font-bold uppercase tracking-wider text-black/60 dark:text-white/60">Album</p>
                                <h1 className="text-4xl md:text-6xl font-bold">{album.title}</h1>
                                <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-black/80 dark:text-white/80">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center overflow-hidden">
                                            {/* Could add artist image here if we had it separately, for now just initial/icon */}
                                            <Disc size={16} />
                                        </div>
                                        <span className="hover:underline cursor-pointer">{album.artist}</span>
                                    </div>
                                    <span>•</span>
                                    <div className="flex items-center gap-1">
                                        <Calendar size={16} />
                                        <span>{new Date(album.created_at).getFullYear()}</span>
                                    </div>
                                    <span>•</span>
                                    <div className="flex items-center gap-1">
                                        <Clock size={16} />
                                        <span>{album.track_count} songs</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="max-w-7xl mx-auto px-6 mt-8">
                    <div className="space-y-4">
                        <div className="flex items-center text-sm text-gray-500 border-b border-gray-200 dark:border-gray-800 pb-2 px-4">
                            <div className="w-12">#</div>
                            <div className="flex-1">Title</div>
                            <div className="hidden md:block w-1/4">Artist</div>
                            <div className="w-16 text-right">
                                <Clock size={16} className="ml-auto" />
                            </div>
                        </div>

                        {album.tracks && album.tracks.length > 0 ? (
                            <div className="space-y-2">
                                {album.tracks.map((track, index) => (
                                    <TrackCard key={track.track_id || index} track={track} layout="list" />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 text-gray-500">
                                <p>No tracks available for this album.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default AlbumDetailPage;
