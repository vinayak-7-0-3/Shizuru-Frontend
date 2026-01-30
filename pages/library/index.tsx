import Link from 'next/link';
import { Music, Mic2, Disc, ListMusic } from 'lucide-react';
import MainLayout from '../../components/MainLayout';
import SectionHeader from '../../components/SectionHeader';

const LibraryPage = () => {
    const libraryItems = [
        {
            title: 'Tracks',
            icon: Music,
            href: '/library/tracks',
            color: 'from-pink-500 to-rose-500',
        },
        {
            title: 'Artists',
            icon: Mic2,
            href: '/library/artists',
            color: 'from-purple-500 to-indigo-500',
        },
        {
            title: 'Albums',
            icon: Disc,
            href: '/library/albums',
            color: 'from-blue-500 to-cyan-500',
        },
        {
            title: 'Playlists',
            icon: ListMusic,
            href: '/library/playlists',
            color: 'from-emerald-500 to-teal-500',
        },
    ];

    return (
        <MainLayout immersive>
            <div className="min-h-screen pt-24 px-6 bg-white dark:bg-neutral-900 text-black dark:text-white">
                <div className="w-full">
                    <SectionHeader title="Your Library" />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                        {libraryItems.map((item) => (
                            <Link key={item.title} href={item.href} className="group relative overflow-hidden rounded-2xl p-1 hover:scale-105 transition-all duration-300">
                                <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-10 group-hover:opacity-20 transition-opacity`} />
                                <div className="relative h-48 bg-white/5 backdrop-blur-sm border border-black/5 dark:border-white/10 rounded-xl flex flex-col items-center justify-center gap-4 transition-colors group-hover:bg-white/10">
                                    <div className={`p-4 rounded-full bg-gradient-to-br ${item.color} text-white shadow-lg`}>
                                        <item.icon size={32} />
                                    </div>
                                    <h3 className="text-xl font-bold">{item.title}</h3>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default LibraryPage;
