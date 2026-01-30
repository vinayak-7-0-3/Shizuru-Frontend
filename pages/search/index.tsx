import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Search, Music, Disc, Mic2, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import MainLayout from '../../components/MainLayout';
import SectionHeader from '../../components/SectionHeader';
import TrackCard from '../../components/TrackCard';
import AlbumCard from '../../components/AlbumCard';
import ArtistCard from '../../components/ArtistCard';
import { SearchResponse, BaseTrack, BaseAlbum, BaseArtist } from '../../types';

const SearchPage = () => {
    const router = useRouter();
    const { q, type } = router.query;
    const [loading, setLoading] = useState(true);
    const [results, setResults] = useState<SearchResponse | null>(null);
    const [activeTab, setActiveTab] = useState<'all' | 'track' | 'album' | 'artist'>('all');
    const [page, setPage] = useState(1);

    useEffect(() => {
        if (type && typeof type === 'string' && ['all', 'track', 'album', 'artist'].includes(type)) {
            setActiveTab(type as 'all' | 'track' | 'album' | 'artist');
        } else {
            setActiveTab('all');
        }
    }, [type]);

    useEffect(() => {
        const fetchResults = async () => {
            if (!q) {
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const typeParam = activeTab === 'all' ? 'all' : activeTab;
                const res = await fetch(`/api/search?q=${encodeURIComponent(q as string)}&type=${typeParam}&page=${page}&limit=20`);
                if (!res.ok) throw new Error('Search failed');
                const data = await res.json();
                setResults(data);
            } catch (error) {
                console.error('Search error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [q, activeTab, page]);

    const handleTabChange = (tab: 'all' | 'track' | 'album' | 'artist') => {
        setActiveTab(tab);
        setPage(1);
        // Update URL without refreshing
        router.push({
            pathname: '/search',
            query: { ...router.query, type: tab, page: 1 },
        }, undefined, { shallow: true });
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        router.push({
            pathname: '/search',
            query: { ...router.query, page: newPage },
        }, undefined, { shallow: true });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const tabs = [
        { id: 'all', label: 'All Results', icon: Search },
        { id: 'track', label: 'Tracks', icon: Music },
        { id: 'album', label: 'Albums', icon: Disc },
        { id: 'artist', label: 'Artists', icon: Mic2 },
    ] as const;

    return (
        <MainLayout immersive>
            <Head>
                <title>{`Search Results for "${q}" - Shizuru Music`}</title>
            </Head>

            <div className="min-h-screen pt-24 px-6 pb-20">
                <div className="max-w-7xl mx-auto space-y-8">

                    {/* Header & Tabs */}
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-3xl font-bold text-black dark:text-white">
                                Search Results
                            </h1>
                            <p className="text-neutral-500 dark:text-neutral-400 mt-1">
                                Found results for "{q}"
                            </p>
                        </div>

                        <div className="flex gap-2 overflow-x-auto p-1 scrollbar-hide">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => handleTabChange(tab.id as any)}
                                        className={`
                        flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all
                        ${isActive
                                                ? 'bg-black text-white dark:bg-white dark:text-black scale-105'
                                                : 'bg-neutral-100 text-neutral-600 dark:bg-white/10 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-white/20'}
                        `}
                                    >
                                        <Icon size={18} />
                                        <span>{tab.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Results */}
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-black dark:border-white"></div>
                        </div>
                    ) : !results ? (
                        <div className="text-center py-20">
                            <p className="text-neutral-500 text-lg">Enter a search term to get started</p>
                        </div>
                    ) : (
                        <div className="space-y-12">

                            {/* Tracks Section */}
                            {(activeTab === 'all' || activeTab === 'track') && results.tracks?.length > 0 && (
                                <section className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <SectionHeader title={(activeTab === 'all' ? "Songs" : "")} />
                                        {activeTab === 'all' && (
                                            <button
                                                onClick={() => handleTabChange('track')}
                                                className="text-sm text-neutral-500 hover:text-black dark:hover:text-white flex items-center gap-1 transition-colors"
                                            >
                                                See all <ArrowRight size={16} />
                                            </button>
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        {results.tracks.map((track) => (
                                            <TrackCard key={track.track_id} track={track} layout="list" />
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Albums Section */}
                            {(activeTab === 'all' || activeTab === 'album') && results.albums?.length > 0 && (
                                <section className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <SectionHeader title={(activeTab === 'all' ? "Albums" : "")} />
                                        {activeTab === 'all' && (
                                            <button
                                                onClick={() => handleTabChange('album')}
                                                className="text-sm text-neutral-500 hover:text-black dark:hover:text-white flex items-center gap-1 transition-colors"
                                            >
                                                See all <ArrowRight size={16} />
                                            </button>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                                        {results.albums.map((album) => (
                                            <AlbumCard key={album.album_id} album={album} />
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Artists Section */}
                            {(activeTab === 'all' || activeTab === 'artist') && results.artists?.length > 0 && (
                                <section className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <SectionHeader title={(activeTab === 'all' ? "Artists" : "")} />
                                        {activeTab === 'all' && (
                                            <button
                                                onClick={() => handleTabChange('artist')}
                                                className="text-sm text-neutral-500 hover:text-black dark:hover:text-white flex items-center gap-1 transition-colors"
                                            >
                                                See all <ArrowRight size={16} />
                                            </button>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                                        {results.artists.map((artist) => (
                                            <ArtistCard key={artist.artist_id} artist={artist} />
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* No Results */}
                            {(!results.tracks?.length && !results.albums?.length && !results.artists?.length) && (
                                <div className="text-center py-20 text-neutral-500">
                                    <p className="text-xl font-medium">No results found for "{q}"</p>
                                    <p className="mt-2">Try searching for something else or check the spelling.</p>
                                </div>
                            )}

                            {/* Pagination (Only for specific types, not 'all') */}
                            {activeTab !== 'all' && (
                                <div className="flex justify-center items-center gap-4 py-8">
                                    <button
                                        onClick={() => handlePageChange(Math.max(1, page - 1))}
                                        disabled={page === 1}
                                        className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <ChevronLeft size={24} />
                                    </button>
                                    <span className="text-sm font-medium">Page {page}</span>
                                    <button
                                        onClick={() => handlePageChange(page + 1)}
                                        // Note: Backend doesn't give total pages, so we might need infinite scroll or "Next" until empty
                                        // For now, we allow next until results are empty (< limit), but here we don't check limit strictly
                                        // Better simple heuristic: if results are less than limit (20), disable next.
                                        disabled={((activeTab === 'track' ? results.tracks : activeTab === 'album' ? results.albums : results.artists) || []).length < 20}
                                        className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <ChevronRight size={24} />
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
};

export default SearchPage;
