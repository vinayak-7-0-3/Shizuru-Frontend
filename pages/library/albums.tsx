import MainLayout from '../../components/MainLayout';
import SectionHeader from '../../components/SectionHeader';

const AlbumsPage = () => {
    return (
        <MainLayout immersive>
            <div className="min-h-screen pt-24 px-6 bg-white dark:bg-neutral-900 text-black dark:text-white">
                <div className="w-full">
                    <SectionHeader title="Your Albums" />
                    <div className="mt-8 text-center text-neutral-500 dark:text-neutral-400">
                        <p>Your saved albums will appear here.</p>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default AlbumsPage;
