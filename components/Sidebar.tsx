
import React from 'react';
import { View } from '../types';

interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
  playlists: any[];
  onPlaylistSelect: (id: string) => void;
  onPlaylistDelete: (id: string) => void;
  onPlaylistCreate: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, playlists, onPlaylistSelect, onPlaylistDelete, onPlaylistCreate }) => {
  return (
    <div className="w-64 bg-black h-full flex flex-col p-6 space-y-8 border-r border-zinc-900 shadow-2xl relative z-20">
      <div className="flex items-center space-x-2 text-indigo-500 font-bold text-2xl px-2">
        <div className="bg-indigo-600/10 p-1.5 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
        </div>
        <span className="tracking-tight">Melodix</span>
      </div>

      <nav className="space-y-1">
        <button 
          onClick={() => setCurrentView('home')}
          className={`flex items-center space-x-4 w-full px-4 py-3 rounded-xl transition-all ${currentView === 'home' ? 'bg-white/10 text-white shadow-lg' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          <span className="font-semibold text-sm">Home</span>
        </button>
        <button 
          onClick={() => setCurrentView('library')}
          className={`flex items-center space-x-4 w-full px-4 py-3 rounded-xl transition-all ${currentView === 'library' || currentView === 'playlist' ? 'bg-white/10 text-white shadow-lg' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M3 12h18"/><path d="M3 18h18"/></svg>
          <span className="font-semibold text-sm">Your Library</span>
        </button>
      </nav>

      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between px-4 mb-4">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Playlists</span>
          <button onClick={onPlaylistCreate} className="text-zinc-500 hover:text-white transition-colors p-1 bg-zinc-900 rounded-md">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto pr-2 space-y-0.5 custom-scrollbar">
          {playlists.map(p => (
            <div key={p.id} className="group flex items-center">
              <button
                onClick={() => onPlaylistSelect(p.id)}
                className="flex-1 text-left px-4 py-2.5 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-all truncate text-sm font-medium"
              >
                {p.name}
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); onPlaylistDelete(p.id); }}
                className="opacity-0 group-hover:opacity-100 p-2 text-zinc-600 hover:text-red-500 transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
              </button>
            </div>
          ))}
          {playlists.length === 0 && (
            <div className="px-4 py-8 text-center bg-zinc-900/30 rounded-2xl border border-dashed border-zinc-800">
               <p className="text-[10px] text-zinc-600 italic">No playlists found. Create one to start curating.</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="pt-6 border-t border-zinc-900">
        <div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 p-4 rounded-2xl border border-white/5">
          <h5 className="text-xs font-bold mb-1">Melodix Premium</h5>
          <p className="text-[10px] text-zinc-500 mb-3">Get unlimited storage and cross-device sync.</p>
          <button className="w-full py-2 bg-white text-black text-[10px] font-bold rounded-lg hover:bg-zinc-200 transition-colors">Upgrade Now</button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
