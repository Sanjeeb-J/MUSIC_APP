
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Player from './components/Player';
import SearchModal from './components/SearchModal';
import { View, Playlist, Song, User } from './types';

const INITIAL_PLAYLISTS: Playlist[] = [
  {
    id: '1',
    name: 'Daily Mix',
    description: 'Your morning inspiration, curated for efficiency.',
    coverImage: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070&auto=format&fit=crop',
    createdAt: Date.now(),
    songs: []
  }
];

const App: React.FC = () => {
  const [user, setUser] = useState<User>({ username: 'MelodixUser', email: 'user@melodix.com', isAuthenticated: false });
  const [currentView, setCurrentView] = useState<View>('home');
  const [playlists, setPlaylists] = useState<Playlist[]>(() => {
    const saved = localStorage.getItem('melodix_v2_playlists');
    return saved ? JSON.parse(saved) : INITIAL_PLAYLISTS;
  });
  const [activePlaylistId, setActivePlaylistId] = useState<string | null>(null);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [isEditingPlaylist, setIsEditingPlaylist] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');

  useEffect(() => {
    localStorage.setItem('melodix_v2_playlists', JSON.stringify(playlists));
  }, [playlists]);

  const activePlaylist = playlists.find(p => p.id === activePlaylistId);

  const handlePlaylistSelect = (id: string) => {
    setActivePlaylistId(id);
    setCurrentView('playlist');
    setIsEditingPlaylist(false);
    setIsMobileMenuOpen(false);
  };

  const handleAddSong = (song: Song) => {
    if (!activePlaylistId) return;
    setPlaylists(prev => prev.map(p => {
      if (p.id === activePlaylistId) {
        const newSong = { ...song, id: Math.random().toString(36).substr(2, 9), addedAt: Date.now() };
        return { ...p, songs: [...p.songs, newSong] };
      }
      return p;
    }));
    setIsSearchOpen(false);
  };

  const handleRemoveSong = (songId: string) => {
    setPlaylists(prev => prev.map(p => {
      if (p.id === activePlaylistId) {
        return { ...p, songs: p.songs.filter(s => s.id !== songId) };
      }
      return p;
    }));
  };

  const createPlaylist = () => {
    const newP: Playlist = {
      id: Math.random().toString(36).substr(2, 9),
      name: `New Mix #${playlists.length + 1}`,
      description: 'A beautiful collection of sounds.',
      coverImage: `https://picsum.photos/seed/${Math.random()}/400/400`,
      createdAt: Date.now(),
      songs: []
    };
    setPlaylists([...playlists, newP]);
    setActivePlaylistId(newP.id);
    setCurrentView('playlist');
    setIsEditingPlaylist(true);
    setEditName(newP.name);
    setEditDesc(newP.description);
    setIsMobileMenuOpen(false);
  };

  const deletePlaylist = (id: string) => {
    if (confirm('Delete this playlist permanently?')) {
      setPlaylists(prev => prev.filter(p => p.id !== id));
      if (activePlaylistId === id) {
        setCurrentView('home');
        setActivePlaylistId(null);
      }
    }
  };

  const savePlaylistEdit = () => {
    if (!activePlaylistId) return;
    setPlaylists(prev => prev.map(p => {
      if (p.id === activePlaylistId) {
        return { ...p, name: editName, description: editDesc };
      }
      return p;
    }));
    setIsEditingPlaylist(false);
  };

  const playSong = (song: Song) => {
    setCurrentSong(song);
    setIsPlaying(true);
  };

  const nextSong = () => {
    if (!activePlaylist || !currentSong) return;
    const currentIndex = activePlaylist.songs.findIndex(s => s.id === currentSong.id);
    if (currentIndex < activePlaylist.songs.length - 1) {
      playSong(activePlaylist.songs[currentIndex + 1]);
    }
  };

  const prevSong = () => {
    if (!activePlaylist || !currentSong) return;
    const currentIndex = activePlaylist.songs.findIndex(s => s.id === currentSong.id);
    if (currentIndex > 0) {
      playSong(activePlaylist.songs[currentIndex - 1]);
    }
  };

  if (!user.isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-indigo-900/10 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] bg-purple-900/10 blur-[150px] rounded-full"></div>
        <div className="w-full max-w-md bg-zinc-900/90 border border-white/5 p-8 md:p-12 rounded-[2rem] shadow-2xl relative z-10 backdrop-blur-3xl animate-in fade-in zoom-in duration-500">
          <div className="flex flex-col items-center mb-10">
            <div className="bg-indigo-600 p-5 rounded-3xl mb-6 shadow-indigo-500/50 shadow-2xl scale-110">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
            </div>
            <h1 className="text-4xl font-black tracking-tighter">Melodix</h1>
            <p className="text-zinc-500 text-center text-sm font-medium mt-3">Premium music library & curation system.</p>
          </div>
          <div className="space-y-4">
            <input type="email" placeholder="Email" className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 focus:outline-none focus:border-indigo-500 transition-all text-sm font-medium" />
            <input type="password" placeholder="Password" className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 focus:outline-none focus:border-indigo-500 transition-all text-sm font-medium" />
            <button onClick={() => setUser({ ...user, isAuthenticated: true })} className="w-full bg-white text-black font-black py-4 rounded-2xl mt-6 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl">Launch App</button>
            <p className="text-center text-[10px] text-zinc-500 mt-8 tracking-[0.2em] uppercase font-black">Powered by Gemini AI</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-black text-white selection:bg-indigo-500/50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-30">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-indigo-900/10 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-purple-900/10 blur-[150px] rounded-full"></div>
      </div>

      <div className="flex-1 flex overflow-hidden relative z-10">
        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="h-full w-3/4 max-w-sm" onClick={e => e.stopPropagation()}>
                <Sidebar 
                  currentView={currentView} 
                  setCurrentView={(v) => { setCurrentView(v); setIsMobileMenuOpen(false); }} 
                  playlists={playlists}
                  onPlaylistSelect={handlePlaylistSelect}
                  onPlaylistDelete={deletePlaylist}
                  onPlaylistCreate={createPlaylist}
                />
            </div>
          </div>
        )}

        {/* Desktop Sidebar */}
        <div className="hidden md:block">
            <Sidebar 
              currentView={currentView} 
              setCurrentView={setCurrentView} 
              playlists={playlists}
              onPlaylistSelect={handlePlaylistSelect}
              onPlaylistDelete={deletePlaylist}
              onPlaylistCreate={createPlaylist}
            />
        </div>

        <main className="flex-1 overflow-y-auto bg-gradient-to-b from-transparent to-black p-4 md:p-8 custom-scrollbar relative">
          {/* Header Mobile */}
          <header className="flex md:hidden items-center justify-between mb-6 sticky top-0 bg-black/50 backdrop-blur-md -mx-4 px-4 py-3 z-40 border-b border-white/5">
            <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-zinc-400">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
            <div className="flex items-center space-x-2 text-indigo-500 font-black text-xl">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
               <span>Melodix</span>
            </div>
            <button onClick={() => setIsSearchOpen(true)} className="p-2 text-zinc-400">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </button>
          </header>

          {currentView === 'home' && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
              <section>
                <div className="bg-gradient-to-br from-indigo-600/20 via-purple-600/5 to-transparent p-8 md:p-16 rounded-[2.5rem] border border-white/5 relative overflow-hidden shadow-2xl">
                  <div className="relative z-10 max-w-2xl text-center md:text-left">
                    <span className="text-[10px] md:text-xs font-black text-indigo-400 uppercase tracking-[0.4em] mb-4 md:mb-6 block">Premium Curation</span>
                    <h2 className="text-4xl md:text-7xl font-black mb-6 md:mb-8 leading-[1] tracking-tighter">Rediscover Your<br/><span className="text-zinc-500">Music Taste.</span></h2>
                    <p className="text-zinc-400 text-base md:text-xl mb-10 md:mb-12 leading-relaxed font-medium">Melodix uses Gemini AI to bridge YouTube tracks with a personalized, high-end library interface.</p>
                    <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                      <button onClick={createPlaylist} className="w-full sm:w-auto bg-white text-black font-black px-10 py-4 rounded-full hover:scale-105 active:scale-95 transition-all shadow-xl">Create New Mix</button>
                      <button onClick={() => setCurrentView('library')} className="w-full sm:w-auto bg-white/5 hover:bg-white/10 text-white font-black px-10 py-4 rounded-full border border-white/10 backdrop-blur-md transition-all">Explore Library</button>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <div className="flex items-center justify-between mb-8">
                   <h3 className="text-2xl md:text-4xl font-black tracking-tighter">Recent Mixes</h3>
                   <button onClick={() => setCurrentView('library')} className="text-[10px] md:text-xs font-black text-zinc-500 hover:text-white uppercase tracking-widest transition-colors">See All</button>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-10">
                  {playlists.map(p => (
                    <div 
                      key={p.id}
                      onClick={() => handlePlaylistSelect(p.id)}
                      className="group bg-zinc-900/30 p-4 md:p-6 rounded-[2rem] hover:bg-zinc-800 transition-all cursor-pointer border border-transparent hover:border-white/10 shadow-lg hover:-translate-y-2 duration-500"
                    >
                      <div className="aspect-square rounded-2xl md:rounded-3xl overflow-hidden mb-4 md:mb-6 relative shadow-2xl">
                        <img src={p.coverImage} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={p.name} />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center backdrop-blur-[2px]">
                          <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-full flex items-center justify-center shadow-2xl transform scale-50 group-hover:scale-100 transition-transform duration-500">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="black" className="ml-1"><path d="M8 5v14l11-7z"/></svg>
                          </div>
                        </div>
                      </div>
                      <h4 className="font-black truncate text-sm md:text-xl tracking-tight mb-1">{p.name}</h4>
                      <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{p.songs.length} Tracks</p>
                    </div>
                  ))}
                  <div 
                    onClick={createPlaylist}
                    className="bg-white/5 p-4 md:p-6 rounded-[2rem] border-2 border-dashed border-zinc-800 flex flex-col items-center justify-center text-zinc-600 hover:text-white hover:border-zinc-500 transition-all cursor-pointer group aspect-square md:aspect-[1/1.2]"
                  >
                    <div className="w-12 h-12 md:w-20 md:h-20 bg-zinc-900 rounded-full flex items-center justify-center group-hover:bg-zinc-800 transition-all shadow-inner group-hover:shadow-2xl">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                    </div>
                    <span className="mt-4 md:mt-8 font-black tracking-tighter text-sm md:text-2xl">New Mix</span>
                  </div>
                </div>
              </section>
            </div>
          )}

          {currentView === 'library' && (
             <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-700">
                <div className="flex justify-between items-end border-b border-white/5 pb-10">
                  <div>
                    <h2 className="text-5xl md:text-7xl font-black tracking-tighter">Library</h2>
                    <p className="text-zinc-500 mt-4 text-sm md:text-lg font-medium">Your curated universe.</p>
                  </div>
                  <button onClick={createPlaylist} className="bg-indigo-600 px-6 md:px-10 py-3 md:py-4 rounded-2xl font-black hover:bg-indigo-500 transition-all shadow-2xl shadow-indigo-600/30 text-sm md:text-base">New Playlist</button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-8">
                  {playlists.map(p => (
                    <div 
                      key={p.id}
                      onClick={() => handlePlaylistSelect(p.id)}
                      className="bg-zinc-900/30 p-4 rounded-[1.75rem] md:rounded-[2.25rem] hover:bg-zinc-800 transition-all cursor-pointer group border border-transparent hover:border-white/10"
                    >
                      <img src={p.coverImage} className="w-full aspect-square object-cover rounded-xl md:rounded-[1.75rem] mb-4 shadow-2xl transition-all" alt={p.name} />
                      <h4 className="font-black truncate text-sm md:text-base mb-2">{p.name}</h4>
                      <div className="flex items-center space-x-2">
                        <span className="text-[9px] md:text-[10px] bg-indigo-500/20 text-indigo-400 px-2 md:px-3 py-0.5 md:py-1 rounded-full font-black uppercase tracking-tighter">Mix</span>
                        <span className="text-[9px] md:text-[10px] text-zinc-600 font-black uppercase tracking-tighter">{p.songs.length} items</span>
                      </div>
                    </div>
                  ))}
                </div>
             </div>
          )}

          {currentView === 'playlist' && activePlaylist && (
            <div className="space-y-12 md:space-y-16 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-24 md:pb-0">
              {isEditingPlaylist ? (
                <div className="bg-zinc-900/80 p-8 md:p-16 rounded-[2.5rem] md:rounded-[3rem] border border-white/5 max-w-4xl shadow-2xl backdrop-blur-3xl mx-auto">
                   <h3 className="text-3xl md:text-4xl font-black tracking-tighter mb-8 md:mb-12">Edit Metadata</h3>
                   <div className="space-y-6 md:space-y-8">
                      <div className="space-y-2 md:space-y-3">
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-2">Mix Title</label>
                        <input 
                          type="text" 
                          className="w-full bg-black/60 border border-white/5 rounded-2xl md:rounded-3xl px-6 md:px-8 py-4 md:py-5 focus:border-indigo-500 outline-none text-lg md:text-2xl font-black tracking-tight transition-all" 
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2 md:space-y-3">
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-2">About this mix</label>
                        <textarea 
                          rows={4}
                          className="w-full bg-black/60 border border-white/5 rounded-2xl md:rounded-3xl px-6 md:px-8 py-4 md:py-5 focus:border-indigo-500 outline-none text-zinc-400 font-medium text-base md:text-lg leading-relaxed transition-all" 
                          value={editDesc}
                          onChange={(e) => setEditDesc(e.target.value)}
                        />
                      </div>
                      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 pt-6">
                        <button onClick={savePlaylistEdit} className="flex-1 bg-white text-black px-12 py-4 rounded-3xl font-black text-base md:text-lg shadow-2xl transition-all">Apply Changes</button>
                        <button onClick={() => setIsEditingPlaylist(false)} className="bg-zinc-800 px-12 py-4 rounded-3xl font-black text-base md:text-lg hover:bg-zinc-700 transition-colors">Discard</button>
                      </div>
                   </div>
                </div>
              ) : (
                <div className="flex flex-col md:flex-row items-center md:items-end space-y-8 md:space-y-0 md:space-x-12 text-center md:text-left">
                  <div className="relative group shrink-0 shadow-2xl">
                    <img src={activePlaylist.coverImage} className="w-48 h-48 md:w-80 md:h-80 rounded-[2rem] md:rounded-[3rem] object-cover group-hover:scale-[1.03] transition-transform duration-1000 shadow-indigo-500/10 shadow-2xl" alt="" />
                    <div className="absolute inset-0 bg-indigo-500/5 rounded-[3rem] mix-blend-overlay"></div>
                  </div>
                  <div className="flex-1 pb-2">
                    <div className="flex items-center justify-center md:justify-start space-x-3 mb-4 md:mb-6">
                      <span className="bg-indigo-600 text-white text-[9px] md:text-[10px] font-black px-3 py-1 rounded-lg tracking-[0.2em] uppercase">Private Mix</span>
                      <span className="text-[9px] md:text-[10px] font-black text-zinc-500 tracking-widest uppercase">{activePlaylist.songs.length} Tracks</span>
                    </div>
                    <h1 className="text-4xl md:text-8xl font-black mb-4 md:mb-8 tracking-tighter leading-[0.9]">{activePlaylist.name}</h1>
                    <p className="text-zinc-400 text-sm md:text-xl font-medium leading-relaxed max-w-2xl px-4 md:px-0">{activePlaylist.description}</p>
                    <div className="flex items-center justify-center md:justify-start space-x-4 md:space-x-6 mt-10 md:mt-12">
                      <button 
                        onClick={() => activePlaylist.songs[0] && playSong(activePlaylist.songs[0])}
                        className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center hover:scale-110 active:scale-90 transition-all shadow-[0_20px_60px_rgba(255,255,255,0.2)] text-black"
                      >
                        <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor" className="ml-1"><path d="M8 5v14l11-7z"/></svg>
                      </button>
                      <button 
                        onClick={() => setIsSearchOpen(true)}
                        className="bg-indigo-600 hover:bg-indigo-500 px-6 md:px-10 py-3.5 md:py-5 rounded-[1.5rem] md:rounded-[2rem] font-black flex items-center space-x-3 md:space-x-4 transition-all shadow-xl shadow-indigo-600/40 active:scale-95 text-sm md:text-base"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                        <span>Append</span>
                      </button>
                      <div className="flex space-x-2 md:space-x-3">
                        <button onClick={() => setIsEditingPlaylist(true)} className="p-4 md:p-5 text-zinc-500 hover:text-white bg-white/5 rounded-2xl transition-all border border-white/5" title="Settings">
                           <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                        </button>
                        <button onClick={() => deletePlaylist(activePlaylist.id)} className="p-4 md:p-5 text-zinc-500 hover:text-red-500 bg-white/5 rounded-2xl transition-all border border-white/5" title="Delete">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-12 md:mt-20 bg-zinc-900/20 rounded-[2rem] md:rounded-[3rem] overflow-hidden border border-white/5 shadow-2xl backdrop-blur-3xl mx-1 md:mx-0">
                <table className="w-full text-left border-collapse table-fixed">
                  <thead>
                    <tr className="text-zinc-600 text-[9px] md:text-[11px] font-black uppercase tracking-[0.3em] border-b border-white/5">
                      <th className="py-6 md:py-8 px-4 md:px-10 w-12 md:w-20">#</th>
                      <th className="py-6 md:py-8 px-2 md:px-6 w-1/2 md:w-auto">Track</th>
                      <th className="py-6 md:py-8 px-2 md:px-6 hidden sm:table-cell">Album</th>
                      <th className="py-6 md:py-8 px-2 md:px-6 text-center w-20 md:w-32 hidden md:table-cell">Duration</th>
                      <th className="py-6 md:py-8 px-4 md:px-10 w-16 md:w-32 text-right"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {activePlaylist.songs.map((song, index) => (
                      <tr 
                        key={song.id} 
                        className={`group hover:bg-white/5 transition-all cursor-pointer ${currentSong?.id === song.id ? 'bg-indigo-600/10 text-indigo-400 font-bold' : ''}`}
                        onClick={() => playSong(song)}
                      >
                        <td className="py-4 md:py-5 px-4 md:px-10 text-zinc-600 font-mono text-[10px] md:text-sm">
                          <div className="group-hover:hidden transition-all">{index + 1}</div>
                          <div className="hidden group-hover:block text-white">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                          </div>
                        </td>
                        <td className="py-4 md:py-5 px-2 md:px-6 truncate">
                          <div className="flex items-center space-x-3 md:space-x-5 min-w-0">
                            <img src={song.thumbnail} className="w-10 h-10 md:w-14 md:h-14 rounded-xl shadow-lg object-cover shrink-0" alt="" />
                            <div className="flex flex-col min-w-0">
                              <span className="font-bold text-xs md:text-base tracking-tight truncate group-hover:text-white transition-colors">{song.title}</span>
                              <span className="text-[9px] md:text-[11px] font-black text-zinc-500 uppercase tracking-widest mt-0.5 truncate">{song.artist}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 md:py-5 px-2 md:px-6 text-zinc-500 text-[10px] md:text-sm font-bold truncate hidden sm:table-cell">{song.album || 'Unknown Release'}</td>
                        <td className="py-4 md:py-5 px-2 md:px-6 text-zinc-500 text-[10px] md:text-xs text-center font-mono font-bold hidden md:table-cell">{song.duration}</td>
                        <td className="py-4 md:py-5 px-4 md:px-10 text-right">
                          <div className="flex items-center justify-end space-x-3 md:space-x-5" onClick={(e) => e.stopPropagation()}>
                            <button 
                              onClick={() => handleRemoveSong(song.id)}
                              className="opacity-10 md:opacity-0 group-hover:opacity-100 p-2 text-zinc-600 hover:text-red-500 transition-all"
                            >
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {activePlaylist.songs.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-24 md:py-40 text-center">
                          <div className="flex flex-col items-center justify-center space-y-6 md:space-y-10">
                            <div className="bg-zinc-900 w-20 h-20 md:w-32 md:h-32 rounded-[2rem] md:rounded-[2.5rem] flex items-center justify-center border border-white/5 shadow-2xl animate-float">
                               <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#27272a" strokeWidth="1.5"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
                            </div>
                            <div className="space-y-2 md:space-y-4 px-4">
                              <p className="text-2xl md:text-4xl font-black tracking-tighter">Silent Mix</p>
                              <p className="text-zinc-500 max-w-sm mx-auto text-sm md:text-lg font-medium">Add some tracks to bring this collection to life.</p>
                            </div>
                            <button 
                              onClick={() => setIsSearchOpen(true)}
                              className="bg-white text-black font-black px-10 md:px-14 py-4 md:py-5 rounded-full mt-4 shadow-2xl hover:scale-105 active:scale-95 transition-all"
                            >
                              Find Music
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {currentSong && (
        <Player 
          currentSong={currentSong} 
          isPlaying={isPlaying} 
          setIsPlaying={setIsPlaying}
          onNext={nextSong}
          onPrevious={prevSong}
        />
      )}

      {isSearchOpen && (
        <SearchModal 
          onClose={() => setIsSearchOpen(false)} 
          onAddSong={handleAddSong}
        />
      )}
    </div>
  );
};

export default App;
