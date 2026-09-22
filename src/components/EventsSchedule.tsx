import React from 'react';
import { Calendar, Clock, MapPin, Sparkles, Shirt, Plus, Edit3 } from 'lucide-react';
import { WeddingData, WeddingEvent } from '../types';
import { createGoogleCalendarUrl } from '../utils/calendar';

interface EventsScheduleProps {
  weddingData: WeddingData;
  onOpenCustomizer: (initialTab?: string) => void;
}

export const EventsSchedule: React.FC<EventsScheduleProps> = ({ weddingData, onOpenCustomizer }) => {
  const { events, theme } = weddingData;
  const { colors } = theme;

  return (
    <section id="events" className="py-20 px-4 relative">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-xs uppercase tracking-widest font-semibold" style={{ color: colors.primaryMaroon }}>
              Rituals &amp; Itinerary
            </span>
            <Calendar className="w-4 h-4 text-[#D4AF37]" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-medium text-stone-900 mb-3">
            Wedding Events &amp; Celebrations
          </h2>
          <p className="text-sm sm:text-base text-stone-600 font-light">
            Each ceremony is infused with cultural grace, spiritual blessings, and joyous togetherness.
          </p>
          <div className="mt-3 flex items-center justify-center gap-4">
            <button
              onClick={() => onOpenCustomizer('events')}
              className="text-xs inline-flex items-center gap-1.5 text-stone-500 hover:text-amber-800 font-medium transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Customize or add wedding events</span>
            </button>
          </div>
        </div>

        {/* Events Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {events.map((event: WeddingEvent, idx: number) => {
            const isMainEvent = event.badge?.toLowerCase().includes('main') || event.title.toLowerCase().includes('nikah');

            return (
              <div
                key={event.id || idx}
                className={`rounded-3xl border p-6 sm:p-8 flex flex-col justify-between shadow-xs transition-all duration-300 hover:shadow-md relative overflow-hidden bg-white ${
                  isMainEvent ? 'ring-2 ring-[#D4AF37]/60' : ''
                }`}
                style={{ borderColor: isMainEvent ? colors.accentGold : `${colors.accentGold}40` }}
              >
                {/* Event Badge */}
                <div className="flex items-center justify-between mb-4">
                  {event.badge && (
                    <span
                      className="px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider text-white shadow-xs"
                      style={{ backgroundColor: isMainEvent ? colors.primaryMaroon : '#4A3528' }}
                    >
                      {event.badge}
                    </span>
                  )}
                  <span className="text-xs font-serif italic text-amber-700 font-medium ml-auto">
                    Event 0{idx + 1}
                  </span>
                </div>

                {/* Event Title & Subtitle */}
                <div>
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mb-1">
                    {event.title}
                  </h3>
                  <p className="text-xs sm:text-sm font-serif italic text-[#B8860B] mb-4">
                    {event.subtitle}
                  </p>

                  <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed mb-6">
                    {event.description}
                  </p>

                  {/* Details List */}
                  <div className="space-y-3 pt-4 border-t border-stone-100 text-xs sm:text-sm">
                    {/* Date */}
                    <div className="flex items-center gap-3 text-stone-700">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${colors.primaryMaroon}12`, color: colors.primaryMaroon }}
                      >
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-stone-400 block font-semibold">Date</span>
                        <span className="font-medium text-stone-900">{event.date}</span>
                      </div>
                    </div>

                    {/* Time */}
                    <div className="flex items-center gap-3 text-stone-700">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${colors.primaryMaroon}12`, color: colors.primaryMaroon }}
                      >
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-stone-400 block font-semibold">Time</span>
                        <span className="font-medium text-stone-900">{event.time}</span>
                      </div>
                    </div>

                    {/* Venue */}
                    <div className="flex items-center gap-3 text-stone-700">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${colors.primaryMaroon}12`, color: colors.primaryMaroon }}
                      >
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-stone-400 block font-semibold">Venue</span>
                        <span className="font-medium text-stone-900">{event.venueName}</span>
                        <span className="text-stone-500 block text-xs">{event.venueAddress}</span>
                      </div>
                    </div>

                    {/* Dress Code */}
                    {event.dressCode && (
                      <div className="flex items-center gap-3 text-stone-700">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                          style={{ backgroundColor: `${colors.primaryMaroon}12`, color: colors.primaryMaroon }}
                        >
                          <Shirt className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-stone-400 block font-semibold">Attire / Dress Code</span>
                          <span className="font-medium text-stone-800">{event.dressCode}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Event Actions */}
                <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between gap-2">
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(`${event.venueName} ${event.venueAddress}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold hover:underline"
                    style={{ color: colors.primaryMaroon }}
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Venue Directions</span>
                  </a>

                  <a
                    href={createGoogleCalendarUrl(weddingData)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-stone-500 hover:text-stone-800"
                  >
                    <Calendar className="w-3 h-3 text-[#D4AF37]" />
                    <span>Add to Cal</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Customization encouragement banner */}
        <div className="mt-12 text-center">
          <button
            onClick={() => onOpenCustomizer('events')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-stone-300 bg-white hover:bg-stone-50 text-xs font-semibold text-stone-700 shadow-xs transition-transform hover:scale-105 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-amber-600" />
            <span>Add Another Custom Ceremony or Reception</span>
          </button>
        </div>
      </div>
    </section>
  );
};
