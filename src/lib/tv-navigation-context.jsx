import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';

// ✅ RUTA CORREGIDA (SIN @)
import { playNavSound, playEnterSound } from './sounds';

const TVNavigationContext = createContext(null);

// Throttle helper
function throttle(fn, delay) {
  let last = 0;
  return (...args) => {
    const now = Date.now();
    if (now - last < delay) return;
    last = now;
    fn(...args);
  };
}

// Detecta teclas (control remoto + teclado)
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

// LocalStorage keys
const LS_ROW = 'tv_nav_row';
const LS_COL = 'tv_nav_col';

export function TVNavigationProvider({ children }) {
  const [activeRow, setActiveRow] = useState(() => {
    try { return parseInt(localStorage.getItem(LS_ROW) || '0', 10); } catch { return 0; }
  });

  const [activeCol, setActiveCol] = useState(() => {
    try { return parseInt(localStorage.getItem(LS_COL) || '0', 10); } catch { return 0; }
  });

  const rowLengthsRef = useRef({});
  const rowCountRef = useRef(0);
  const onEnterCallbacksRef = useRef({});
  const scrollTargetsRef = useRef({});
  const activeRowRef = useRef(activeRow);
  const activeColRef = useRef(activeCol);

  useEffect(() => {
    activeRowRef.current = activeRow;
    activeColRef.current = activeCol;
    try {
      localStorage.setItem(LS_ROW, String(activeRow));
      localStorage.setItem(LS_COL, String(activeCol));
    } catch {}
  }, [activeRow, activeCol]);

  const registerRow = useCallback((rowIndex, itemCount) => {
    rowLengthsRef.current[rowIndex] = itemCount;
    rowCountRef.current = Math.max(rowCountRef.current, rowIndex + 1);
  }, []);

  const registerEnterCallback = useCallback((rowIndex, colIndex, callback) => {
    const key = `${rowIndex}-${colIndex}`;
    onEnterCallbacksRef.current[key] = callback;
    return () => { delete onEnterCallbacksRef.current[key]; };
  }, []);

  const registerScrollTarget = useCallback((rowIndex, colIndex, element) => {
    const key = `${rowIndex}-${colIndex}`;
    scrollTargetsRef.current[key] = element;
    return () => { delete scrollTargetsRef.current[key]; };
  }, []);

  const scrollToActive = useCallback((row, col) => {
    const key = `${row}-${col}`;
    const el = scrollTargetsRef.current[key];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
    const rowEl = el?.closest('[data-tv-row]');
    if (rowEl) {
      rowEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  useEffect(() => {
    const handleNav = throttle((action) => {
      const row = activeRowRef.current;
      const col = activeColRef.current;

      if (action === 'DOWN') {
        const nextRow = Math.min(row + 1, rowCountRef.current - 1);
        if (nextRow === row) return;
        const maxCol = (rowLengthsRef.current[nextRow] || 1) - 1;
        const nextCol = Math.min(col, maxCol);
        setActiveRow(nextRow);
        setActiveCol(nextCol);
        setTimeout(() => scrollToActive(nextRow, nextCol), 50);
        playNavSound();
      }

      else if (action === 'UP') {
        const nextRow = Math.max(row - 1, 0);
        if (nextRow === row) return;
        const maxCol = (rowLengthsRef.current[nextRow] || 1) - 1;
        const nextCol = Math.min(col, maxCol);
        setActiveRow(nextRow);
        setActiveCol(nextCol);
        setTimeout(() => scrollToActive(nextRow, nextCol), 50);
        playNavSound();
      }

      else if (action === 'RIGHT') {
        const maxCol = (rowLengthsRef.current[row] || 1) - 1;
        const nextCol = Math.min(col + 1, maxCol);
        if (nextCol === col) return;
        setActiveCol(nextCol);
        setTimeout(() => scrollToActive(row, nextCol), 50);
        playNavSound();
      }

      else if (action === 'LEFT') {
        const nextCol = Math.max(col - 1, 0);
        if (nextCol === col) return;
        setActiveCol(nextCol);
        setTimeout(() => scrollToActive(row, nextCol), 50);
        playNavSound();
      }

      else if (action === 'ENTER') {
        const key = `${row}-${col}`;
        const cb = onEnterCallbacksRef.current[key];
        if (cb) cb();
        playEnterSound();
      }

    }, 150);

    const handleKeyDown = (e) => {
      const action = getNavAction(e);
      if (!action) return;
      e.preventDefault();
      handleNav(action);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [scrollToActive]);

  return (
    <TVNavigationContext.Provider value={{
      activeRow,
      activeCol,
      setActiveRow,
      setActiveCol,
      registerRow,
      registerEnterCallback,
      registerScrollTarget,
    }}>
      {children}
    </TVNavigationContext.Provider>
  );
}

export function useTVNavigation() {
  const ctx = useContext(TVNavigationContext);
  if (!ctx) throw new Error('useTVNavigation must be used within TVNavigationProvider');
  return ctx;
}