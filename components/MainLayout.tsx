import { ReactNode, useEffect, useState } from 'react';
import Navbar from './Navbar';
import MiniPlayer from './MiniPlayer';
import FullPlayer from './FullPlayer';
import { useMusicPlayer } from '../contexts/MusicPlayerContext';

interface MainLayoutProps {
  children: ReactNode;
  immersive?: boolean;
}

const MainLayout = ({ children, immersive = false }: MainLayoutProps) => {
  const { isFullScreen } = useMusicPlayer();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check for saved preference
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  return (
    <>
      <Navbar toggleDark={() => setDarkMode(prev => !prev)} darkMode={darkMode} />
      <main className={`text-black dark:text-white transition-colors duration-300 pb-20 ${immersive ? '' : 'pt-[74px]'}`}>
        {children}
      </main>
      <MiniPlayer />
      {isFullScreen && <FullPlayer />}
    </>
  );
};

export default MainLayout;