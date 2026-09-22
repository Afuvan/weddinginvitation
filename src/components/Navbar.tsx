import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Sparkles, Menu, X, Heart, Calendar, MapPin, Users, Camera, Mail, Gift } from 'lucide-react';
import { WeddingData } from '../types';
import { weddingAudio } from '../utils/audio';

interface NavbarProps {
  weddingData: WeddingData;
  onOpenCustomizer: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ weddingData, onOpenCustomizer }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleToggleMusic = () => {
    const playing = weddingAudio.toggleAmbient((state) => setIsPlayingMusic(state));
    setIsPlayingMusic(playing);
  };

  const navLinks = [
    { label: 'Couple', href: '#couple', icon: Heart },
    { label: 'Schedule', href: '#events', icon: Calendar },
    { label: 'Date & Reveal', href: '#reveal-date', icon: Sparkles },
    { label: 'Families', href: '#families', icon: Users },
    { label: 'Venue', href: '#venue', icon: MapPin },
    { label: 'Gallery', href: '#gallery', icon: Camera },
    { label: 'Registry', href: '#registry', icon: Gift },
    { label: 'RSVP', href: '#rsvp', icon: Mail },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#FAF6EE]/95 backdrop-blur-md shadow-sm border-b border-[#D4AF37]/30 py-2.5'
            : 'bg-transparent py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Monogram Brand */}
            <a
              href="#"
              className="flex items-center gap-2 group transition-transform active:scale-95"
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center font-serif text-lg font-bold border"
                style={{
                  backgroundColor: weddingData.theme.colors.primaryMaroon,
                  color: '#FAF6EE',
                  borderColor: weddingData.theme.colors.accentGold,
                }}
              >
                {weddingData.groom.callingName.charAt(0)}&amp;{weddingData.bride.callingName.charAt(0)}
              </div>
              <div className="text-left hidden sm:block">
                <span
                  className="font-serif tracking-widest text-sm font-semibold uppercase block"
                  style={{ color: weddingData.theme.colors.primaryMaroon }}
                >
                  {weddingData.groom.callingName} &amp; {weddingData.bride.callingName}
                </span>
                <span className="text-[10px] tracking-wider text-amber-800/80 block uppercase">
                  Wedding Matrimony
                </span>
              </div>
            </a>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-6">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-xs uppercase tracking-widest font-medium transition-colors hover:text-[#781729] relative py-1 group"
                  style={{ color: '#4A332D' }}
                >
                  {link.label}
                  <span
                    className="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-200 group-hover:w-full"
                    style={{ backgroundColor: weddingData.theme.colors.accentGold }}
                  />
                </a>
              ))}
            </nav>

            {/* Actions: Ambient Audio & Customize Button */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Music Player Button */}
              <button
                id="ambient-audio-toggle"
                onClick={handleToggleMusic}
                aria-label="Toggle ambient wedding melody"
                title={isPlayingMusic ? 'Mute ambient melody' : 'Play soft ambient melody'}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 active:scale-95 cursor-pointer shadow-xs"
                style={{
                  backgroundColor: isPlayingMusic ? weddingData.theme.colors.primaryMaroon : '#FAF6EE',
                  color: isPlayingMusic ? '#FAF6EE' : weddingData.theme.colors.primaryMaroon,
                  borderColor: weddingData.theme.colors.accentGold,
                }}
              >
                {isPlayingMusic ? (
                  <>
                    <Volume2 className="w-3.5 h-3.5 animate-pulse text-[#D4AF37]" />
                    <span className="hidden sm:inline text-[11px]">Music Playing</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline text-[11px]">Play Melody</span>
                  </>
                )}
              </button>

              {/* ✨ TOP HIGHLIGHT: Customize Everything Button */}
              <button
                id="open-customizer-btn"
                onClick={onOpenCustomizer}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-md transition-all duration-200 transform hover:-translate-y-0.5 active:scale-95 cursor-pointer"
                style={{
                  backgroundColor: weddingData.theme.colors.accentGold,
                  color: '#26120D',
                }}
              >
                <Sparkles className="w-3.5 h-3.5 text-[#781729] animate-spin-slow" />
                <span>Customize Everything</span>
              </button>

              {/* Mobile Menu Hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle Navigation Menu"
                className="lg:hidden p-2 rounded-lg border border-[#D4AF37]/30 text-[#781729] hover:bg-[#FAF6EE] transition-colors"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden bg-black/40 backdrop-blur-xs flex justify-end"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="w-72 max-w-full h-full bg-[#FAF6EE] shadow-2xl p-6 flex flex-col justify-between overflow-y-auto border-l border-[#D4AF37]/40"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#D4AF37]/20">
                <span
                  className="font-serif text-lg font-bold"
                  style={{ color: weddingData.theme.colors.primaryMaroon }}
                >
                  {weddingData.groom.callingName} &amp; {weddingData.bride.callingName}
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-full text-stone-600 hover:text-stone-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-6 flex flex-col gap-2">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <a
                      key={link.label}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors hover:bg-stone-200/50"
                      style={{ color: '#3A2019' }}
                    >
                      <Icon className="w-4 h-4 text-[#D4AF37]" />
                      <span>{link.label}</span>
                    </a>
                  );
                })}
              </div>
            </div>

            <div className="pt-6 border-t border-[#D4AF37]/20 flex flex-col gap-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenCustomizer();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full text-xs font-semibold shadow-md cursor-pointer"
                style={{
                  backgroundColor: weddingData.theme.colors.accentGold,
                  color: '#26120D',
                }}
              >
                <Sparkles className="w-4 h-4 text-[#781729]" />
                <span>Customize Everything</span>
              </button>
              <p className="text-center text-[11px] text-stone-500">
                {weddingData.heroHashtag}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
