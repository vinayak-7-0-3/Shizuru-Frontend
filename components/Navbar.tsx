import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Navbar = (
  {
    toggleDark,
    darkMode,
  }:
    {
      toggleDark: () => void;
      darkMode: boolean;
    }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-xl bg-white/10 dark:bg-black/30 border-b border-white/20 dark:border-white/10">
      <div className="w-full px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-black dark:text-white">Shizuru Music</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link href="/" className="text-black dark:text-white hover:text-black/30 dark:hover:text-white/40 transition-colors">Home</Link>
            <Link href="/browse" className="text-black dark:text-white hover:text-black/30 dark:hover:text-white/40 transition-colors">Browse</Link>
            <Link href="/library" className="text-black dark:text-white hover:text-black/30 dark:hover:text-white/40 transition-colors">Library</Link>
            <Link href="/library/playlists" className="text-black dark:text-white hover:text-black/30 dark:hover:text-white/40 transition-colors">Playlists</Link>
          </div>

          {/* Search Bar */}
          <div className="hidden lg:flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search songs, artists, albums..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                className="w-64 px-4 py-2 bg-white/20 backdrop-blur-sm border border-neutral-300 dark:border-white/10 rounded-full text-black dark:text-white placeholder-black/30 dark:placeholder-white focus:outline-none focus:border-white/50 transition-all"
              />
              <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-black dark:text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
              </svg>
            </div>

            <button className="p-2 bg-white/20 backdrop-blur-sm border border-neutral-300 dark:border-white/30 rounded-full hover:bg-white/30 transition-all">
              <svg className="w-5 h-5 text-black dark:text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </button>
            <button
              onClick={toggleDark}
              className="p-2 bg-white/20 backdrop-blur-sm border border-neutral-300 dark:border-white/30 rounded-full hover:bg-white/30 transition-all"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                // Moon icon for dark mode
                <svg className="w-5 h-5 text-black dark:text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                </svg>
              ) : (
                // Sun icon for light mode
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" fill="none" />
                  <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M12 2v2M12 20v2M20 12h2M2 12h2M17.66 6.34l1.41-1.41M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41" />
                </svg>

              )}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-black dark:text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
            </svg>
          </button>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-white/20 pt-4">
            <div className="flex flex-col space-y-4">
              <Link href="/" className="text-black dark:text-white hover:text-white/80 transition-colors">Home</Link>
              <Link href="/browse" className="text-black dark:text-white/70 hover:text-white transition-colors">Browse</Link>
              <Link href="/library" className="text-black dark:text-white/70 hover:text-white transition-colors">Library</Link>
              <Link href="/library/playlists" className="text-black dark:text-white/70 hover:text-white transition-colors">Playlists</Link>

              <button
                onClick={toggleDark}
                className="mt-4 w-full px-4 py-2
                bg-neutral-100 dark:bg-white/10
                text-black dark:text-white
                border border-neutral-300 dark:border-white/10
                rounded-full flex items-center justify-center space-x-2
                transition-all"
              >
                {darkMode ? (
                  <>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                    </svg>
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" fill="none" />
                      <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M12 2v2M12 20v2M20 12h2M2 12h2M17.66 6.34l1.41-1.41M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41" />
                    </svg>
                    <span>Dark Mode</span>
                  </>
                )}
              </button>

              <div className="pt-4">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearch}
                  className="w-full px-4 py-2 bg-neutral-100 dark:bg-white/10 text-black dark:text-white border border-neutral-300 dark:border-white/10 backdrop-blur-sm rounded-full placeholder-black/30 dark:placeholder-white focus:outline-none focus:border-white/50 transition-all"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;