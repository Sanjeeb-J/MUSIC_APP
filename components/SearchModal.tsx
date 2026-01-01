
import React, { useState, useEffect } from 'react';
import { searchSongs, getSuggestions } from '../services/geminiService';
import { Song } from '../types';

interface SearchModalProps {
  onClose: () => void;
  onAddSong: (song: Song) => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ onClose, onAddSong }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [results, setResults] = useState<Partial<Song>[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim().length > 1) {
        const suggs = await getSuggestions(query);
        setSuggestions(suggs);
      } else {
        setSuggestions([]);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [query]);

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setQuery(searchQuery);
    setSuggestions([]);
    try {
        const songs = await searchSongs(searchQuery);
        setResults(songs);
    } catch (e) {
        console.error(e);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-start md:items-center justify-center p-0 md:p-8 animate-in fade-in duration-300">
      <div className="bg-zinc-950 w-full max-w-4xl h-full md:h-auto md:max-h-[85vh] md:rounded-[2.5rem] border-0 md:border border-white/5 shadow-[0_0_100px_rgba(0,0,0,1)] overflow-hidden flex flex-col transition-all">
        
        {/* Header Search */}
        <div className="p-6 md:p-8 border-b border-white/5 flex items-center space-x-4 sticky top-0 bg-zinc-950/80 backdrop-blur-md z-10">
          <div className="bg-white/5 p-3 rounded-2xl md:hidden" onClick={onClose}>
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6"/></svg>
          </div>
          <svg className="text-zinc-500 hidden md:block" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input
            autoFocus
            type="text"
            placeholder="Search artists, tracks, mood..."
            className="bg-transparent border-none outline-none text-white w-full text-xl md:text-3xl font-black tracking-tighter placeholder:text-zinc-700"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
          />
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors p-2 hidden md:block">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar pb-24 md:pb-8">
          {/* Suggestions */}
          {!loading && suggestions.length > 0 && results.length === 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {suggestions.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSearch(s)}
                  className="w-full text-left px-6 py-4 bg-white/5 hover:bg-white/10 rounded-2xl flex items-center space-x-4 text-zinc-300 transition-all group"
                >
                  <div className="p-2 bg-black/40 rounded-lg group-hover:bg-indigo-500 transition-colors">
                    <svg className="text-zinc-500 group-hover:text-white" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                  </div>
                  <span className="font-bold tracking-tight">{s}</span>
                </button>
              ))}
            </div>
          )}

          {/* Empty State / Welcome Search */}
          {!loading && results.length === 0 && suggestions.length === 0 && !query && (
             <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
                <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-8 border border-white/5">
                   <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                </div>
                <h3 className="text-2xl font-black tracking-tight">Sonic Intelligence</h3>
                <p className="text-sm font-medium mt-2">Gemini AI will find the best high-quality matches from the web.</p>
             </div>
          )}

          {/* Results */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-32 space-y-6">
              <div className="w-16 h-16 border-[6px] border-indigo-500 border-t-transparent rounded-full animate-spin shadow-indigo-500/20 shadow-2xl"></div>
              <p className="text-zinc-500 font-black tracking-widest uppercase text-xs animate-pulse">Syncing with Intelligence</p>
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="space-y-3">
              <h5 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] mb-6 px-2">Top Matches</h5>
              {results.map((song) => (
                <div 
                  key={song.youtubeId} 
                  className="group flex items-center justify-between p-4 md:p-5 hover:bg-white/5 bg-white/[0.02] border border-white/5 rounded-[1.75rem] transition-all cursor-pointer hover:-translate-y-1"
                  onClick={() => onAddSong(song as Song)}
                >
                  <div className="flex items-center space-x-5 min-w-0">
                    <div className="relative shrink-0">
                        <img src={song.thumbnail} alt="" className="w-14 h-14 md:w-16 md:h-16 rounded-2xl object-cover shadow-2xl" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                        </div>
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-white font-bold text-base md:text-xl tracking-tight truncate group-hover:text-indigo-400 transition-colors">{song.title}</h4>
                      <p className="text-[10px] md:text-xs text-zinc-500 font-black tracking-widest uppercase mt-1 truncate">{song.artist} • {song.album || 'Single'}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                      <span className="text-[10px] font-mono text-zinc-600 hidden sm:block">{song.duration}</span>
                      <button className="bg-white text-black font-black px-6 py-3 rounded-full text-xs md:text-sm shadow-xl active:scale-90 transition-all">Add</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
