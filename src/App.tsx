import React, { useState, useEffect } from 'react';
import { initialWeddingData } from './data/defaultWeddingData';
import { WeddingData, RsvpResponse } from './types';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ScratchCard } from './components/ScratchCard';
import { Countdown } from './components/Countdown';
import { CoupleStory } from './components/CoupleStory';
import { FamilyDetails } from './components/FamilyDetails';
import { EventsSchedule } from './components/EventsSchedule';
import { VenueLocation } from './components/VenueLocation';
import { PhotoGallery } from './components/PhotoGallery';
import { GiftRegistry } from './components/GiftRegistry';
import { RsvpSection } from './components/RsvpSection';
import { CustomizerModal } from './components/CustomizerModal';
import { Footer } from './components/Footer';
import { Sparkles, Edit3 } from 'lucide-react';

export default function App() {
  const [weddingData, setWeddingData] = useState<WeddingData>(() => {
    try {
      const saved = localStorage.getItem('wedding_custom_data');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...initialWeddingData,
          ...parsed,
          giftRegistry: parsed.giftRegistry || initialWeddingData.giftRegistry,
        };
      }
    } catch {
      // Fallback
    }
    return initialWeddingData;
  });

  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [customizerTab, setCustomizerTab] = useState('couple');

  // Persist customized data in localStorage
  const handleUpdateWeddingData = (updated: WeddingData) => {
    setWeddingData(updated);
    try {
      localStorage.setItem('wedding_custom_data', JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

  const handleOpenCustomizer = (initialTab: string = 'couple') => {
    setCustomizerTab(initialTab);
    setIsCustomizerOpen(true);
  };

  const scrollToScratch = () => {
    const el = document.getElementById('reveal-date');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Dynamic font family style
  const getFontFamily = () => {
    switch (weddingData.theme.fontFamily) {
      case 'cormorant':
        return "'Cormorant Garamond', Georgia, serif";
      case 'playfair':
        return "'Playfair Display', Georgia, serif";
      case 'cinzel':
        return "'Cinzel', serif";
      case 'amiri':
        return "'Amiri', serif";
      default:
        return "'Cormorant Garamond', Georgia, serif";
    }
  };

  return (
    <div
      className="min-h-screen text-[#2C1810] relative transition-colors duration-300"
      style={{
        backgroundColor: weddingData.theme.colors.creamBg,
        fontFamily: getFontFamily(),
      }}
    >
      {/* Sticky/Fixed Navigation */}
      <Navbar
        weddingData={weddingData}
        onOpenCustomizer={() => handleOpenCustomizer('couple')}
      />

      {/* Main Invitation Sections */}
      <main className="relative">
        {/* 1. Hero Section */}
        <Hero
          weddingData={weddingData}
          onOpenCustomizer={() => handleOpenCustomizer('couple')}
          onScrollToScratch={scrollToScratch}
        />

        {/* 2. Interactive “Scratch to Reveal Wedding Date” Interaction */}
        <ScratchCard weddingData={weddingData} />

        {/* 3. Live Countdown Timer */}
        <Countdown weddingData={weddingData} />

        {/* 4. Bride & Groom Profiles and Story Timeline */}
        <CoupleStory
          weddingData={weddingData}
          onOpenCustomizer={(tab) => handleOpenCustomizer(tab || 'couple')}
        />

        {/* 5. Both Families' Details & Lineage */}
        <FamilyDetails
          weddingData={weddingData}
          onOpenCustomizer={(tab) => handleOpenCustomizer(tab || 'family')}
        />

        {/* 6. Wedding Events & Schedule (Haldi, Mehendi, Nikah, Walima) */}
        <EventsSchedule
          weddingData={weddingData}
          onOpenCustomizer={(tab) => handleOpenCustomizer(tab || 'events')}
        />

        {/* 7. Venue Logistics & Google Maps Button */}
        <VenueLocation
          weddingData={weddingData}
          onOpenCustomizer={(tab) => handleOpenCustomizer(tab || 'date-venue')}
        />

        {/* 8. Curated Photo Gallery with Lightbox */}
        <PhotoGallery
          weddingData={weddingData}
          onOpenCustomizer={(tab) => handleOpenCustomizer(tab || 'gallery')}
        />

        {/* 9. Gift Registry, Bank Transfer Details & Sadaqah */}
        <GiftRegistry
          weddingData={weddingData}
          onOpenCustomizer={() => handleOpenCustomizer('registry')}
        />

        {/* 10. RSVP Form with Guest count & Blessings */}
        <RsvpSection weddingData={weddingData} />
      </main>

      {/* Footer with Duas, Print Button & Monogram */}
      <Footer
        weddingData={weddingData}
        onOpenCustomizer={() => handleOpenCustomizer('theme')}
      />

      {/* Persistent Floating "Customize Everything" Button for Instant Access */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => handleOpenCustomizer('couple')}
          className="group flex items-center gap-2 px-4 py-3 rounded-full text-xs font-bold shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer border border-[#D4AF37]/80"
          style={{
            backgroundColor: weddingData.theme.colors.accentGold,
            color: '#26120D',
          }}
          title="Customize bride & groom names, colors, photos, events & families"
        >
          <Sparkles className="w-4 h-4 text-[#781729] animate-spin-slow" />
          <span className="hidden sm:inline">Customize Everything</span>
          <span className="sm:hidden">Customize</span>
          <Edit3 className="w-3.5 h-3.5 text-[#781729]" />
        </button>
      </div>

      {/* Comprehensive Visual Customizer Drawer / Modal */}
      <CustomizerModal
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        weddingData={weddingData}
        onUpdateWeddingData={handleUpdateWeddingData}
        initialTab={customizerTab}
      />
    </div>
  );
}
