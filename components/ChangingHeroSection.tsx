import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from 'next/image';
import { BaseTrack } from "@/types";

interface HeroSectionProps {
  featuredTrack?: BaseTrack;
}

interface ChangingHeroSectionProps {
  tracks: BaseTrack[];
  intervalMs?: number;
}

const HeroSection = ({ featuredTrack }: HeroSectionProps) => {
  if (!featuredTrack) return null;

  return (
    <div className="relative h-[32rem] sm:h-[28rem] mb-6 sm:mb-8 overflow-hidden pt-20">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center filter blur-sm scale-105"
        style={{
          backgroundImage: `url(${featuredTrack.cover_url || '/cover_art.png'})`
        }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Glassmorphism Container */}
      <div className="relative h-full flex items-center justify-center px-4 sm:px-6">
        <div className="backdrop-blur-xl bg-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-8 max-w-4xl mx-auto border border-white/20 w-full">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-8">

            {/* Album Art */}
            <div className="flex-shrink-0">
              <Image
                src={featuredTrack.cover_url || '/cover_art.png'}
                alt={featuredTrack.title}
                width={192}
                height={192}
                className="w-24 h-24 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-xl sm:rounded-2xl shadow-2xl object-cover"
                unoptimized
              />
            </div>

            {/* Track Info */}
            <div className="text-center sm:text-left text-white w-full">
              <p className="text-xs sm:text-sm font-medium text-white/70 mb-1 sm:mb-2">
                FEATURED TRACK
              </p>
              <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-1 sm:mb-2 leading-tight break-words">
                {featuredTrack.title}
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-white/80 mb-1 sm:mb-3">
                {featuredTrack.artist}
              </p>
              {featuredTrack.album && (
                <p className="text-base sm:text-lg text-white/60 mb-4 sm:mb-6">
                  {featuredTrack.album}
                </p>
              )}

              {/* Play Button */}
              <button className="w-full sm:w-auto bg-white/20 backdrop-blur-sm border border-white/30 text-white px-6 py-2 sm:px-8 sm:py-3 rounded-full font-semibold hover:bg-white/30 transition-all duration-300 hover:scale-105">
                ▶ Play Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ChangingHeroSection = ({ tracks, intervalMs = 5000 }: ChangingHeroSectionProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (tracks.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % tracks.length);
    }, intervalMs);

    return () => clearInterval(interval);
  }, [tracks, intervalMs]);

  const currentTrack = tracks[currentIndex];

  if (!currentTrack) return null;

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentTrack.track_id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          <HeroSection featuredTrack={currentTrack} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ChangingHeroSection;
