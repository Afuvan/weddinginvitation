import React from 'react';
import { Sparkles, Calendar, Heart, MapPin, Edit3 } from 'lucide-react';
import { WeddingData } from '../types';

interface HeroProps {
  weddingData: WeddingData;
  onOpenCustomizer: () => void;
  onScrollToScratch: () => void;
}

export const Hero: React.FC<HeroProps> = ({ weddingData, onOpenCustomizer, onScrollToScratch }) => {
  const { colors, enableBismillah, bismillahText, enableIslamicVerse, verseTextArabic, verseTranslation, verseReference } = weddingData.theme;

  return (
    <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden flex flex-col items-center justify-center text-center px-4">
      {/* Subtle luxury backdrop geometric aura */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40 -z-10"
        style={{
          background: `radial-gradient(circle at 50% 25%, ${colors.softCream} 0%, transparent 70%)`,
        }}
      />

      {/* Decorative Traditional Arch & Border Flourish */}
      <div className="max-w-4xl mx-auto w-full relative">
        {/* Customizable Top Banner Callout */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium border shadow-xs mb-8 transition-transform hover:scale-105"
          style={{
            backgroundColor: `${colors.primaryMaroon}10`,
            borderColor: `${colors.accentGold}80`,
            color: colors.primaryMaroon,
          }}
        >
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span className="font-semibold tracking-wide">✨ Top Highlight: You Can Customize Everything</span>
          <button
            onClick={onOpenCustomizer}
            className="ml-1 text-[11px] underline font-bold hover:text-amber-700 flex items-center gap-1 cursor-pointer"
          >
            <Edit3 className="w-3 h-3 inline" /> Edit Now
          </button>
        </div>

        {/* Bismillah Calligraphy */}
        {enableBismillah && (
          <div className="mb-6 flex flex-col items-center">
            <span
              className="text-2xl sm:text-3xl md:text-4xl font-serif text-center font-normal tracking-wide transition-all select-none"
              style={{
                fontFamily: "'Amiri', serif",
                color: colors.primaryMaroon,
              }}
            >
              {bismillahText}
            </span>
            <div className="w-24 h-0.5 mt-2 rounded-full" style={{ backgroundColor: colors.accentGold }} />
          </div>
        )}

        {/* Quranic Verse */}
        {enableIslamicVerse && (
          <div className="max-w-2xl mx-auto mb-8 px-4">
            <p
              className="text-lg sm:text-xl font-serif leading-relaxed text-stone-700 mb-2 italic"
              style={{ fontFamily: "'Amiri', serif" }}
            >
              {verseTextArabic}
            </p>
            <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed max-w-xl mx-auto">
              {verseTranslation}
            </p>
            <p
              className="text-[11px] uppercase tracking-widest mt-1.5 font-semibold"
              style={{ color: colors.accentGold }}
            >
              {verseReference}
            </p>
          </div>
        )}

        {/* Family Greeting Prefix */}
        <p className="text-xs sm:text-sm uppercase tracking-widest text-stone-500 font-medium mb-3">
          Together with their families cordially invite you to the wedding of
        </p>

        {/* Couple Names - The Crown of the Invitation */}
        <div className="py-4 my-2 relative">
          {/* Subtle gold crown / floral ornament top */}
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="h-[1px] w-12 sm:w-20" style={{ backgroundColor: `${colors.accentGold}60` }} />
            <Heart className="w-4 h-4 fill-current" style={{ color: colors.accentGold }} />
            <div className="h-[1px] w-12 sm:w-20" style={{ backgroundColor: `${colors.accentGold}60` }} />
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif tracking-tight font-medium my-1 leading-tight">
            <span
              className="inline-block transition-transform hover:scale-102"
              style={{
                color: colors.primaryMaroon,
                fontFamily: weddingData.theme.fontFamily === 'cormorant' ? "'Cormorant Garamond', serif" : "'Playfair Display', serif",
              }}
            >
              {weddingData.groom.callingName}
            </span>
            <span
              className="inline-block mx-3 sm:mx-6 font-serif italic text-3xl sm:text-5xl font-light"
              style={{ color: colors.accentGold }}
            >
              &amp;
            </span>
            <span
              className="inline-block transition-transform hover:scale-102"
              style={{
                color: colors.primaryMaroon,
                fontFamily: weddingData.theme.fontFamily === 'cormorant' ? "'Cormorant Garamond', serif" : "'Playfair Display', serif",
              }}
            >
              {weddingData.bride.callingName}
            </span>
          </h1>

          {/* Full Formal Names */}
          <p className="text-sm sm:text-base font-serif tracking-wide text-stone-700 mt-2">
            <span>{weddingData.groom.fullName}</span>
            <span className="mx-2 text-[#D4AF37]">•</span>
            <span>{weddingData.bride.fullName}</span>
          </p>

          <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-lg mx-auto font-light">
            {weddingData.heroSubtitle}
          </p>
        </div>

        {/* Date, Time & Venue Highlight Card */}
        <div
          className="mt-6 p-6 rounded-2xl border max-w-xl mx-auto shadow-sm backdrop-blur-xs relative group"
          style={{
            backgroundColor: `${colors.softCream}70`,
            borderColor: `${colors.accentGold}40`,
          }}
        >
          <div className="flex flex-col sm:flex-row items-center justify-around gap-4 text-center">
            {/* Date */}
            <div className="flex flex-col items-center">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center mb-1.5"
                style={{ backgroundColor: `${colors.primaryMaroon}15`, color: colors.primaryMaroon }}
              >
                <Calendar className="w-5 h-5" />
              </div>
              <span className="text-[11px] uppercase tracking-wider text-stone-500 font-semibold">Wedding Date</span>
              <span className="font-serif text-base sm:text-lg font-semibold text-stone-900 mt-0.5">
                {weddingData.weddingDateFormatted}
              </span>
              <span className="text-xs text-stone-600">{weddingData.weddingTime}</span>
            </div>

            <div className="hidden sm:block w-[1px] h-14 bg-stone-300/80" />

            {/* Venue */}
            <div className="flex flex-col items-center">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center mb-1.5"
                style={{ backgroundColor: `${colors.primaryMaroon}15`, color: colors.primaryMaroon }}
              >
                <MapPin className="w-5 h-5" />
              </div>
              <span className="text-[11px] uppercase tracking-wider text-stone-500 font-semibold">Auspicious Venue</span>
              <span className="font-serif text-base sm:text-lg font-semibold text-stone-900 mt-0.5">
                {weddingData.venueName}
              </span>
              <span className="text-xs text-stone-600 max-w-[220px] truncate">{weddingData.venueCity}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          {/* Scratch Card CTA */}
          <button
            onClick={onScrollToScratch}
            className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold shadow-md transition-all duration-200 transform hover:-translate-y-0.5 active:scale-95 cursor-pointer"
            style={{
              backgroundColor: colors.primaryMaroon,
              color: '#FAF6EE',
              border: `1px solid ${colors.accentGold}`,
            }}
          >
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <span>Scratch to Reveal Date</span>
          </button>

          {/* RSVP Button */}
          <a
            href="#rsvp"
            className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold border transition-all duration-200 hover:bg-stone-200/60 active:scale-95 cursor-pointer"
            style={{
              borderColor: colors.accentGold,
              color: colors.primaryMaroon,
              backgroundColor: '#FAF6EE',
            }}
          >
            <Heart className="w-4 h-4 text-[#D4AF37]" />
            <span>RSVP to Celebrate</span>
          </a>

          {/* Customize Wedding Quick Button */}
          <button
            onClick={onOpenCustomizer}
            className="flex items-center gap-2 px-5 py-3 rounded-full text-sm font-medium transition-all duration-200 text-stone-700 hover:text-stone-900 hover:bg-stone-200/40 cursor-pointer"
          >
            <Edit3 className="w-4 h-4 text-amber-600" />
            <span>Customize Everything</span>
          </button>
        </div>

        {/* Hashtag */}
        <div className="mt-6 text-xs uppercase tracking-widest text-amber-800/80 font-medium">
          {weddingData.heroHashtag}
        </div>
      </div>
    </section>
  );
};
