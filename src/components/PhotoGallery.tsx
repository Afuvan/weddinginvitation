import React, { useState } from 'react';
import { Camera, ChevronLeft, ChevronRight, X, Sparkles, Edit3 } from 'lucide-react';
import { WeddingData, GalleryPhoto } from '../types';

interface PhotoGalleryProps {
  weddingData: WeddingData;
  onOpenCustomizer: (initialTab?: string) => void;
}

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({ weddingData, onOpenCustomizer }) => {
  const { gallery, theme } = weddingData;
  const { colors } = theme;

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const categories = ['All', 'Couple', 'Traditions', 'Decor'];

  const filteredPhotos = activeCategory === 'All'
    ? gallery
    : gallery.filter((p) => p.category?.toLowerCase() === activeCategory.toLowerCase());

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % filteredPhotos.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex - 1 + filteredPhotos.length) % filteredPhotos.length);
  };

  return (
    <section id="gallery" className="py-20 px-4 relative">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Camera className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-xs uppercase tracking-widest font-semibold" style={{ color: colors.primaryMaroon }}>
              Cherished Moments
            </span>
            <Camera className="w-4 h-4 text-[#D4AF37]" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-medium text-stone-900 mb-3">
            Glimpses of Togetherness
          </h2>
          <p className="text-sm sm:text-base text-stone-600 font-light">
            A celebration of love, heritage, laughter, and timeless memories captured in frames.
          </p>
          <button
            onClick={() => onOpenCustomizer('gallery')}
            className="mt-3 text-xs inline-flex items-center gap-1.5 text-stone-500 hover:text-amber-800 font-medium transition-colors cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Customize or upload your own photos</span>
          </button>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center justify-center gap-2 mb-10 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                activeCategory === cat
                  ? 'text-white shadow-xs'
                  : 'bg-white/70 text-stone-600 border border-stone-200 hover:bg-stone-100'
              }`}
              style={{
                backgroundColor: activeCategory === cat ? colors.primaryMaroon : undefined,
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPhotos.map((photo: GalleryPhoto, idx: number) => (
            <div
              key={photo.id || idx}
              onClick={() => setLightboxIndex(idx)}
              className="group relative rounded-2xl overflow-hidden aspect-4/3 bg-stone-100 border cursor-pointer shadow-xs transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              style={{ borderColor: `${colors.accentGold}30` }}
            >
              <img
                src={photo.url}
                alt={photo.caption}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Overlay with Caption */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 text-white">
                <span className="text-[10px] uppercase tracking-wider text-[#D4AF37] font-semibold">
                  {photo.category || 'Wedding Memory'}
                </span>
                <p className="text-sm font-serif font-medium mt-0.5 leading-snug">
                  {photo.caption}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && filteredPhotos[lightboxIndex] && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setLightboxIndex(null)}
        >
          {/* Close button */}
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/20 text-white hover:bg-white/40 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Prev button */}
          <button
            onClick={handlePrev}
            className="absolute left-4 p-2 rounded-full bg-white/20 text-white hover:bg-white/40 transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Image & Caption */}
          <div
            className="max-w-4xl max-h-[85vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={filteredPhotos[lightboxIndex].url}
              alt={filteredPhotos[lightboxIndex].caption}
              referrerPolicy="no-referrer"
              className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl"
            />
            <p className="text-white text-sm font-serif mt-3 text-center px-4">
              {filteredPhotos[lightboxIndex].caption}
            </p>
          </div>

          {/* Next button */}
          <button
            onClick={handleNext}
            className="absolute right-4 p-2 rounded-full bg-white/20 text-white hover:bg-white/40 transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}
    </section>
  );
};
