import React from 'react';
import { Users, Heart, Home, Edit3 } from 'lucide-react';
import { WeddingData } from '../types';

interface FamilyDetailsProps {
  weddingData: WeddingData;
  onOpenCustomizer: (initialTab?: string) => void;
}

export const FamilyDetails: React.FC<FamilyDetailsProps> = ({ weddingData, onOpenCustomizer }) => {
  const { groomFamily, brideFamily, theme } = weddingData;
  const { colors } = theme;

  return (
    <section id="families" className="py-20 px-4 bg-stone-50/50">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Users className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-xs uppercase tracking-widest font-semibold" style={{ color: colors.primaryMaroon }}>
              United in Matrimony
            </span>
            <Users className="w-4 h-4 text-[#D4AF37]" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-medium text-stone-900 mb-3">
            With The Blessings of Our Families
          </h2>
          <p className="text-sm sm:text-base text-stone-600 font-light">
            Our parents and families cordially request the honor of your presence and heartfelt Duas.
          </p>
          <button
            onClick={() => onOpenCustomizer('family')}
            className="mt-3 text-xs inline-flex items-center gap-1.5 text-stone-500 hover:text-amber-800 font-medium transition-colors cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Customize family names &amp; details</span>
          </button>
        </div>

        {/* Both Families Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* GROOM'S FAMILY */}
          <div
            className="bg-white rounded-3xl p-6 sm:p-8 border shadow-xs flex flex-col justify-between transition-all hover:shadow-md"
            style={{ borderColor: `${colors.accentGold}40` }}
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-stone-200">
                <div>
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-[#B8860B]">
                    Groom&apos;s Lineage
                  </span>
                  <h3 className="text-2xl font-serif font-bold" style={{ color: colors.primaryMaroon }}>
                    {groomFamily.familyName}
                  </h3>
                </div>
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${colors.primaryMaroon}12`, color: colors.primaryMaroon }}
                >
                  <Home className="w-5 h-5" />
                </div>
              </div>

              {/* Parents */}
              <div className="mt-6">
                <span className="text-xs uppercase tracking-wider text-stone-400 font-medium">Parents</span>
                <p className="text-base sm:text-lg font-serif font-semibold text-stone-800 mt-0.5">
                  {groomFamily.parents}
                </p>
              </div>

              {/* Grandparents */}
              {groomFamily.grandparents && (
                <div className="mt-4">
                  <span className="text-xs uppercase tracking-wider text-stone-400 font-medium">Paternal / Maternal Elders</span>
                  <p className="text-sm font-serif text-stone-600 italic mt-0.5">
                    {groomFamily.grandparents}
                  </p>
                </div>
              )}

              {/* Additional Members */}
              {groomFamily.additionalMembers && groomFamily.additionalMembers.length > 0 && (
                <div className="mt-4 pt-4 border-t border-stone-100 flex flex-col gap-2">
                  {groomFamily.additionalMembers.map((m, i) => (
                    <div key={i} className="text-xs text-stone-600 flex items-center justify-between">
                      <span className="font-medium text-stone-500">{m.role}:</span>
                      <span className="font-semibold text-stone-700">{m.name}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Welcome Cordial Message */}
              <div
                className="mt-6 p-4 rounded-2xl text-xs sm:text-sm text-stone-600 font-light leading-relaxed italic border"
                style={{
                  backgroundColor: `${colors.softCream}70`,
                  borderColor: `${colors.accentGold}30`,
                }}
              >
                &ldquo;{groomFamily.welcomeMessage}&rdquo;
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-stone-100 text-[11px] text-stone-400 text-center">
              Residence: {groomFamily.residence}
            </div>
          </div>

          {/* BRIDE'S FAMILY */}
          <div
            className="bg-white rounded-3xl p-6 sm:p-8 border shadow-xs flex flex-col justify-between transition-all hover:shadow-md"
            style={{ borderColor: `${colors.accentGold}40` }}
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-stone-200">
                <div>
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-[#B8860B]">
                    Bride&apos;s Lineage
                  </span>
                  <h3 className="text-2xl font-serif font-bold" style={{ color: colors.primaryMaroon }}>
                    {brideFamily.familyName}
                  </h3>
                </div>
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${colors.primaryMaroon}12`, color: colors.primaryMaroon }}
                >
                  <Heart className="w-5 h-5" />
                </div>
              </div>

              {/* Parents */}
              <div className="mt-6">
                <span className="text-xs uppercase tracking-wider text-stone-400 font-medium">Parents</span>
                <p className="text-base sm:text-lg font-serif font-semibold text-stone-800 mt-0.5">
                  {brideFamily.parents}
                </p>
              </div>

              {/* Grandparents */}
              {brideFamily.grandparents && (
                <div className="mt-4">
                  <span className="text-xs uppercase tracking-wider text-stone-400 font-medium">Paternal / Maternal Elders</span>
                  <p className="text-sm font-serif text-stone-600 italic mt-0.5">
                    {brideFamily.grandparents}
                  </p>
                </div>
              )}

              {/* Additional Members */}
              {brideFamily.additionalMembers && brideFamily.additionalMembers.length > 0 && (
                <div className="mt-4 pt-4 border-t border-stone-100 flex flex-col gap-2">
                  {brideFamily.additionalMembers.map((m, i) => (
                    <div key={i} className="text-xs text-stone-600 flex items-center justify-between">
                      <span className="font-medium text-stone-500">{m.role}:</span>
                      <span className="font-semibold text-stone-700">{m.name}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Welcome Cordial Message */}
              <div
                className="mt-6 p-4 rounded-2xl text-xs sm:text-sm text-stone-600 font-light leading-relaxed italic border"
                style={{
                  backgroundColor: `${colors.softCream}70`,
                  borderColor: `${colors.accentGold}30`,
                }}
              >
                &ldquo;{brideFamily.welcomeMessage}&rdquo;
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-stone-100 text-[11px] text-stone-400 text-center">
              Residence: {brideFamily.residence}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
