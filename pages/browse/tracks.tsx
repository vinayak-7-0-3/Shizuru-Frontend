import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import MainLayout from '../../components/MainLayout';
import SectionHeader from '../../components/SectionHeader';
import TrackCard from '../../components/TrackCard';
import { BaseTrack } from '../../types';

const BrowseTracksPage = () => {
    const router = useRouter();
    const [tracks, setTracks] = useState<BaseTrack[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const LIMIT = 20;

    const fetchTracks = async (pageNum: number) => {
        try {
            const res = await fetch(`/api/songs?page=${pageNum}&limit=${LIMIT}`);
            if (!res.ok) throw new Error('Failed to fetch tracks');
            const data: BaseTrack[] = await res.json();

            if (data.length < LIMIT) {
                setHasMore(false);
            }

            setTracks(prev => [...prev, ...data]);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching tracks:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTracks(1);
    }, []);

    const loadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchTracks(nextPage);
    };

    return (
        <MainLayout>
            <div className="min-h-screen pt-8 px-6 pb-24 bg-white dark:bg-neutral-900 text-black dark:text-white">
                <div className="max-w-7xl mx-auto">
                    <SectionHeader title="All Tracks" subtitle="Browse all songs in the library" />

                    {loading && tracks.length === 0 ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {tracks.map((track, index) => (
                                    <TrackCard key={`${track.track_id}-${index}`} track={track} />
                                ))}
                            </div>

                            {hasMore && (
                                <div className="mt-8 flex justify-center">
                                    <button
                                        onClick={loadMore}
                                        className="px-6 py-2 bg-neutral-100 dark:bg-white/10 hover:bg-neutral-200 dark:hover:bg-white/20 rounded-full transition-colors"
                                    >
                                        Load More
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </MainLayout>
    );
};

export default BrowseTracksPage;
