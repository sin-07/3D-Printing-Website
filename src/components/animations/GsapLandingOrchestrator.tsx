'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * High-precision Cubic-Bezier easing generator:
 * P1 = (0.25, 0.05) -> Gentle, continuous, smooth initiation (no abrupt jump)
 * P2 = (0.05, 1.00) -> Ultra-smooth, prolonged, feather-soft decelerating landing
 */
function createCubicBezierEase(p1x: number, p1y: number, p2x: number, p2y: number) {
  const cx = 3 * p1x;
  const bx = 3 * (p2x - p1x) - cx;
  const ax = 1 - cx - bx;

  const cy = 3 * p1y;
  const by = 3 * (p2y - p1y) - cy;
  const ay = 1 - cy - by;

  function sampleCurveX(t: number) {
    return ((ax * t + bx) * t + cx) * t;
  }

  function sampleCurveY(t: number) {
    return ((ay * t + by) * t + cy) * t;
  }

  function sampleCurveDerivativeX(t: number) {
    return (3 * ax * t + 2 * bx) * t + cx;
  }

  return function (x: number): number {
    if (x <= 0) return 0;
    if (x >= 1) return 1;

    // Newton-Raphson fast approximation
    let t2 = x;
    for (let i = 0; i < 8; i++) {
      const x2 = sampleCurveX(t2) - x;
      if (Math.abs(x2) < 1e-5) return sampleCurveY(t2);
      const d2 = sampleCurveDerivativeX(t2);
      if (Math.abs(d2) < 1e-6) break;
      t2 = t2 - x2 / d2;
    }

    // Bisection fallback
    let t0 = 0;
    let t1 = 1;
    t2 = x;
    while (t0 < t1) {
      const x2 = sampleCurveX(t2);
      if (Math.abs(x2 - x) < 1e-5) return sampleCurveY(t2);
      if (x > x2) t0 = t2;
      else t1 = t2;
      t2 = (t1 - t0) * 0.5 + t0;
    }

    return sampleCurveY(t2);
  };
}

// Ultra-smooth landing ease: smooth initial ramp + prolonged feather-light landing
const ultraSmoothLanding = createCubicBezierEase(0.25, 0.05, 0.05, 1.0);

interface GsapLandingOrchestratorProps {
  children: React.ReactNode;
}

export default function GsapLandingOrchestrator({ children }: GsapLandingOrchestratorProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Respect user's reduced-motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Screen-size responsive motion parameters (eliminates mobile edge clipping & finish stutter)
      const isMobile = window.innerWidth < 768;
      const heroOffset = isMobile ? 26 : 50;
      const appearOffset = isMobile ? 24 : 50;
      const splitOffset = isMobile ? 28 : 55;
      const cardOffset = isMobile ? 18 : 42;
      const triggerStart = isMobile ? 'top 93%' : 'top 88%';
      const animDuration = isMobile ? 1.35 : 1.45;

      // 1. Initial Hero Animations (Above the fold, fires immediately on page mount)
      const heroLeftElements = container.querySelectorAll<HTMLElement>('.gsap-hero-left');
      if (heroLeftElements.length > 0) {
        gsap.fromTo(
          heroLeftElements,
          { x: -heroOffset, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: animDuration,
            stagger: 0.1,
            ease: ultraSmoothLanding,
            delay: 0.12,
            force3D: true,
            clearProps: 'transform,opacity,willChange',
          }
        );
      }

      const heroRightElements = container.querySelectorAll<HTMLElement>('.gsap-hero-right');
      if (heroRightElements.length > 0) {
        gsap.fromTo(
          heroRightElements,
          { x: heroOffset, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: animDuration,
            stagger: 0.1,
            ease: ultraSmoothLanding,
            delay: 0.2,
            force3D: true,
            clearProps: 'transform,opacity,willChange',
          }
        );
      }

      // 2. Elements appearing from LEFT on scroll
      const leftElements = container.querySelectorAll<HTMLElement>('.gsap-appear-left');
      leftElements.forEach((el) => {
        gsap.fromTo(
          el,
          { x: -appearOffset, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: animDuration,
            ease: ultraSmoothLanding,
            force3D: true,
            scrollTrigger: {
              trigger: el,
              start: triggerStart,
              toggleActions: 'play none none none',
            },
            clearProps: 'transform,opacity,willChange',
          }
        );
      });

      // 3. Elements appearing from RIGHT on scroll
      const rightElements = container.querySelectorAll<HTMLElement>('.gsap-appear-right');
      rightElements.forEach((el) => {
        gsap.fromTo(
          el,
          { x: appearOffset, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: animDuration,
            ease: ultraSmoothLanding,
            force3D: true,
            scrollTrigger: {
              trigger: el,
              start: triggerStart,
              toggleActions: 'play none none none',
            },
            clearProps: 'transform,opacity,willChange',
          }
        );
      });

      // 4. Split Two-Column Rows (Col 1 from Left, Col 2 from Right)
      const splitRows = container.querySelectorAll<HTMLElement>('.gsap-split-row');
      splitRows.forEach((row) => {
        const leftCol = row.querySelector<HTMLElement>('.gsap-col-left');
        const rightCol = row.querySelector<HTMLElement>('.gsap-col-right');

        if (leftCol) {
          gsap.fromTo(
            leftCol,
            { x: -splitOffset, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              duration: animDuration + 0.05,
              ease: ultraSmoothLanding,
              force3D: true,
              scrollTrigger: {
                trigger: row,
                start: isMobile ? 'top 92%' : 'top 86%',
                toggleActions: 'play none none none',
              },
              clearProps: 'transform,opacity,willChange',
            }
          );
        }

        if (rightCol) {
          gsap.fromTo(
            rightCol,
            { x: splitOffset, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              duration: animDuration + 0.05,
              ease: ultraSmoothLanding,
              force3D: true,
              scrollTrigger: {
                trigger: row,
                start: isMobile ? 'top 92%' : 'top 86%',
                toggleActions: 'play none none none',
              },
              clearProps: 'transform,opacity,willChange',
            }
          );
        }
      });

      // 5. Alternating Grid Cards (Even indices from LEFT, Odd indices from RIGHT)
      const altGrids = container.querySelectorAll<HTMLElement>('.gsap-alternate-grid');
      altGrids.forEach((grid) => {
        const cards = Array.from(grid.children) as HTMLElement[];
        cards.forEach((card, index) => {
          const isLeft = index % 2 === 0;
          gsap.fromTo(
            card,
            { x: isLeft ? -cardOffset : cardOffset, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              duration: animDuration,
              delay: (index % 3) * 0.07,
              ease: ultraSmoothLanding,
              force3D: true,
              scrollTrigger: {
                trigger: card,
                start: triggerStart,
                toggleActions: 'play none none none',
              },
              clearProps: 'transform,opacity,willChange',
            }
          );
        });
      });

      // 6. Refresh ScrollTrigger after DOM/images settle
      const refreshTimeout = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 500);

      return () => clearTimeout(refreshTimeout);
    }, container);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden">
      {children}
    </div>
  );
}
