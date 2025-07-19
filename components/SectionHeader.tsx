interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  showViewAll?: boolean;
}

const SectionHeader = ({ title, subtitle, showViewAll = false }: SectionHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-black dark:text-white mb-1">
          {title}
        </h2>
        {subtitle && (
          <p className="text-white/70 text-sm">
            {subtitle}
          </p>
        )}
      </div>
      
      {showViewAll && (
        <button className="text-white/70 hover:text-white text-sm font-medium transition-colors duration-200">
          View All
        </button>
      )}
    </div>
  );
};

export default SectionHeader;