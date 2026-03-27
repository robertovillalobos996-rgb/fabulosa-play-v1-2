import React from 'react';
import { Link } from 'react-router-dom';
import { Power, Home, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeX } from 'lucide-react';

const ControlRemoto = () => {
  const btnStyle = "flex flex-col items-center justify-center bg-white/10 border border-white/5 rounded-2xl p-4 active:scale-90 transition-all";

  return (
    <div className="min-h-screen bg-black text-white flex flex-col p-6 touch-none select-none">
      <header className="flex justify-between items-center mb-8">
        <Link to="/" className="p-3 bg-white/5 rounded-full"><Home /></Link>
        <span className="font-black uppercase tracking-widest text-red-500">Control Fabulosa</span>
        <button className="p-3 bg-red-600 rounded-full"><Power /></button>
      </header>

      <div className="flex-1 max-w-sm mx-auto w-full grid grid-cols-3 gap-4 items-center">
        <div /> <button className={btnStyle}><ChevronUp /></button> <div />
        <button className={btnStyle}><ChevronLeft /></button> 
        <div className="h-24 w-24 bg-red-600 rounded-full flex items-center justify-center font-black text-xl border-4 border-black/20 shadow-lg">OK</div>
        <button className={btnStyle}><ChevronRight /></button>
        <div /> <button className={btnStyle}><ChevronDown /></button> <div />
      </div>

      <div className="grid grid-cols-2 gap-4 mt-8 max-w-sm mx-auto w-full">
        <div className="grid grid-cols-2 bg-white/5 rounded-3xl p-2"><button className="p-4"><Play /></button><button className="p-4"><Pause /></button></div>
        <div className="grid grid-cols-2 bg-white/5 rounded-3xl p-2"><button className="p-4"><VolumeX /></button><button className="p-4"><Volume2 /></button></div>
      </div>
    </div>
  );
};

export default ControlRemoto;