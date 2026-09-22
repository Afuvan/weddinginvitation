import React from 'react';
import { Heart, Sparkles, GraduationCap, Instagram, User, Edit3 } from 'lucide-react';
import { WeddingData } from '../types';

interface CoupleStoryProps {
  weddingData: WeddingData;
  onOpenCustomizer: (initialTab?: string) => void;
}

export const CoupleStory: React.FC<CoupleStoryProps> = ({ weddingData, onOpenCustomizer }) => {
  const { groom, bride, theme, storyMilestones } = weddingData;
  const { colors } = theme;

  return (
    <section id="couple" className="py-20 px-4 relative">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Heart className="w-4 h-4 fill-current text-[#D4AF37]" />
            <span className="text-xs uppercase tracking-widest font-semibold" style={{ color: colors.primaryMaroon }}>
              The Bride &amp; Groom
            </span>
            <Heart className="w-4 h-4 fill-current text-[#D4AF37]" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-medium text-stone-900 mb-3">
            Two Hearts, One Sacred Covenant
          </h2>
          <p className="text-sm sm:text-base text-stone-600 font-light">
            Destined by the grace of Allah SWT, united in mutual devotion, mutual respect, and lifelong friendship.
          </p>
          <button
            onClick={() => onOpenCustomizer('couple')}
            className="mt-3 text-xs inline-flex items-center gap-1.5 text-stone-500 hover:text-amber-800 font-medium transition-colors cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Customize Bride &amp; Groom details</span>
          </button>
        </div>

        {/* Couple Profile Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-stretch mb-24">
          {/* GROOM CARD */}
          <div
            className="rounded-3xl border p-6 sm:p-8 flex flex-col justify-between shadow-xs transition-all duration-300 hover:shadow-md relative overflow-hidden bg-white/70"
            style={{ borderColor: `${colors.accentGold}50` }}
          >
            {/* Top Badge */}
            <div className="flex items-center justify-between mb-6">
              <span
                className="px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-white shadow-xs"
                style={{ backgroundColor: colors.primaryMaroon }}
              >
                {groom.title}
              </span>
              <span className="text-xs uppercase tracking-widest text-[#B8860B] font-serif font-bold">
                MashaAllah
              </span>
            </div>

            {/* Groom Photo with Regal Gold Ring Border */}
            <div className="flex flex-col items-center text-center">
              <div
                className="w-44 h-44 sm:w-52 sm:h-52 rounded-full p-1.5 border-2 shadow-lg mb-6 relative group"
                style={{ borderColor: colors.accentGold }}
              >
                <img
                  src={groom.photoUrl}
                  alt={groom.fullName}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>

              <h3 className="text-2xl sm:text-3xl font-serif font-semibold text-stone-900">
                {groom.fullName}
              </h3>
              <p className="text-xs uppercase tracking-wider text-stone-500 font-medium mt-1">
                ({groom.callingName})
              </p>

              {groom.educationOrProfession && (
                <div className="inline-flex items-center gap-1.5 mt-2 text-xs text-stone-600 bg-stone-100/90 px-3 py-1 rounded-full">
                  <GraduationCap className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>{groom.educationOrProfession}</span>
                </div>
              )}

              <p className="text-xs text-stone-500 italic mt-3 font-serif">
                {groom.parents}
              </p>

              <p className="text-sm text-stone-600 leading-relaxed font-light mt-4 px-2 sm:px-4">
                &ldquo;{groom.bio}&rdquo;
              </p>
            </div>

            {groom.instagramOrContact && (
              <div className="mt-6 pt-4 border-t border-stone-200/70 flex items-center justify-center gap-1.5 text-xs text-stone-500">
                <Instagram className="w-3.5 h-3.5 text-pink-700" />
                <span>{groom.instagramOrContact}</span>
              </div>
            )}
          </div>

          {/* BRIDE CARD */}
          <div
            className="rounded-3xl border p-6 sm:p-8 flex flex-col justify-between shadow-xs transition-all duration-300 hover:shadow-md relative overflow-hidden bg-white/70"
            style={{ borderColor: `${colors.accentGold}50` }}
          >
            {/* Top Badge */}
            <div className="flex items-center justify-between mb-6">
              <span
                className="px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-white shadow-xs"
                style={{ backgroundColor: colors.primaryMaroon }}
              >
                {bride.title}
              </span>
              <span className="text-xs uppercase tracking-widest text-[#B8860B] font-serif font-bold">
                Alhamdulillah
              </span>
            </div>

            {/* Bride Photo with Regal Gold Ring Border */}
            <div className="flex flex-col items-center text-center">
              <div
                className="w-44 h-44 sm:w-52 sm:h-52 rounded-full p-1.5 border-2 shadow-lg mb-6 relative group"
                style={{ borderColor: colors.accentGold }}
              >
                <img
                  src={bride.photoUrl}
                  alt={bride.fullName}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>

              <h3 className="text-2xl sm:text-3xl font-serif font-semibold text-stone-900">
                {bride.fullName}
              </h3>
              <p className="text-xs uppercase tracking-wider text-stone-500 font-medium mt-1">
                ({bride.callingName})
              </p>

              {bride.educationOrProfession && (
                <div className="inline-flex items-center gap-1.5 mt-2 text-xs text-stone-600 bg-stone-100/90 px-3 py-1 rounded-full">
                  <GraduationCap className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>{bride.educationOrProfession}</span>
                </div>
              )}

              <p className="text-xs text-stone-500 italic mt-3 font-serif">
                {bride.parents}
              </p>

              <p className="text-sm text-stone-600 leading-relaxed font-light mt-4 px-2 sm:px-4">
                &ldquo;{bride.bio}&rdquo;
              </p>
            </div>

            {bride.instagramOrContact && (
              <div className="mt-6 pt-4 border-t border-stone-200/70 flex items-center justify-center gap-1.5 text-xs text-stone-500">
                <Instagram className="w-3.5 h-3.5 text-pink-700" />
                <span>{bride.instagramOrContact}</span>
              </div>
            )}
          </div>
        </div>

        {/* Our Story Milestone Journey */}
        <div className="mt-12 bg-white/60 rounded-3xl p-6 sm:p-12 border shadow-xs" style={{ borderColor: `${colors.accentGold}40` }}>
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs uppercase tracking-widest font-semibold text-[#B8860B]">
              Destined Pathways
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif font-medium text-stone-900 mt-1">
              Our Journey of Faith &amp; Love
            </h3>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Moments that paved the way to forever
            </p>
          </div>

          <div className="relative max-w-3xl mx-auto">
            {/* Timeline vertical line */}
            <div
              className="absolute left-4 sm:left-1/2 top-4 bottom-4 w-0.5 transform -translate-x-1/2 hidden sm:block"
              style={{ backgroundColor: `${colors.accentGold}60` }}
            />

            <div className="space-y-8 sm:space-y-12">
              {storyMilestones.map((milestone, idx) => {
                const isEven = idx % 2 === 0;
                return (
                  <div
                    key={milestone.id}
                    className={`relative flex flex-col sm:flex-row items-center gap-4 sm:gap-8 ${
                      isEven ? 'sm:flex-row-reverse' : ''
                    }`}
                  >
                    {/* Content Box */}
                    <div className="w-full sm:w-1/2">
                      <div
                        className="bg-white p-5 sm:p-6 rounded-2xl border shadow-xs transition-transform hover:-translate-y-1"
                        style={{ borderColor: `${colors.accentGold}35` }}
                      >
                        <span
                          className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wider text-white mb-2"
                          style={{ backgroundColor: colors.primaryMaroon }}
                        >
                          {milestone.yearOrPhase}
                        </span>
                        <h4 className="text-lg font-serif font-semibold text-stone-900">
                          {milestone.title}
                        </h4>
                        <p className="text-xs sm:text-sm text-stone-600 font-light mt-1.5 leading-relaxed">
                          {milestone.description}
                        </p>
                      </div>
                    </div>

                    {/* Timeline Center Badge */}
                    <div
                      className="hidden sm:flex w-9 h-9 rounded-full items-center justify-center border-2 shadow-xs z-10 bg-white"
                      style={{
                        borderColor: colors.accentGold,
                        color: colors.primaryMaroon,
                      }}
                    >
                      <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                    </div>

                    {/* Empty opposite spacer */}
                    <div className="hidden sm:block w-1/2" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
