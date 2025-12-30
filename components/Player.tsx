
import React, { useState, useEffect } from 'react';
import { Song } from '../types';

interface PlayerProps {
  currentSong: Song | null;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const Player: React.FC<PlayerProps> = ({ currentSong, isPlaying, setIsPlaying, onNext, onPrevious }) => {
  const [volume, setVolume] = useState(70);

  if (!currentSong) return null;

  // IMPORTANT: The key only depends on youtubeId so the iframe doesn't reload when pausing/playing.
  // We use autoplay=1 because this component usually mounts/updates when a user intentionally clicks "Play".
  const playerUrl = `https://www.youtube.com/embed/${currentSong.youtubeId}?autoplay=1&enablejsapi=1&controls=0&origin=${window.location.origin}`;

  return (
    <div className="h-24 glass flex items-center justify-between px-6 sticky bottom-0 z-50 border-t border-white/5 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
      {/* Hidden YouTube Iframe for Audio */}
      <div className="hidden pointer-events-none overflow-hidden w-0 h-0">
        {isPlaying && (
          <iframe
            key={currentSong.youtubeId}
            width="0"
            height="0"
            src={playerUrl}
            title="YouTube Music Player"
            allow="autoplay"
          ></iframe>
        )}
      </div>

      {/* Song Info */}
      <div className="flex items-center w-1/3 min-w-0">
        <div className="relative group">
          <img 
            src={currentSong.thumbnail} 
            alt={currentSong.title} 
            className={`w-14 h-14 rounded-md shadow-lg object-cover transition-transform duration-500 ${isPlaying ? 'scale-105 border-2 border-indigo-500/50' : ''}`}
          />
          {isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-md">
               <div className="flex items-end space-x-0.5 h-3">
                  <div className="w-0.5 bg-white animate-[bounce_0.6s_infinite_0.1s]"></div>
                  <div className="w-0.5 bg-white animate-[bounce_0.6s_infinite_0.2s]"></div>
                  <div className="w-0.5 bg-white animate-[bounce_0.6s_infinite_0.3s]"></div>
               </div>
            </div>
          )}
        </div>
        <div className="ml-4 truncate">
          <h4 className="font-semibold text-white truncate text-sm">{currentSong.title}</h4>
          <p className="text-xs text-zinc-400 truncate">{currentSong.artist}</p>
        </div>
        <a 
          href={currentSong.youtubeUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="ml-4 p-2 text-zinc-500 hover:text-indigo-400 transition-colors shrink-0"
          title="Watch on YouTube"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>
        </a>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center w-1/3 space-y-2">
        <div className="flex items-center space-x-6">
          <button className="text-zinc-500 hover:text-white transition-colors">
             <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m16 3 4 4-4 4"/><path d="M12 7H4a2 2 0 0 0-2 2v1"/><path d="m8 21-4-4 4-4"/><path d="M12 17h8a2 2 0 0 0 2-2v-1"/></svg>
          </button>
          <button onClick={onPrevious} className="text-zinc-400 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6L18 18V6z"/></svg>
          </button>
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-black hover:scale-110 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]"
          >
            {isPlaying ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="ml-1"><path d="M8 5v14l11-7z"/></svg>
            )}
          </button>
          <button onClick={onNext} className="text-zinc-400 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M6 18l8.5-6L6 6zm9-12h2v12h-2z"/></svg>
          </button>
          <button className="text-zinc-500 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2"/><path d="M21 12H11"/></svg>
          </button>
        </div>
        <div className="w-full flex items-center space-x-3 max-w-sm">
           <span className="text-[10px] text-zinc-500 font-mono">Live</span>
           <div className="flex-1 h-1.5 bg-zinc-800 rounded-full relative group cursor-pointer overflow-hidden">
              <div className={`absolute top-0 left-0 h-full w-full bg-indigo-500 transition-opacity duration-300 ${isPlaying ? 'opacity-40 animate-pulse' : 'opacity-10'}`}></div>
           </div>
           <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-tighter">{currentSong.duration || '0:00'}</span>
        </div>
      </div>

      {/* Volume / Additional */}
      <div className="flex items-center justify-end w-1/3 space-x-4">
        <button className="text-zinc-500 hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 6L12 12L15 15"/></svg>
        </button>
        <div className="flex items-center space-x-2 w-28 group">
          <svg className="text-zinc-400 group-hover:text-white transition-colors" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5L6 9H2V15H6L11 19V5Z"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={volume} 
            onChange={(e) => setVolume(parseInt(e.target.value))}
            className="w-full h-1 bg-zinc-800 rounded-full appearance-none accent-white cursor-pointer hover:accent-indigo-400 transition-all"
          />
        </div>
      </div>
      <style>{`
        @keyframes bounce {
          0%, 100% { height: 4px; }
          50% { height: 12px; }
        }
      `}</style>
    </div>
  );
};

export default Player;
