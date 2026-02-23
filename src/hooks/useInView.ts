import { useState, useRef } from "react";

export const useInView = () => {
  const [isInView, setIsInView] = useState(false);
  const cleanupRef = useRef<(() => void) | null>(null);
  const triggeredRef = useRef(false);

  const ref = (element: HTMLDivElement | null) => {
    if (!element) {
      cleanupRef.current?.();
      cleanupRef.current = null;
      return;
    }

    if (triggeredRef.current) return;

    const scrollContainer = element.closest('.results');
    if (!scrollContainer) return;

    const check = () => {
      if (triggeredRef.current) return;

      const containerRect = scrollContainer.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();

      if (elementRect.height === 0) return;

      const visibleTop = Math.max(elementRect.top, containerRect.top);
      const visibleBottom = Math.min(elementRect.bottom, containerRect.bottom);
      const visibleHeight = visibleBottom - visibleTop;
      const ratio = visibleHeight / elementRect.height;

      if (ratio > 0.5) {
        triggeredRef.current = true;
        setIsInView(true);
        cleanupRef.current?.();
        cleanupRef.current = null;
      }
    };

    scrollContainer.addEventListener('scroll', check, { passive: true });
    cleanupRef.current = () => scrollContainer.removeEventListener('scroll', check);

    requestAnimationFrame(check);
  };

  return { ref, isInView };
};