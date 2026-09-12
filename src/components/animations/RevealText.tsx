'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface RevealTextProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  as?: keyof JSX.IntrinsicElements | React.ComponentType<any>;
}

export default function RevealText({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  as: Component = 'div',
}: RevealTextProps) {
  const elRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    let x = 0;
    let y = 0;
    if (direction === 'up') y = 40;
    if (direction === 'down') y = -40;
    if (direction === 'left') x = -70;
    if (direction === 'right') x = 70;

    const anim = gsap.fromTo(
      el,
      {
        opacity: 0,
        x,
        y,
      },
      {
        opacity: 1,
        x: 0,
        y: 0,
        duration: 1.1,
        delay,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
      }
    );

    return () => {
      anim.kill();
    };
  }, [delay, direction]);

  const Comp = Component as any;

  return (
    <Comp ref={elRef} className={`will-change-transform ${className}`}>
      {children}
    </Comp>
  );
}
