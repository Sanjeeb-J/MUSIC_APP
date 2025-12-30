
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
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const handleSearch = async (searchQuery: string) => {
    setLoading(true);
    setQuery(searchQuery);
    setSuggestions([]);
    const songs = await searchSongs(searchQuery);
    setResults(songs);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-zinc-900 w-full max-w-2xl rounded-2xl border border-zinc-800 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        <div className="p-4 border-b border-zinc-800 flex items-center space-x-3">
          <svg className="text-zinc-500" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input
            autoFocus
            type="text"
            placeholder="Search for songs, artists, or albums..."
            className="bg-transparent border-none outline-none text-white w-full text-lg"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
          />
          <button onClick={onClose} className="text-zinc-500 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {/* Suggestions */}
          {!loading && suggestions.length > 0 && results.length === 0 && (
            <div className="py-2">
              {suggestions.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSearch(s)}
                  className="w-full text-left px-4 py-3 hover:bg-zinc-800 rounded-lg flex items-center space-x-3 text-zinc-300"
                >
                  <svg className="text-zinc-500" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 6L12 12L15 15"/><circle cx="12" cy="12" r="10"/></svg>
                  <span>{s}</span>
                </button>
              ))}
            </div>
          )}

          {/* Results */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-zinc-400">Searching the web for the best matches...</p>
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="space-y-1">
              {results.map((song) => (
                <div 
                  key={song.youtubeId} 
                  className="group flex items-center justify-between p-3 hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer"
                  onClick={() => onAddSong(song as Song)}
                >
                  <div className="flex items-center space-x-4">
                    <img src={song.thumbnail} alt="" className="w-12 h-12 rounded-lg object-cover" />
                    <div>
                      <h4 className="text-white font-medium">{song.title}</h4>
                      <p className="text-xs text-zinc-500">{song.artist} • {song.album}</p>
                    </div>
                  </div>
                  <button className="text-zinc-400 group-hover:text-indigo-400 flex items-center space-x-2 text-sm">
                    <span>Add</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                  </button>
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
