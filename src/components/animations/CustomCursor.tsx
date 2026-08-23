'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only enable on non-touch devices and respect prefers-reduced-motion
    if (typeof window === 'undefined') return;
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouch || prefersReducedMotion) return;

    setIsVisible(true);

    const dot = cursorDotRef.current;
    const ring = cursorRingRef.current;
    if (!dot || !ring) return;

    const onMouseMove = (e: MouseEvent) => {
      const { clientX: x, clientY: y } = e;

      gsap.to(dot, {
        x,
        y,
        duration: 0.08,
        ease: 'power2.out',
      });

      gsap.to(ring, {
        x,
        y,
        duration: 0.28,
        ease: 'power2.out',
      });
    };

    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest('button') ||
        target.closest('a') ||
        target.closest('[data-magnetic]') ||
        target.closest('input') ||
        target.closest('select') ||
        target.closest('.interactive-cursor')
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseover', onMouseOver);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseover', onMouseOver);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* Inner Dot */}
      <div
        ref={cursorDotRef}
        className="fixed top-0 left-0 w-2 h-2 -ml-1 -mt-1 bg-gold-400 rounded-full pointer-events-none z-[9999] mix-blend-screen transition-transform duration-100 ease-out"
        style={{
          transform: `scale(${isClicking ? 0.6 : isHovered ? 1.5 : 1})`,
        }}
      />

      {/* Outer Luxury Ring */}
      <div
        ref={cursorRingRef}
        className={`fixed top-0 left-0 rounded-full pointer-events-none z-[9998] transition-all duration-300 ease-out -ml-5 -mt-5 ${
          isHovered
            ? 'w-12 h-12 -ml-6 -mt-6 border-2 border-gold-400 bg-gold-500/10 shadow-gold-glow scale-125'
            : isClicking
            ? 'w-8 h-8 -ml-4 -mt-4 border border-gold-400/80 bg-gold-500/20 scale-90'
            : 'w-10 h-10 border border-gold-400/40'
        }`}
      />
    </>
  );
}
