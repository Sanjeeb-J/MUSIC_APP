
import React, { useState, useEffect, useRef } from 'react';
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
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const playerRef = useRef<any>(null);
  const progressInterval = useRef<number | null>(null);

  useEffect(() => {
    if (!currentSong) return;

    const onPlayerReady = (event: any) => {
      event.target.setVolume(volume);
      if (isPlaying) event.target.playVideo();
    };

    const onPlayerStateChange = (event: any) => {
      // YT.PlayerState.ENDED is 0
      if (event.data === (window as any).YT.PlayerState.ENDED) {
        onNext();
      }
      // YT.PlayerState.PLAYING is 1
      if (event.data === (window as any).YT.PlayerState.PLAYING) {
        setIsPlaying(true);
      }
      // YT.PlayerState.PAUSED is 2
      if (event.data === (window as any).YT.PlayerState.PAUSED) {
        setIsPlaying(false);
      }
    };

    if (playerRef.current) {
      playerRef.current.loadVideoById(currentSong.youtubeId);
      if (isPlaying) playerRef.current.playVideo();
    } else {
      const initPlayer = () => {
        playerRef.current = new (window as any).YT.Player('youtube-player', {
          height: '0',
          width: '0',
          videoId: currentSong.youtubeId,
          playerVars: {
            autoplay: 1,
            controls: 0,
            disablekb: 1,
            fs: 0,
            rel: 0,
            modestbranding: 1
          },
          events: {
            onReady: onPlayerReady,
            onStateChange: onPlayerStateChange
          }
        });
      };

      if ((window as any).YT && (window as any).YT.Player) {
        initPlayer();
      } else {
        (window as any).onYouTubeIframeAPIReady = initPlayer;
      }
    }

    // Set duration from metadata or wait for player
    if (currentSong.duration) {
      const parts = currentSong.duration.split(':').map(Number);
      if (parts.length === 2) setDuration(parts[0] * 60 + parts[1]);
    }

    return () => stopProgress();
  }, [currentSong?.id]);

  useEffect(() => {
    if (playerRef.current && typeof playerRef.current.playVideo === 'function') {
      if (isPlaying) {
        playerRef.current.playVideo();
        startProgress();
      } else {
        playerRef.current.pauseVideo();
        stopProgress();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    if (playerRef.current && typeof playerRef.current.setVolume === 'function') {
      playerRef.current.setVolume(volume);
    }
  }, [volume]);

  const startProgress = () => {
    stopProgress();
    progressInterval.current = window.setInterval(() => {
      if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
        setCurrentTime(playerRef.current.getCurrentTime());
        const total = playerRef.current.getDuration();
        if (total > 0) setDuration(total);
      }
    }, 1000);
  };

  const stopProgress = () => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }
  };

  const formatTime = (s: number) => {
    const min = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  if (!currentSong) return null;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 glass safe-bottom">
      <div id="youtube-player" className="hidden"></div>
      
      {/* Progress Bar (Full Width Top) */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-white/5 cursor-pointer group" onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const percent = (e.clientX - rect.left) / rect.width;
          if (playerRef.current) playerRef.current.seekTo(percent * duration);
      }}>
        <div 
          className="h-full bg-indigo-500 shadow-[0_0_10px_#6366f1] transition-all duration-300 relative" 
          style={{ width: `${progress}%` }}
        >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full scale-0 group-hover:scale-100 transition-transform"></div>
        </div>
      </div>

      <div className="flex items-center justify-between px-4 md:px-8 h-20 md:h-24">
        {/* Info */}
        <div className="flex items-center w-1/4 min-w-0">
          <img src={currentSong.thumbnail} className={`w-12 h-12 md:w-14 md:h-14 rounded-lg object-cover shadow-lg ${isPlaying ? 'animate-pulse' : ''}`} alt="" />
          <div className="ml-3 md:ml-4 min-w-0">
            <h4 className="text-sm md:text-base font-bold text-white truncate">{currentSong.title}</h4>
            <p className="text-[10px] md:text-xs text-zinc-400 truncate uppercase tracking-widest font-semibold">{currentSong.artist}</p>
          </div>
          <a href={currentSong.youtubeUrl} target="_blank" className="ml-2 md:ml-4 text-zinc-500 hover:text-red-500 transition-colors hidden sm:block">
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>
          </a>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center flex-1">
          <div className="flex items-center space-x-4 md:space-x-8">
            <button className="text-zinc-500 hover:text-white hidden sm:block">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12a10 10 0 1 0 20 0 10 10 0 0 0-20 0Z"/><path d="M9 12h6"/><path d="M12 9v6"/></svg>
            </button>
            <button onClick={onPrevious} className="text-zinc-400 hover:text-white transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6L18 18V6z"/></svg>
            </button>
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-12 h-12 md:w-14 md:h-14 bg-white rounded-full flex items-center justify-center text-black hover:scale-110 active:scale-95 transition-all shadow-xl"
            >
              {isPlaying ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="ml-1"><path d="M8 5v14l11-7z"/></svg>
              )}
            </button>
            <button onClick={onNext} className="text-zinc-400 hover:text-white transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M6 18l8.5-6L6 6zm9-12h2v12h-2z"/></svg>
            </button>
            <button className="text-zinc-500 hover:text-white hidden sm:block">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m19 8-4 4 4 4"/><path d="m5 8 4 4-4 4"/></svg>
            </button>
          </div>
          <div className="hidden md:flex items-center space-x-2 mt-2 w-full max-w-md justify-center">
            <span className="text-[10px] font-mono text-zinc-500">{formatTime(currentTime)}</span>
            <div className="flex-1 h-1 bg-zinc-800 rounded-full"></div>
            <span className="text-[10px] font-mono text-zinc-500">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Volume / More */}
        <div className="flex items-center justify-end w-1/4 space-x-4">
          <div className="hidden lg:flex items-center space-x-2 w-28 group">
            <svg className="text-zinc-400" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 5L6 9H2V15H6L11 19V5Z"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
            <input 
              type="range" min="0" max="100" value={volume} 
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-full h-1 bg-zinc-800 rounded-full appearance-none accent-white cursor-pointer"
            />
          </div>
          <button className="text-zinc-400 hover:text-white p-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Player;
