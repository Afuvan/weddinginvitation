import React from 'react';
import { MapPin, Navigation, Compass, Car, Phone, Mail, Edit3, ExternalLink } from 'lucide-react';
import { WeddingData } from '../types';

interface VenueLocationProps {
  weddingData: WeddingData;
  onOpenCustomizer: (initialTab?: string) => void;
}

export const VenueLocation: React.FC<VenueLocationProps> = ({ weddingData, onOpenCustomizer }) => {
  const { venueName, venueAddress, venueCity, googleMapsUrl, theme, contactPhones, contactEmail } = weddingData;
  const { colors } = theme;

  return (
    <section id="venue" className="py-20 px-4 bg-stone-50/50">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-2 mb-2">
            <MapPin className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-xs uppercase tracking-widest font-semibold" style={{ color: colors.primaryMaroon }}>
              Venue &amp; Logistics
            </span>
            <MapPin className="w-4 h-4 text-[#D4AF37]" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-medium text-stone-900 mb-3">
            Getting to The Celebration
          </h2>
          <p className="text-sm sm:text-base text-stone-600 font-light">
            We look forward to welcoming you to our grand celebration venue.
          </p>
          <button
            onClick={() => onOpenCustomizer('venue')}
            className="mt-3 text-xs inline-flex items-center gap-1.5 text-stone-500 hover:text-amber-800 font-medium transition-colors cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Customize venue address &amp; map link</span>
          </button>
        </div>

        {/* Venue Information Card */}
        <div
          className="bg-white rounded-3xl border shadow-sm overflow-hidden p-6 sm:p-10"
          style={{ borderColor: `${colors.accentGold}40` }}
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Left Col: Details & Directions */}
            <div className="md:col-span-7 space-y-6">
              <div>
                <span className="text-[11px] uppercase tracking-wider font-semibold text-[#B8860B]">
                  Grand Wedding Destination
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mt-1">
                  {venueName}
                </h3>
                <p className="text-sm sm:text-base text-stone-600 font-light mt-2 flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-[#781729] shrink-0 mt-1" />
                  <span>{venueAddress}, {venueCity}</span>
                </p>
              </div>

              {/* Venue Amenities & Guidance */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-stone-100 text-xs text-stone-600">
                <div className="flex items-center gap-2.5">
                  <Car className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span>Complimentary Valet Parking available</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Compass className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span>Dedicated Prayer &amp; Wudu Area</span>
                </div>
              </div>

              {/* Contact Inquiry numbers */}
              <div className="pt-4 border-t border-stone-100 space-y-2 text-xs text-stone-500">
                <p className="font-semibold text-stone-700">Need help with navigation on the day?</p>
                {contactPhones.map((phone, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>{phone}</span>
                  </div>
                ))}
                {contactEmail && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>{contactEmail}</span>
                  </div>
                )}
              </div>

              {/* Primary Google Maps CTA Button */}
              <div className="pt-4 flex flex-wrap items-center gap-3">
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-semibold text-white shadow-md transition-all duration-200 transform hover:-translate-y-0.5 active:scale-95 cursor-pointer"
                  style={{ backgroundColor: colors.primaryMaroon }}
                >
                  <Navigation className="w-4 h-4 text-[#D4AF37]" />
                  <span>Open in Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                </a>

                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${venueName} ${venueAddress}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-xs font-semibold border border-stone-300 hover:bg-stone-50 text-stone-800 transition-colors"
                >
                  <span>Get Driving Directions</span>
                </a>
              </div>
            </div>

            {/* Right Col: Visual Map / Venue Card Mockup */}
            <div className="md:col-span-5">
              <div
                className="rounded-2xl p-4 sm:p-6 border text-center flex flex-col items-center justify-center relative overflow-hidden"
                style={{
                  backgroundColor: `${colors.softCream}70`,
                  borderColor: `${colors.accentGold}40`,
                }}
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-4 shadow-sm"
                  style={{ backgroundColor: colors.primaryMaroon, color: '#FAF6EE' }}
                >
                  <Navigation className="w-8 h-8 text-[#D4AF37] animate-pulse" />
                </div>
                <h4 className="font-serif font-bold text-stone-900 text-lg">
                  {venueCity}
                </h4>
                <p className="text-xs text-stone-500 max-w-xs mt-1 font-light">
                  Click below to view live traffic, route estimations, and real-time navigation.
                </p>
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold underline transition-colors"
                  style={{ color: colors.primaryMaroon }}
                >
                  <span>Verify Destination Pin</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
