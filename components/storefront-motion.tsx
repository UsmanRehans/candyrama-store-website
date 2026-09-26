'use client';

import { useLayoutEffect } from 'react';
import { candyMotion } from '@/lib/motion-tokens';

export function StorefrontMotion() {
  useLayoutEffect(() => {
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    const revealNodes = Array.from(
      document.querySelectorAll<HTMLElement>('[data-reveal]'),
    );

    if (reduceMotion || !('IntersectionObserver' in window)) {
      revealNodes.forEach((node) => (node.dataset.revealed = 'true'));
      return;
    }

    const animations: Animation[] = [];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const node = entry.target as HTMLElement;
          const index = Number(node.dataset.revealIndex ?? 0);
          node.dataset.revealed = 'true';
          animations.push(
            node.animate(
              [
                {
                  opacity: 0.85,
                  transform: 'translateY(8px)',
                },
                { opacity: 1, transform: 'translateY(0)' },
              ],
              {
                duration: candyMotion.revealDuration,
                delay:
                  (index % (window.innerWidth < 640 ? 2 : 3)) *
                  candyMotion.revealStagger,
                easing: candyMotion.spring,
                fill: 'backwards',
              },
            ),
          );
          observer.unobserve(node);
        });
      },
      {
        threshold: candyMotion.revealThreshold,
        rootMargin: candyMotion.revealRootMargin,
      },
    );

    revealNodes.forEach((node) => {
      if (node.getBoundingClientRect().top < window.innerHeight) {
        node.dataset.revealed = 'true';
      } else {
        observer.observe(node);
      }
    });

    const hero = document.querySelector<HTMLElement>('.discovery-hero');
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    let frame = 0;
    const resetHero = () => {
      hero?.style.setProperty('--hero-x', '0px');
      hero?.style.setProperty('--hero-y', '0px');
    };
    const moveHero = (event: PointerEvent) => {
      if (!hero || !finePointer.matches) return;
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const bounds = hero.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - 0.5;
        const y = (event.clientY - bounds.top) / bounds.height - 0.5;
        hero.style.setProperty('--hero-x', `${(x * 5).toFixed(2)}px`);
        hero.style.setProperty('--hero-y', `${(y * 3).toFixed(2)}px`);
      });
    };
    hero?.addEventListener('pointermove', moveHero, { passive: true });
    hero?.addEventListener('pointerleave', resetHero);

    return () => {
      observer.disconnect();
      animations.forEach((animation) => animation.cancel());
      window.cancelAnimationFrame(frame);
      hero?.removeEventListener('pointermove', moveHero);
      hero?.removeEventListener('pointerleave', resetHero);
    };
  }, []);

  return null;
}
