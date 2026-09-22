import React, { useRef, useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Calendar, RotateCcw, CheckCircle2, Download, ExternalLink } from 'lucide-react';
import { WeddingData } from '../types';
import { weddingAudio } from '../utils/audio';
import { createGoogleCalendarUrl, downloadIcsFile } from '../utils/calendar';

interface ScratchCardProps {
  weddingData: WeddingData;
}

export const ScratchCard: React.FC<ScratchCardProps> = ({ weddingData }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [scratchPercent, setScratchPercent] = useState(0);
  const [isScratching, setIsScratching] = useState(false);
  const [canvasReady, setCanvasReady] = useState(false);

  const colors = weddingData.theme.colors;

  // Initialize Canvas
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 360;
    const height = 220;

    canvas.width = width;
    canvas.height = height;

    // Draw shimmering gold metallic surface
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#D4AF37');
    gradient.addColorStop(0.2, '#F3E5AB');
    gradient.addColorStop(0.4, '#C59B27');
    gradient.addColorStop(0.6, '#AA771C');
    gradient.addColorStop(0.8, '#FFDF73');
    gradient.addColorStop(1, '#B8860B');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Decorative geometric arch border
    ctx.strokeStyle = '#FFFFFF88';
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, width - 20, height - 20);

    // Subtle star sparkles pattern
    ctx.fillStyle = '#FFFFFF40';
    for (let i = 0; i < 40; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = Math.random() * 2 + 1;
      ctx.fillRect(x, y, size, size);
    }

    // Text instructions on scratch card
    ctx.fillStyle = '#4A2A0C';
    ctx.font = 'bold 15px "Cinzel", "Cormorant Garamond", serif';
    ctx.textAlign = 'center';
    ctx.fillText('✨ SCRATCH HERE ✨', width / 2, height / 2 - 20);

    ctx.font = '500 13px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#3E1F0B';
    ctx.fillText('To Reveal Auspicious Wedding Date', width / 2, height / 2 + 5);

    ctx.font = 'italic 11px serif';
    ctx.fillStyle = '#5A3311';
    ctx.fillText('Use your finger or mouse to scratch', width / 2, height / 2 + 30);

    setIsRevealed(false);
    setScratchPercent(0);
    setCanvasReady(true);
  }, []);

  useEffect(() => {
    initCanvas();
  }, [initCanvas]);

  const triggerConfetti = () => {
    try {
      weddingAudio.playFanfare();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#781729', '#FAF6EE', '#E5C058'],
      });
    } catch {
      // Ignore
    }
  };

  const checkScratchPercentage = () => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imgData.data;
      let transparentPixels = 0;
      const totalPixels = pixels.length / 4;

      for (let i = 3; i < pixels.length; i += 16) {
        if (pixels[i] === 0) {
          transparentPixels += 4;
        }
      }

      const percent = Math.min(100, Math.round((transparentPixels / totalPixels) * 100));
      setScratchPercent(percent);

      if (percent > 40 && !isRevealed) {
        setIsRevealed(true);
        triggerConfetti();
      }
    } catch {
      // Ignore security errors
    }
  };

  const scratch = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 24, 0, Math.PI * 2, false);
    ctx.fill();

    weddingAudio.playScratchSound();
    checkScratchPercentage();
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    setIsScratching(true);
    scratch(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isScratching) return;
    scratch(e.clientX, e.clientY);
  };

  const handlePointerUp = () => {
    setIsScratching(false);
  };

  const handleRevealDirectly = () => {
    setIsRevealed(true);
    setScratchPercent(100);
    triggerConfetti();
  };

  const handleReset = () => {
    initCanvas();
  };

  return (
    <section id="reveal-date" className="py-16 md:py-20 px-4 relative">
      <div className="max-w-3xl mx-auto text-center">
        {/* Section Heading */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-[#D4AF37]" />
          <span className="text-xs uppercase tracking-widest font-semibold" style={{ color: colors.primaryMaroon }}>
            Interactive Experience
          </span>
          <Sparkles className="w-4 h-4 text-[#D4AF37]" />
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-medium mb-3 text-stone-900">
          Scratch to Reveal Wedding Date
        </h2>
        <p className="text-sm sm:text-base text-stone-600 max-w-lg mx-auto mb-8 font-light">
          An auspicious surprise awaits your touch. Gently scratch the royal golden foil to unveil the blessed date of Nikah!
        </p>

        {/* Scratch Card Container */}
        <div
          ref={containerRef}
          className="relative mx-auto w-[360px] max-w-full h-[220px] rounded-2xl shadow-xl overflow-hidden border-2 p-1 transition-all"
          style={{
            borderColor: colors.accentGold,
            backgroundColor: colors.softCream,
          }}
        >
          {/* UNDERNEATH LAYER: The Revealed Auspicious Date */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center select-none"
            style={{
              backgroundColor: colors.primaryMaroon,
              color: '#FAF6EE',
            }}
          >
            <div className="flex items-center gap-1.5 mb-1 text-[#D4AF37]">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="text-[11px] uppercase tracking-widest font-bold">Auspicious Matrimony</span>
              <Sparkles className="w-3.5 h-3.5" />
            </div>

            <p className="text-xs uppercase tracking-wider text-amber-200/90 font-medium">
              Save The Blessed Date
            </p>

            <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#FDFBF7] mt-1 mb-0.5 leading-snug">
              {weddingData.weddingDateFormatted}
            </h3>

            <p className="text-xs text-amber-100 font-light">
              {weddingData.weddingTime}
            </p>

            <div className="mt-2 pt-2 border-t border-amber-200/30 w-full flex items-center justify-center gap-2 text-[11px] text-amber-200">
              <span>{weddingData.venueName}</span>
              <span>•</span>
              <span>{weddingData.venueCity}</span>
            </div>

            <div className="mt-2 flex items-center gap-1 text-[10px] text-amber-300/80 bg-black/20 px-2 py-0.5 rounded-full">
              <CheckCircle2 className="w-3 h-3 text-[#D4AF37]" />
              <span>Auspicious Nikah Time Revealed</span>
            </div>
          </div>

          {/* TOP LAYER: Canvas Scratch Foil */}
          <canvas
            ref={canvasRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            className={`absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing touch-none transition-opacity duration-700 ${
              isRevealed ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
          />
        </div>

        {/* Scratch Controls & Progress */}
        <div className="mt-4 flex flex-col items-center gap-3">
          {!isRevealed ? (
            <div className="flex items-center gap-4">
              <span className="text-xs text-stone-500 font-medium">
                Scratched: <strong className="text-stone-800">{scratchPercent}%</strong>
              </span>
              <button
                onClick={handleRevealDirectly}
                className="text-xs font-semibold px-3 py-1.5 rounded-full border border-stone-300 hover:bg-stone-100 text-stone-700 transition-colors cursor-pointer"
              >
                Instant Reveal
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap items-center justify-center gap-3 animate-fade-in">
              {/* Google Calendar Link */}
              <a
                href={createGoogleCalendarUrl(weddingData)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold text-white shadow-xs transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                style={{ backgroundColor: colors.primaryMaroon }}
              >
                <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Add to Google Calendar</span>
                <ExternalLink className="w-3 h-3 opacity-70" />
              </a>

              {/* Download .ICS Apple / Outlook */}
              <button
                onClick={() => downloadIcsFile(weddingData)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold border border-stone-300 bg-white hover:bg-stone-50 text-stone-800 shadow-xs transition-transform hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-amber-600" />
                <span>Apple / iCal File</span>
              </button>

              {/* Scratch Again */}
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-full text-xs font-medium text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Scratch Again</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
