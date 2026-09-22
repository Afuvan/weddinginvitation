import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { WeddingData } from '../types';

interface CountdownProps {
  weddingData: WeddingData;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

export const Countdown: React.FC<CountdownProps> = ({ weddingData }) => {
  const { colors } = weddingData.theme;

  const calculateTimeRemaining = (): TimeRemaining => {
    const target = new Date(weddingData.weddingDate).getTime();
    const now = new Date().getTime();
    const diff = target - now;

    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds, isPast: false };
  };

  const [time, setTime] = useState<TimeRemaining>(calculateTimeRemaining());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(calculateTimeRemaining());
    }, 1000);
    return () => clearInterval(timer);
  }, [weddingData.weddingDate]);

  const units = [
    { label: 'Days', value: time.days },
    { label: 'Hours', value: time.hours },
    { label: 'Minutes', value: time.minutes },
    { label: 'Seconds', value: time.seconds },
  ];

  return (
    <section className="py-12 px-4 max-w-4xl mx-auto">
      <div
        className="rounded-3xl p-6 sm:p-10 border shadow-sm text-center relative overflow-hidden"
        style={{
          backgroundColor: `${colors.softCream}90`,
          borderColor: `${colors.accentGold}50`,
        }}
      >
        <div className="flex items-center justify-center gap-2 mb-2 text-stone-500">
          <Clock className="w-4 h-4 text-[#D4AF37]" />
          <span className="text-xs uppercase tracking-widest font-semibold" style={{ color: colors.primaryMaroon }}>
            {time.isPast ? 'Celebrating Matrimony' : 'Counting Down To Forever'}
          </span>
        </div>

        <h3 className="text-2xl sm:text-3xl font-serif font-medium text-stone-900 mb-6">
          {time.isPast ? 'The Blessed Day Has Arrived!' : 'Every Second Brings Us Closer'}
        </h3>

        {/* Counter Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 max-w-2xl mx-auto">
          {units.map((unit) => (
            <div
              key={unit.label}
              className="bg-white/80 rounded-2xl p-4 sm:p-5 border shadow-xs flex flex-col items-center justify-center transition-transform hover:-translate-y-0.5"
              style={{ borderColor: `${colors.accentGold}40` }}
            >
              <span
                className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold tracking-tight"
                style={{ color: colors.primaryMaroon }}
              >
                {String(unit.value).padStart(2, '0')}
              </span>
              <span className="text-[11px] sm:text-xs uppercase tracking-wider text-stone-500 font-medium mt-1">
                {unit.label}
              </span>
            </div>
          ))}
        </div>

        <p className="text-xs sm:text-sm text-stone-600 mt-6 font-light">
          Inshallah, we eagerly await your esteemed arrival at <strong className="font-semibold text-stone-800">{weddingData.venueName}</strong>
        </p>
      </div>
    </section>
  );
};
