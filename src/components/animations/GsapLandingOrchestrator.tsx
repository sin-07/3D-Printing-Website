'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

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
      // 1. Initial Hero Animations (Above the fold, fires immediately on page mount)
      const heroLeftElements = container.querySelectorAll<HTMLElement>('.gsap-hero-left');
      if (heroLeftElements.length > 0) {
        gsap.fromTo(
          heroLeftElements,
          { x: -70, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 1.1,
            stagger: 0.12,
            ease: 'power3.out',
            delay: 0.15,
            clearProps: 'transform,opacity',
          }
        );
      }

      const heroRightElements = container.querySelectorAll<HTMLElement>('.gsap-hero-right');
      if (heroRightElements.length > 0) {
        gsap.fromTo(
          heroRightElements,
          { x: 70, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 1.1,
            stagger: 0.12,
            ease: 'power3.out',
            delay: 0.25,
            clearProps: 'transform,opacity',
          }
        );
      }

      // 2. Elements appearing from LEFT on scroll
      const leftElements = container.querySelectorAll<HTMLElement>('.gsap-appear-left');
      leftElements.forEach((el) => {
        gsap.fromTo(
          el,
          { x: -75, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 1.0,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 86%',
              toggleActions: 'play none none none',
            },
          }
        );
      });

      // 3. Elements appearing from RIGHT on scroll
      const rightElements = container.querySelectorAll<HTMLElement>('.gsap-appear-right');
      rightElements.forEach((el) => {
        gsap.fromTo(
          el,
          { x: 75, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 1.0,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 86%',
              toggleActions: 'play none none none',
            },
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
            { x: -80, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              duration: 1.1,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: row,
                start: 'top 84%',
                toggleActions: 'play none none none',
              },
            }
          );
        }

        if (rightCol) {
          gsap.fromTo(
            rightCol,
            { x: 80, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              duration: 1.1,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: row,
                start: 'top 84%',
                toggleActions: 'play none none none',
              },
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
            { x: isLeft ? -65 : 65, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              duration: 0.95,
              delay: (index % 3) * 0.1,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: card,
                start: 'top 88%',
                toggleActions: 'play none none none',
              },
            }
          );
        });
      });

      // 6. Refresh ScrollTrigger after assets settle
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
