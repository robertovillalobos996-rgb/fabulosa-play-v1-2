import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { playNavSound, playEnterSound } from '@/lib/sounds';

const TVNavigationContext = createContext(null);

function throttle(fn, delay) {
  let last = 0;
  return (...args) => {
    const now = Date.now();
    if (now - last < delay) return;
    last = now;
    fn(...args);
  };
}

function getNavAction(e) {
  const { key, keyCode } = e;
  if (key === 'ArrowUp' || keyCode === 38) return 'UP';
  if (key === 'ArrowDown' || keyCode === 40) return 'DOWN';
  if (key === 'ArrowLeft' || keyCode === 37) return 'LEFT';
  if (key === 'ArrowRight' || keyCode === 39) return 'RIGHT';
  if (key === 'Enter' || keyCode === 13) return 'ENTER';
  if (key === 'Escape' || keyCode === 27 || keyCode === 10009) return 'BACK';
  return null;
}

export function TVNavigationProvider({ children }) {
  const [activeRow, setActiveRow] = useState(0);
  const [activeCol, setActiveCol] = useState(0);

  const rowLengthsRef = useRef({});
  const rowCountRef = useRef(0);
  const onEnterCallbacksRef = useRef({});
  const scrollTargetsRef = useRef({});

  const registerRow = useCallback((rowIndex, itemCount) => {
    rowLengthsRef.current[rowIndex] = itemCount;
    rowCountRef.current = Math.max(rowCountRef.current, rowIndex + 1);
  }, []);

  const registerEnterCallback = useCallback((rowIndex, colIndex, callback) => {
    const key = `${rowIndex}-${colIndex}`;
    onEnterCallbacksRef.current[key] = callback;
    return () => delete onEnterCallbacksRef.current[key];
  }, []);

  const registerScrollTarget = useCallback((rowIndex, colIndex, element) => {
    const key = `${rowIndex}-${colIndex}`;
    scrollTargetsRef.current[key] = element;
    return () => delete scrollTargetsRef.current[key];
  }, []);

  const scrollToActive = (row, col) => {
    const key = `${row}-${col}`;
    const el = scrollTargetsRef.current[key];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  };

  useEffect(() => {
    const handleNav = throttle((action) => {
      let row = activeRow;
      let col = activeCol;

      if (action === 'DOWN') {
        row = Math.min(row + 1, rowCountRef.current - 1);
      }
      if (action === 'UP') {
        row = Math.max(row - 1, 0);
      }
      if (action === 'RIGHT') {
        col = Math.min(col + 1, (rowLengthsRef.current[row] || 1) - 1);
      }
      if (action === 'LEFT') {
        col = Math.max(col - 1, 0);
      }

      if (action === 'ENTER') {
        const key = `${row}-${col}`;
        const cb = onEnterCallbacksRef.current[key];
        if (cb) cb();
        playEnterSound();
        return;
      }

      setActiveRow(row);
      setActiveCol(col);
      scrollToActive(row, col);
      playNavSound();

    }, 120);

    const handleKeyDown = (e) => {
      const action = getNavAction(e);
      if (!action) return;
      e.preventDefault();
      handleNav(action);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeRow, activeCol]);

  return (
    <TVNavigationContext.Provider value={{
      activeRow,
      activeCol,
      registerRow,
      registerEnterCallback,
      registerScrollTarget
    }}>
      {children}
    </TVNavigationContext.Provider>
  );
}

export function useTVNavigation() {
  const ctx = useContext(TVNavigationContext);
  if (!ctx) throw new Error('TVNavigationProvider missing');
  return ctx;
}