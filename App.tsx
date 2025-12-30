
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Player from './components/Player';
import SearchModal from './components/SearchModal';
import { View, Playlist, Song, User } from './types';

const INITIAL_PLAYLISTS: Playlist[] = [
  {
    id: '1',
    name: 'Morning Coffee',
    description: 'Perfect acoustic tunes to start your day.',
    coverImage: 'https://picsum.photos/seed/coffee/400/400',
    createdAt: Date.now(),
    songs: []
  }
];

const App: React.FC = () => {
  const [user, setUser] = useState<User>({ username: 'DemoUser', email: 'demo@melodix.com', isAuthenticated: false });
  const [currentView, setCurrentView] = useState<View>('home');
  const [playlists, setPlaylists] = useState<Playlist[]>(() => {
    const saved = localStorage.getItem('melodix_playlists');
    return saved ? JSON.parse(saved) : INITIAL_PLAYLISTS;
  });
  const [activePlaylistId, setActivePlaylistId] = useState<string | null>(null);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgot' | null>('login');
  
  const [isEditingPlaylist, setIsEditingPlaylist] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');

  useEffect(() => {
    localStorage.setItem('melodix_playlists', JSON.stringify(playlists));
  }, [playlists]);

  const activePlaylist = playlists.find(p => p.id === activePlaylistId);

  const handlePlaylistSelect = (id: string) => {
    setActivePlaylistId(id);
    setCurrentView('playlist');
    setIsEditingPlaylist(false);
  };

  const handleAddSong = (song: Song) => {
    if (!activePlaylistId) return;
    setPlaylists(prev => prev.map(p => {
      if (p.id === activePlaylistId) {
        return { ...p, songs: [...p.songs, { ...song, id: Math.random().toString(36).substr(2, 9), addedAt: Date.now() }] };
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
      name: `New Playlist #${playlists.length + 1}`,
      description: 'Your beautiful curation',
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
  };

  const deletePlaylist = (id: string) => {
    if (confirm('Permanently delete this playlist?')) {
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
      <div className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-900/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-900/20 blur-[120px] rounded-full"></div>
        <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 p-8 rounded-3xl shadow-2xl relative z-10 backdrop-blur-md">
          <div className="flex flex-col items-center mb-8">
            <div className="bg-indigo-600 p-4 rounded-2xl mb-4 shadow-xl shadow-indigo-600/20">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
            </div>
            <h1 className="text-4xl font-black tracking-tighter">Melodix</h1>
            <p className="text-zinc-500 mt-2 text-center text-sm">Experience your private music collection in high definition.</p>
          </div>
          <div className="space-y-4">
            <input type="email" placeholder="Email Address" className="w-full bg-black/50 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 transition-all text-sm" />
            <input type="password" placeholder="Password" className="w-full bg-black/50 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 transition-all text-sm" />
            <button onClick={() => setUser({ ...user, isAuthenticated: true })} className="w-full bg-white text-black font-bold py-3.5 rounded-xl mt-4 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl">Sign In</button>
            <p className="text-center text-xs text-zinc-500 mt-6 tracking-wide uppercase font-bold">New to Melodix? <button className="text-white hover:underline">Get Started</button></p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-black text-white selection:bg-indigo-500/30">
      <div className="flex-1 flex overflow-hidden">
        <Sidebar 
          currentView={currentView} 
          setCurrentView={setCurrentView} 
          playlists={playlists}
          onPlaylistSelect={handlePlaylistSelect}
          onPlaylistDelete={deletePlaylist}
          onPlaylistCreate={createPlaylist}
        />

        <main className="flex-1 overflow-y-auto bg-gradient-to-b from-zinc-900/50 to-black p-8 relative">
          {currentView === 'home' && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <section>
                <div className="bg-gradient-to-br from-indigo-600/20 via-purple-600/10 to-transparent p-12 rounded-[2.5rem] border border-white/5 relative overflow-hidden">
                  <div className="relative z-10 max-w-xl">
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.3em] mb-4 block">Recommended for you</span>
                    <h2 className="text-6xl font-black mb-6 leading-[0.95] tracking-tighter">Your Library.<br/><span className="text-zinc-500">Infinite Vibes.</span></h2>
                    <p className="text-zinc-400 text-lg mb-10 leading-relaxed font-medium">Curate, listen, and share. Melodix syncs your favorite YouTube tracks into a premium localized experience.</p>
                    <div className="flex space-x-4">
                      <button onClick={createPlaylist} className="bg-white text-black font-bold px-10 py-4 rounded-full hover:scale-105 active:scale-95 transition-all shadow-xl">Create Playlist</button>
                      <button onClick={() => setCurrentView('library')} className="bg-white/5 hover:bg-white/10 text-white font-bold px-10 py-4 rounded-full border border-white/10 transition-all">Explore Library</button>
                    </div>
                  </div>
                  <div className="absolute right-[-5%] bottom-[-10%] w-[400px] h-[400px] bg-indigo-500/20 blur-[100px] rounded-full animate-pulse"></div>
                </div>
              </section>

              <section>
                <div className="flex items-center justify-between mb-8">
                   <h3 className="text-3xl font-black tracking-tight">Recent Collections</h3>
                   <div className="flex space-x-2">
                      <button className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-500 hover:text-white border border-white/5"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg></button>
                      <button className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-500 hover:text-white border border-white/5"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg></button>
                   </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                  {playlists.map(p => (
                    <div 
                      key={p.id}
                      onClick={() => handlePlaylistSelect(p.id)}
                      className="group bg-zinc-900/40 p-5 rounded-3xl hover:bg-zinc-800 transition-all cursor-pointer border border-transparent hover:border-white/10 shadow-xl hover:-translate-y-1 duration-500"
                    >
                      <div className="aspect-square rounded-2xl overflow-hidden mb-5 relative shadow-2xl">
                        <img src={p.coverImage} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={p.name} />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-2xl transform scale-75 group-hover:scale-100 transition-transform duration-500">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="black" className="ml-1"><path d="M8 5v14l11-7z"/></svg>
                          </div>
                        </div>
                      </div>
                      <h4 className="font-bold truncate text-lg tracking-tight mb-1">{p.name}</h4>
                      <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">{p.songs.length} Tracks</p>
                    </div>
                  ))}
                  <div 
                    onClick={createPlaylist}
                    className="bg-zinc-900/20 p-5 rounded-3xl border-2 border-dashed border-zinc-800 flex flex-col items-center justify-center text-zinc-500 hover:text-white hover:border-zinc-500 transition-all cursor-pointer group aspect-[1/1.2]"
                  >
                    <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center group-hover:bg-zinc-800 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                    </div>
                    <span className="mt-6 font-black tracking-tighter text-lg">New Mix</span>
                  </div>
                </div>
              </section>
            </div>
          )}

          {currentView === 'library' && (
             <div className="space-y-10 animate-in fade-in duration-500">
                <div className="flex justify-between items-end border-b border-white/5 pb-8">
                  <div>
                    <h2 className="text-6xl font-black tracking-tighter">Library</h2>
                    <p className="text-zinc-500 mt-2 font-medium">Your entire sonic universe, localized.</p>
                  </div>
                  <button onClick={createPlaylist} className="bg-indigo-600 px-8 py-3.5 rounded-2xl font-bold hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20">New Playlist</button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                  {playlists.map(p => (
                    <div 
                      key={p.id}
                      onClick={() => handlePlaylistSelect(p.id)}
                      className="bg-zinc-900/40 p-4 rounded-3xl hover:bg-zinc-800 transition-all cursor-pointer group border border-transparent hover:border-white/10"
                    >
                      <img src={p.coverImage} className="w-full aspect-square object-cover rounded-2xl mb-4 shadow-lg group-hover:shadow-2xl transition-all" alt={p.name} />
                      <h4 className="font-bold truncate text-sm mb-1">{p.name}</h4>
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter">Playlist</span>
                        <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-tighter">{p.songs.length} songs</span>
                      </div>
                    </div>
                  ))}
                </div>
             </div>
          )}

          {currentView === 'playlist' && activePlaylist && (
            <div className="space-y-12 animate-in fade-in duration-500">
              {isEditingPlaylist ? (
                <div className="bg-zinc-900/50 p-12 rounded-[2.5rem] border border-white/5 max-w-3xl shadow-2xl backdrop-blur-xl">
                   <h3 className="text-3xl font-black tracking-tighter mb-8">Edit Mix Details</h3>
                   <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Playlist Title</label>
                        <input 
                          type="text" 
                          className="w-full bg-black/50 border border-zinc-800 rounded-2xl px-6 py-4 mt-1 focus:border-indigo-500 outline-none text-xl font-bold tracking-tight transition-all" 
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Mix Description</label>
                        <textarea 
                          rows={4}
                          className="w-full bg-black/50 border border-zinc-800 rounded-2xl px-6 py-4 mt-1 focus:border-indigo-500 outline-none text-zinc-400 font-medium leading-relaxed transition-all" 
                          value={editDesc}
                          onChange={(e) => setEditDesc(e.target.value)}
                        />
                      </div>
                      <div className="flex space-x-4 pt-4">
                        <button onClick={savePlaylistEdit} className="bg-white text-black px-10 py-4 rounded-2xl font-bold shadow-xl hover:scale-105 active:scale-95 transition-all">Save Changes</button>
                        <button onClick={() => setIsEditingPlaylist(false)} className="bg-zinc-800 px-10 py-4 rounded-2xl font-bold hover:bg-zinc-700 transition-colors">Discard</button>
                      </div>
                   </div>
                </div>
              ) : (
                <div className="flex flex-col md:flex-row items-end space-y-8 md:space-y-0 md:space-x-12">
                  <div className="relative group">
                    <img src={activePlaylist.coverImage} className="w-56 h-56 md:w-72 md:h-72 rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.6)] object-cover group-hover:scale-[1.02] transition-transform duration-700" alt="" />
                    <div className="absolute inset-0 bg-indigo-500/10 rounded-[2rem] mix-blend-overlay"></div>
                  </div>
                  <div className="flex-1 pb-2">
                    <div className="flex items-center space-x-2 mb-4">
                      <span className="bg-white text-black text-[10px] font-black px-2 py-0.5 rounded tracking-widest uppercase">Collection</span>
                      <span className="text-[10px] font-black text-zinc-500 tracking-widest uppercase">Created {new Date(activePlaylist.createdAt).toLocaleDateString()}</span>
                    </div>
                    <h1 className="text-5xl md:text-8xl font-black mb-6 tracking-tighter leading-[0.85]">{activePlaylist.name}</h1>
                    <p className="text-zinc-400 text-lg font-medium leading-relaxed max-w-2xl">{activePlaylist.description}</p>
                    <div className="flex items-center space-x-5 mt-10">
                      <button 
                        onClick={() => activePlaylist.songs[0] && playSong(activePlaylist.songs[0])}
                        className="w-16 h-16 bg-white rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-[0_10px_30px_rgba(255,255,255,0.2)]"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="black" className="ml-1"><path d="M8 5v14l11-7z"/></svg>
                      </button>
                      <button 
                        onClick={() => setIsSearchOpen(true)}
                        className="bg-indigo-600 hover:bg-indigo-500 px-8 py-4 rounded-2xl font-black flex items-center space-x-3 transition-all shadow-xl shadow-indigo-600/20 active:scale-95"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                        <span className="text-sm">Add Track</span>
                      </button>
                      <div className="flex space-x-2">
                        <button onClick={() => setIsEditingPlaylist(true)} className="p-4 text-zinc-400 hover:text-white bg-white/5 rounded-2xl transition-all border border-white/5" title="Edit Metadata">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
                        </button>
                        <button onClick={() => deletePlaylist(activePlaylist.id)} className="p-4 text-zinc-400 hover:text-red-500 bg-white/5 rounded-2xl transition-all border border-white/5" title="Delete Mix">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-16 bg-zinc-900/30 rounded-[2rem] overflow-hidden border border-white/5 shadow-2xl backdrop-blur-sm">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] border-b border-white/5">
                      <th className="py-6 px-8 w-16">#</th>
                      <th className="py-6 px-4">Track Detail</th>
                      <th className="py-6 px-4">Project / Album</th>
                      <th className="py-6 px-4 text-center"><svg className="inline" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></th>
                      <th className="py-6 px-8 w-20"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {activePlaylist.songs.map((song, index) => (
                      <tr 
                        key={song.id} 
                        className={`group hover:bg-white/5 transition-all cursor-pointer ${currentSong?.id === song.id ? 'bg-indigo-600/10 text-indigo-400' : ''}`}
                        onClick={() => playSong(song)}
                      >
                        <td className="py-4 px-8 text-zinc-500 font-mono text-xs">
                          <div className="group-hover:hidden">{index + 1}</div>
                          <div className="hidden group-hover:block text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-4">
                            <div className="relative shrink-0">
                              <img src={song.thumbnail} className="w-12 h-12 rounded-xl shadow-lg object-cover" alt="" />
                              {currentSong?.id === song.id && isPlaying && (
                                <div className="absolute inset-0 bg-indigo-600/20 rounded-xl flex items-center justify-center">
                                  <div className="flex items-end space-x-0.5 h-3">
                                    <div className="w-0.5 bg-white animate-pulse"></div>
                                    <div className="w-0.5 bg-white animate-pulse delay-75"></div>
                                    <div className="w-0.5 bg-white animate-pulse delay-150"></div>
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="font-bold text-sm tracking-tight truncate max-w-[250px] group-hover:text-white transition-colors">{song.title}</span>
                              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{song.artist}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-zinc-400 text-xs font-medium truncate max-w-[180px]">{song.album || 'Single'}</td>
                        <td className="py-4 px-4 text-zinc-400 text-xs text-center font-mono">{song.duration}</td>
                        <td className="py-4 px-8 text-right">
                          <div className="flex items-center justify-end space-x-4">
                            <a href={song.youtubeUrl} target="_blank" rel="noopener noreferrer" className="opacity-0 group-hover:opacity-100 p-2 text-zinc-500 hover:text-indigo-400 transition-all" onClick={(e) => e.stopPropagation()}>
                               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                            </a>
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleRemoveSong(song.id); }}
                              className="opacity-0 group-hover:opacity-100 p-2 text-zinc-500 hover:text-red-500 transition-all"
                              title="Discard from mix"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {activePlaylist.songs.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-32 text-center">
                          <div className="flex flex-col items-center justify-center space-y-6">
                            <div className="bg-zinc-900 w-24 h-24 rounded-full flex items-center justify-center border border-white/5 shadow-2xl">
                              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#3f3f46" strokeWidth="1.5"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
                            </div>
                            <div className="space-y-2">
                              <p className="text-2xl font-black tracking-tighter">Your mix is silent</p>
                              <p className="text-zinc-500 max-w-xs mx-auto font-medium">Melodix intelligence is ready to help you find the perfect tracks.</p>
                            </div>
                            <button 
                              onClick={() => setIsSearchOpen(true)}
                              className="bg-white text-black font-black px-10 py-3.5 rounded-2xl mt-4 shadow-xl active:scale-95 transition-all"
                            >
                              Start Searching
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

      <Player 
        currentSong={currentSong} 
        isPlaying={isPlaying} 
        setIsPlaying={setIsPlaying}
        onNext={nextSong}
        onPrevious={prevSong}
      />

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
