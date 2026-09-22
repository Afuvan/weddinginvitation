import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Mail, CheckCircle, Heart, Users, Sparkles, AlertCircle } from 'lucide-react';
import { WeddingData, RsvpResponse } from '../types';
import { weddingAudio } from '../utils/audio';

interface RsvpSectionProps {
  weddingData: WeddingData;
  onRsvpSubmitted?: (newRsvp: RsvpResponse) => void;
}

export const RsvpSection: React.FC<RsvpSectionProps> = ({ weddingData, onRsvpSubmitted }) => {
  const { theme, events, rsvpDeadline } = weddingData;
  const { colors } = theme;

  const [fullName, setFullName] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [attendingStatus, setAttendingStatus] = useState<'attending' | 'declined'>('attending');
  const [guestsCount, setGuestsCount] = useState<number>(2);
  const [selectedEvents, setSelectedEvents] = useState<string[]>(events.map((e) => e.title));
  const [dietaryOrNotes, setDietaryOrNotes] = useState('');
  const [duaOrMessage, setDuaOrMessage] = useState('');

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleToggleEvent = (eventTitle: string) => {
    if (selectedEvents.includes(eventTitle)) {
      setSelectedEvents(selectedEvents.filter((t) => t !== eventTitle));
    } else {
      setSelectedEvents([...selectedEvents, eventTitle]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    if (!emailOrPhone.trim()) {
      setErrorMsg('Please provide a phone number or email address.');
      return;
    }

    const newResponse: RsvpResponse = {
      id: `rsvp-${Date.now()}`,
      name: fullName.trim(),
      emailOrPhone: emailOrPhone.trim(),
      attendingStatus,
      guestsCount: attendingStatus === 'attending' ? guestsCount : 0,
      attendingEvents: attendingStatus === 'attending' ? selectedEvents : [],
      dietaryOrNotes: dietaryOrNotes.trim(),
      duaOrMessage: duaOrMessage.trim(),
      submittedAt: new Date().toISOString(),
    };

    // Save locally
    try {
      const existing = localStorage.getItem('wedding_rsvps');
      const parsed: RsvpResponse[] = existing ? JSON.parse(existing) : [];
      parsed.push(newResponse);
      localStorage.setItem('wedding_rsvps', JSON.stringify(parsed));
    } catch {
      // Ignore storage errors
    }

    if (onRsvpSubmitted) {
      onRsvpSubmitted(newResponse);
    }

    // Trigger celebration
    if (attendingStatus === 'attending') {
      try {
        weddingAudio.playFanfare();
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#D4AF37', '#781729', '#FAF6EE', '#E5C058'],
        });
      } catch {
        // Ignore
      }
    }

    setIsSubmitted(true);
  };

  const handleResetForm = () => {
    setIsSubmitted(false);
    setFullName('');
    setEmailOrPhone('');
    setDuaOrMessage('');
    setDietaryOrNotes('');
  };

  return (
    <section id="rsvp" className="py-20 px-4 relative">
      <div className="max-w-3xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-12">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Mail className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-xs uppercase tracking-widest font-semibold" style={{ color: colors.primaryMaroon }}>
              Répondez S&apos;il Vous Plaît
            </span>
            <Mail className="w-4 h-4 text-[#D4AF37]" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-medium text-stone-900 mb-3">
            Grace Us With Your Presence
          </h2>
          <p className="text-sm sm:text-base text-stone-600 font-light">
            Kindly confirm your attendance by <strong className="font-semibold text-stone-800">{rsvpDeadline}</strong> to assist us in organizing royal arrangements for your comfort.
          </p>
        </div>

        {/* RSVP Card Container */}
        <div
          className="bg-white rounded-3xl p-6 sm:p-10 border shadow-md relative overflow-hidden"
          style={{ borderColor: `${colors.accentGold}50` }}
        >
          {isSubmitted ? (
            /* Submission Success State */
            <div className="text-center py-8 px-4 space-y-4 animate-fade-in">
              <div
                className="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-2"
                style={{ backgroundColor: `${colors.primaryMaroon}15`, color: colors.primaryMaroon }}
              >
                <CheckCircle className="w-8 h-8 text-[#D4AF37]" />
              </div>

              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
                {attendingStatus === 'attending' ? 'JazakAllah Khair for Your RSVP!' : 'Thank You for Your Blessings'}
              </h3>

              <div
                className="p-5 rounded-2xl max-w-md mx-auto border text-xs sm:text-sm text-stone-700 leading-relaxed italic"
                style={{
                  backgroundColor: `${colors.softCream}80`,
                  borderColor: `${colors.accentGold}40`,
                }}
              >
                <p className="font-serif text-base mb-1" style={{ color: colors.primaryMaroon }}>
                  بَارَكَ اللَّهُ لَكَ وَبَارَكَ عَلَيْكَ وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ
                </p>
                <p className="font-light text-stone-600">
                  &ldquo;May Allah bless you and shower His blessings upon you and unite you in goodness.&rdquo;
                </p>
              </div>

              <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto">
                We have recorded your RSVP for <strong>{fullName}</strong> ({attendingStatus === 'attending' ? `${guestsCount} guests attending` : 'Unable to attend'}). We are truly grateful for your prayers!
              </p>

              <button
                onClick={handleResetForm}
                className="mt-4 px-6 py-2 rounded-full text-xs font-semibold text-stone-700 border border-stone-300 hover:bg-stone-50 cursor-pointer"
              >
                Submit another response
              </button>
            </div>
          ) : (
            /* RSVP Form Input */
            <form onSubmit={handleSubmit} className="space-y-6">
              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Attendance Status Choice */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-stone-500 mb-2">
                  Will you be able to attend? *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setAttendingStatus('attending')}
                    className={`py-3 px-4 rounded-2xl border text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      attendingStatus === 'attending'
                        ? 'text-white shadow-xs'
                        : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                    }`}
                    style={{
                      backgroundColor: attendingStatus === 'attending' ? colors.primaryMaroon : undefined,
                      borderColor: attendingStatus === 'attending' ? colors.primaryMaroon : undefined,
                    }}
                  >
                    <Heart className="w-4 h-4 fill-current text-[#D4AF37]" />
                    <span>Joyfully Accepts With Pleasure</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAttendingStatus('declined')}
                    className={`py-3 px-4 rounded-2xl border text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      attendingStatus === 'declined'
                        ? 'text-white shadow-xs'
                        : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                    }`}
                    style={{
                      backgroundColor: attendingStatus === 'declined' ? '#5A524F' : undefined,
                      borderColor: attendingStatus === 'declined' ? '#5A524F' : undefined,
                    }}
                  >
                    <span>Regretfully Declines With Duas</span>
                  </button>
                </div>
              </div>

              {/* Guest Name & Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="rsvp-fullname" className="block text-xs uppercase tracking-wider font-semibold text-stone-600 mb-1.5">
                    Your Full Name *
                  </label>
                  <input
                    id="rsvp-fullname"
                    type="text"
                    required
                    placeholder="e.g. Dr. Salman Qureshi & Family"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-800 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-[#781729]"
                  />
                </div>

                <div>
                  <label htmlFor="rsvp-contact" className="block text-xs uppercase tracking-wider font-semibold text-stone-600 mb-1.5">
                    Email / WhatsApp Phone *
                  </label>
                  <input
                    id="rsvp-contact"
                    type="text"
                    required
                    placeholder="e.g. salman@example.com or +91 98..."
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-800 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-[#781729]"
                  />
                </div>
              </div>

              {/* If Attending: Number of Guests & Events Checkbox */}
              {attendingStatus === 'attending' && (
                <>
                  <div>
                    <label htmlFor="rsvp-guests-count" className="block text-xs uppercase tracking-wider font-semibold text-stone-600 mb-1.5">
                      Total Number of Guests Attending (Including You)
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        id="rsvp-guests-count"
                        type="range"
                        min="1"
                        max="10"
                        value={guestsCount}
                        onChange={(e) => setGuestsCount(parseInt(e.target.value, 10))}
                        className="w-full accent-[#781729] cursor-pointer"
                      />
                      <div className="w-12 h-10 rounded-xl bg-stone-100 flex items-center justify-center font-serif font-bold text-base text-stone-800 shrink-0">
                        {guestsCount}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-stone-600 mb-2">
                      Which events will you be gracing?
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {events.map((ev) => {
                        const checked = selectedEvents.includes(ev.title);
                        return (
                          <label
                            key={ev.id}
                            className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-colors text-xs ${
                              checked
                                ? 'bg-amber-50/60 border-amber-300 text-stone-900 font-medium'
                                : 'bg-stone-50 border-stone-200 text-stone-600'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => handleToggleEvent(ev.title)}
                              className="mt-0.5 accent-[#781729]"
                            />
                            <div>
                              <span className="font-semibold block">{ev.title}</span>
                              <span className="text-[11px] text-stone-500">{ev.date}</span>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="rsvp-dietary" className="block text-xs uppercase tracking-wider font-semibold text-stone-600 mb-1.5">
                      Dietary Preferences / Special Assistance
                    </label>
                    <input
                      id="rsvp-dietary"
                      type="text"
                      placeholder="e.g. Vegetarian, Jain food, Wheelchair access needed, etc."
                      value={dietaryOrNotes}
                      onChange={(e) => setDietaryOrNotes(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-800 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-[#781729]"
                    />
                  </div>
                </>
              )}

              {/* Heartfelt Dua & Message */}
              <div>
                <label htmlFor="rsvp-dua" className="block text-xs uppercase tracking-wider font-semibold text-stone-600 mb-1.5">
                  Blessings &amp; Dua for the Couple
                </label>
                <textarea
                  id="rsvp-dua"
                  rows={3}
                  placeholder="Share a heartfelt prayer, congratulatory wish or loving note..."
                  value={duaOrMessage}
                  onChange={(e) => setDuaOrMessage(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-800 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-[#781729] resize-none"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-full text-xs sm:text-sm font-semibold text-white shadow-md transition-all duration-200 transform hover:-translate-y-0.5 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                  style={{
                    backgroundColor: colors.primaryMaroon,
                    border: `1px solid ${colors.accentGold}`,
                  }}
                >
                  <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                  <span>Confirm RSVP Response</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
