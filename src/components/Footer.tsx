import React from 'react';
import { Heart, Sparkles, Printer, ArrowUp } from 'lucide-react';
import { WeddingData } from '../types';

interface FooterProps {
  weddingData: WeddingData;
  onOpenCustomizer: () => void;
}

export const Footer: React.FC<FooterProps> = ({ weddingData, onOpenCustomizer }) => {
  const { colors } = weddingData.theme;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <footer
      className="py-16 px-4 text-center border-t relative overflow-hidden"
      style={{
        backgroundColor: colors.primaryMaroon,
        color: '#FAF6EE',
        borderColor: colors.accentGold,
      }}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Monogram */}
        <div
          className="w-16 h-16 rounded-full mx-auto flex items-center justify-center font-serif text-2xl font-bold border-2 shadow-lg"
          style={{
            borderColor: colors.accentGold,
            backgroundColor: `${colors.darkMaroon}90`,
            color: '#FAF6EE',
          }}
        >
          {weddingData.groom.callingName.charAt(0)}&amp;{weddingData.bride.callingName.charAt(0)}
        </div>

        {/* Couple Names */}
        <h3 className="text-3xl sm:text-4xl font-serif font-medium tracking-wide">
          {weddingData.groom.callingName} &amp; {weddingData.bride.callingName}
        </h3>

        {/* Islamic Benediction */}
        <div className="max-w-xl mx-auto px-4">
          <p className="font-serif text-xl sm:text-2xl text-amber-200/90 italic leading-relaxed" style={{ fontFamily: "'Amiri', serif" }}>
            بَارَكَ اللَّهُ لَكُمَا وَبَارَكَ عَلَيْكُمَا وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ
          </p>
          <p className="text-xs sm:text-sm text-stone-200/80 font-light mt-2 leading-relaxed">
            &ldquo;May Allah bless you both, shower His blessings upon you, and unite you in perpetual goodness, faith, and joy.&rdquo;
          </p>
        </div>

        {/* Wedding Hashtag */}
        <p className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold">
          {weddingData.heroHashtag}
        </p>

        {/* Quick Utility CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-white/10">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-white/10 hover:bg-white/20 text-[#FAF6EE] border border-white/20 transition-all cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Print Invitation / PDF</span>
          </button>

          <button
            onClick={onOpenCustomizer}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold text-stone-900 shadow-md transition-all transform hover:scale-105 cursor-pointer"
            style={{ backgroundColor: colors.accentGold }}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#781729]" />
            <span>Customize This Invitation</span>
          </button>

          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-1 px-3 py-2 rounded-full text-xs font-medium text-stone-300 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowUp className="w-3.5 h-3.5" />
            <span>Back to top</span>
          </button>
        </div>

        <p className="text-[11px] text-stone-300/60 pt-6">
          With prayers, love and warm regards from both the Khan and Sheikh families.
        </p>
      </div>
    </footer>
  );
};
