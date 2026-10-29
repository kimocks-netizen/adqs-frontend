import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen } from 'lucide-react';
import { ROUTES } from '@/routes/routes';

import clip1 from '@/assets/videos/video1.mp4';
import clip2 from '@/assets/videos/video2.mp4';
import clip3 from '@/assets/videos/video3.mp4';

const CLIPS: string[] = [clip1, clip2, clip3];

const INTERVAL_MS = 5000; // how long each clip shows before switching

const CREDIBILITY = [
  '6 Service Areas',
  'Research-Informed',
  'South Africa',
  'Practical Solutions',
];

// ─── Video background ─────────────────────────────────────────────────────────

function VideoBackground({ clips }: { clips: string[] }) {
  const [current, setCurrent] = useState(0);
  const [next, setNext] = useState<number | null>(null);
  const nextRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (clips.length < 2) return;
    const id = setInterval(() => {
      setNext((prev) => {
        const n = prev !== null ? prev : (current + 1) % clips.length;
        return n;
      });
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, [clips.length, current]);

  // When next video is ready, promote it to current
  function handleNextReady() {
    if (next === null) return;
    setCurrent(next);
    setNext(null);
  }

  if (clips.length === 0) {
    // Fallback gradient while no videos are loaded
    return (
      <div className="absolute inset-0 bg-brand-gradient" />
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Current clip */}
      <AnimatePresence>
        <motion.video
          key={current}
          src={clips[current]}
          autoPlay
          muted
          playsInline
          loop={clips.length === 1}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </AnimatePresence>

      {/* Preload next clip silently */}
      {next !== null && (
        <video
          ref={nextRef}
          src={clips[next]}
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 h-full w-full object-cover opacity-0"
          onCanPlayThrough={handleNextReady}
        />
      )}
    </div>
  );
}

// ─── Clip indicator dots ──────────────────────────────────────────────────────

function ClipDots({ total, current }: { total: number; current: number }) {
  if (total < 2) return null;
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={`block rounded-full transition-all duration-500 ${
            i === current
              ? 'h-2 w-6 bg-secondary'
              : 'h-2 w-2 bg-white/40'
          }`}
        />
      ))}
    </div>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

export default function Hero() {
  const [current, setCurrent] = useState(0);

  // Keep dots in sync with the video switcher
  useEffect(() => {
    if (CLIPS.length < 2) return;
    const id = setInterval(() => {
      setCurrent((c) => (c + 1) % CLIPS.length);
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative min-h-[50vh] overflow-hidden">
      {/* Video / fallback background */}
      <VideoBackground clips={CLIPS} />

      {/* Dark overlay — keeps text readable over any video */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />

      {/* Subtle gold bottom edge */}
      <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gold-gradient" />

      {/* Content */}
      <div className="relative mx-auto flex min-h-[50vh] max-w-7xl flex-col justify-center px-6 pb-12 pt-16">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/80 backdrop-blur"
        >
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-secondary" />
          Adequate Strategies Legal Consulting
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 max-w-3xl text-4xl font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl"
        >
          Practical Legal Solutions.{' '}
          <span className="text-secondary">Informed Decisions.</span>{' '}
          Stronger Institutions.
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 max-w-xl text-lg leading-relaxed text-white/75"
        >
          We help businesses, institutions and individuals navigate complex legal
          landscapes with clarity, research and practical strategy — across South Africa.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-8 flex flex-wrap items-center gap-3"
        >
          <Link
            to={ROUTES.SERVICES}
            className="inline-flex items-center gap-2 rounded-full bg-secondary px-7 py-3.5 text-sm font-semibold text-secondary-foreground shadow-gold transition hover:opacity-90 hover:scale-[1.02]"
          >
            Explore Our Services
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to={ROUTES.INSIGHTS}
            className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
          >
            <BookOpen className="h-4 w-4" />
            Read Our Insights
          </Link>
        </motion.div>

        {/* Bottom row — credibility + dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 flex flex-wrap items-center justify-between gap-4"
        >
          {/* Credibility strip */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {CREDIBILITY.map((item, i) => (
              <span key={item} className="flex items-center gap-2 text-sm text-white/60">
                {i > 0 && <span className="h-1 w-1 rounded-full bg-secondary/60" />}
                {item}
              </span>
            ))}
          </div>

          {/* Video progress dots */}
          <ClipDots total={CLIPS.length} current={current} />
        </motion.div>
      </div>
    </section>
  );
}
