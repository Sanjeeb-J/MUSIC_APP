
import React, { useState } from 'react';
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

  // Use a key on the iframe to force it to reload when the song changes
  // Autoplay requires the iframe to be reloaded with the new source
  const playerUrl = `https://www.youtube.com/embed/${currentSong.youtubeId}?autoplay=${isPlaying ? 1 : 0}&enablejsapi=1&origin=${window.location.origin}`;

  return (
    <div className="h-24 glass flex items-center justify-between px-6 sticky bottom-0 z-50">
      {/* Hidden YouTube Iframe for Audio - Use key to force reload */}
      <div className="hidden pointer-events-none">
        <iframe
          key={currentSong.youtubeId + isPlaying}
          width="0"
          height="0"
          src={playerUrl}
          title="YouTube Music Player"
          allow="autoplay"
        ></iframe>
      </div>

      {/* Song Info */}
      <div className="flex items-center w-1/3">
        <img 
          src={currentSong.thumbnail} 
          alt={currentSong.title} 
          className="w-14 h-14 rounded-md shadow-lg object-cover"
        />
        <div className="ml-4 truncate">
          <h4 className="font-semibold text-white truncate">{currentSong.title}</h4>
          <p className="text-xs text-zinc-400 truncate">{currentSong.artist}</p>
        </div>
        <a 
          href={currentSong.youtubeUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="ml-6 text-zinc-400 hover:text-indigo-400 transition-colors"
          title="Open in YouTube"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>
        </a>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center w-1/3 space-y-2">
        <div className="flex items-center space-x-6">
          <button className="text-zinc-400 hover:text-white">
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m16 3 4 4-4 4"/><path d="M12 7H4a2 2 0 0 0-2 2v1"/><path d="m8 21-4-4 4-4"/><path d="M12 17h8a2 2 0 0 0 2-2v-1"/></svg>
          </button>
          <button onClick={onPrevious} className="text-zinc-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6L18 18V6z"/></svg>
          </button>
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-black hover:scale-105 transition-transform shadow-xl"
          >
            {isPlaying ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="ml-1"><path d="M8 5v14l11-7z"/></svg>
            )}
          </button>
          <button onClick={onNext} className="text-zinc-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M6 18l8.5-6L6 6zm9-12h2v12h-2z"/></svg>
          </button>
          <button className="text-zinc-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2"/><path d="M21 12H11"/></svg>
          </button>
        </div>
        <div className="w-full flex items-center space-x-3 max-w-md">
           <span className="text-[10px] text-zinc-500">Live</span>
           <div className="flex-1 h-1 bg-zinc-800 rounded-full relative group cursor-pointer overflow-hidden">
              <div className={`absolute top-0 left-0 h-full w-full bg-indigo-500/30 ${isPlaying ? 'animate-pulse' : ''}`}></div>
           </div>
           <span className="text-[10px] text-zinc-500">{currentSong.duration || 'Stream'}</span>
        </div>
      </div>

      {/* Volume / Additional */}
      <div className="flex items-center justify-end w-1/3 space-x-4">
        <button className="text-zinc-400 hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 6L12 12L15 15"/></svg>
        </button>
        <div className="flex items-center space-x-2 w-32">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5L6 9H2V15H6L11 19V5Z"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={volume} 
            onChange={(e) => setVolume(parseInt(e.target.value))}
            className="w-full h-1 bg-zinc-800 rounded-full appearance-none accent-indigo-500 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

export default Player;
