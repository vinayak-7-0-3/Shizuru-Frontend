import { useState, useEffect } from 'react';
import MainLayout from '../../components/MainLayout';
import SectionHeader from '../../components/SectionHeader';
import ArtistCard from '../../components/ArtistCard';
import { BaseArtist } from '../../types';

const BrowseArtistsPage = () => {
    const [artists, setArtists] = useState<BaseArtist[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const LIMIT = 24;

    const fetchArtists = async (pageNum: number) => {
        try {
            const res = await fetch(`/api/artists?page=${pageNum}&limit=${LIMIT}`);
            if (!res.ok) throw new Error('Failed to fetch artists');
            const data: BaseArtist[] = await res.json();

            if (data.length < LIMIT) {
                setHasMore(false);
            }

            setArtists(prev => [...prev, ...data]);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching artists:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArtists(1);
    }, []);

    const loadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchArtists(nextPage);
    };

    return (
        <MainLayout>
            <div className="min-h-screen pt-8 px-6 pb-24 bg-white dark:bg-neutral-900 text-black dark:text-white">
                <div className="max-w-7xl mx-auto">
                    <SectionHeader title="All Artists" subtitle="Browse all artists" />

                    {loading && artists.length === 0 ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6">
                                {artists.map((artist, index) => (
                                    <ArtistCard key={`${artist.artist_id}-${index}`} artist={artist} />
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

export default BrowseArtistsPage;
