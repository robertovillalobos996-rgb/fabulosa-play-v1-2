import { useEffect } from 'react';
import { useIsMobile } from './useIsMobile';

export function useTVMode() {
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile) {
      document.body.style.cursor = 'default';
      return;
    }

    let timer;

    const hide = () => {
      document.body.style.cursor = 'none';
    };

    const show = () => {
      document.body.style.cursor = 'default';
      clearTimeout(timer);
      timer = setTimeout(hide, 2000);
    };

    hide();

    window.addEventListener('mousemove', show);
    window.addEventListener('mousedown', show);

    return () => {
      clearTimeout(timer);
      document.body.style.cursor = 'default';
      window.removeEventListener('mousemove', show);
      window.removeEventListener('mousedown', show);
    };
  }, [isMobile]);

  return {
    isTV: !isMobile,
    isMobile
  };
}