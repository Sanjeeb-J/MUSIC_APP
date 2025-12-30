
import React from 'react';
import { View } from '../types';

interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
  playlists: any[];
  onPlaylistSelect: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, playlists, onPlaylistSelect }) => {
  return (
    <div className="w-64 bg-black h-full flex flex-col p-6 space-y-8 border-r border-zinc-900">
      <div className="flex items-center space-x-2 text-indigo-500 font-bold text-2xl px-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
        <span>Melodix</span>
      </div>

      <nav className="space-y-4">
        <button 
          onClick={() => setCurrentView('home')}
          className={`flex items-center space-x-4 w-full px-3 py-2 rounded-lg transition-colors ${currentView === 'home' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          <span className="font-medium">Home</span>
        </button>
        <button 
          onClick={() => setCurrentView('library')}
          className={`flex items-center space-x-4 w-full px-3 py-2 rounded-lg transition-colors ${currentView === 'library' || currentView === 'playlist' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M3 12h18"/><path d="M3 18h18"/></svg>
          <span className="font-medium">Your Library</span>
        </button>
      </nav>

      <div className="flex-1 overflow-y-auto space-y-4">
        <div className="flex items-center justify-between px-3">
          <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Playlists</span>
          <button className="text-zinc-500 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
          </button>
        </div>
        <div className="space-y-1">
          {playlists.map(p => (
            <button
              key={p.id}
              onClick={() => onPlaylistSelect(p.id)}
              className="w-full text-left px-3 py-2 text-zinc-400 hover:text-white transition-colors truncate text-sm"
            >
              {p.name}
            </button>
          ))}
          {playlists.length === 0 && (
            <p className="px-3 text-xs text-zinc-600 italic">No playlists yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
