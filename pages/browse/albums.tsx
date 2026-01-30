import { useState, useEffect } from 'react';
import MainLayout from '../../components/MainLayout';
import SectionHeader from '../../components/SectionHeader';
import AlbumCard from '../../components/AlbumCard';
import { BaseAlbum } from '../../types';

const BrowseAlbumsPage = () => {
    const [albums, setAlbums] = useState<BaseAlbum[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const LIMIT = 24;

    const fetchAlbums = async (pageNum: number) => {
        try {
            const res = await fetch(`/api/albums?page=${pageNum}&limit=${LIMIT}`);
            if (!res.ok) throw new Error('Failed to fetch albums');
            const data: BaseAlbum[] = await res.json();

            if (data.length < LIMIT) {
                setHasMore(false);
            }

            setAlbums(prev => [...prev, ...data]);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching albums:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAlbums(1);
    }, []);

    const loadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchAlbums(nextPage);
    };

    return (
        <MainLayout immersive>
            <div className="min-h-screen pt-24 px-6 pb-24 bg-white dark:bg-neutral-900 text-black dark:text-white">
                <div className="max-w-7xl mx-auto">
                    <SectionHeader title="All Albums" subtitle="Browse all albums" />

                    {loading && albums.length === 0 ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                                {albums.map((album, index) => (
                                    <AlbumCard key={`${album.album_id}-${index}`} album={album} />
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

export default BrowseAlbumsPage;
