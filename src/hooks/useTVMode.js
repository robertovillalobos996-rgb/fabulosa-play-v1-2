import { useEffect } from 'react';
import { useIsMobile } from './useIsMobile';

export function useTVMode() {
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile) return;

    let timer;

    const hideCursor = () => {
      document.body.style.cursor = 'none';
    };

    const showCursor = () => {
      document.body.style.cursor = '';
      clearTimeout(timer);
      timer = setTimeout(hideCursor, 2000);
    };

    timer = setTimeout(hideCursor, 2000);

    window.addEventListener('mousemove', showCursor);
    window.addEventListener('mousedown', showCursor);

    return () => {
      clearTimeout(timer);
      document.body.style.cursor = '';
      window.removeEventListener('mousemove', showCursor);
      window.removeEventListener('mousedown', showCursor);
    };
  }, [isMobile]);
}