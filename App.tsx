
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Player from './components/Player';
import SearchModal from './components/SearchModal';
import { View, Playlist, Song, User } from './types';

// Initial Mock Data
const INITIAL_PLAYLISTS: Playlist[] = [
  {
    id: '1',
    name: 'Midnight Jazz',
    description: 'Soulful tunes for the late night vibes.',
    coverImage: 'https://picsum.photos/seed/jazz/400/400',
    createdAt: Date.now(),
    songs: []
  },
  {
    id: '2',
    name: 'Workout Energy',
    description: 'Upbeat tracks to keep you moving.',
    coverImage: 'https://picsum.photos/seed/workout/400/400',
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
  
  // Edit Playlist State
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
  };

  const handleAddSong = (song: Song) => {
    if (!activePlaylistId) return;
    setPlaylists(prev => prev.map(p => {
      if (p.id === activePlaylistId) {
        return { ...p, songs: [...p.songs, { ...song, addedAt: Date.now() }] };
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
      name: `My Playlist #${playlists.length + 1}`,
      description: 'New playlist description',
      coverImage: `https://picsum.photos/seed/${Math.random()}/400/400`,
      createdAt: Date.now(),
      songs: []
    };
    setPlaylists([...playlists, newP]);
    setActivePlaylistId(newP.id);
    setCurrentView('playlist');
  };

  const deletePlaylist = (id: string) => {
    if (confirm('Are you sure you want to delete this playlist?')) {
      setPlaylists(prev => prev.filter(p => p.id !== id));
      if (activePlaylistId === id) {
        setCurrentView('home');
        setActivePlaylistId(null);
      }
    }
  };

  const startEditing = () => {
    if (!activePlaylist) return;
    setEditName(activePlaylist.name);
    setEditDesc(activePlaylist.description);
    setIsEditingPlaylist(true);
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
        {/* Animated Background Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-900/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-900/20 blur-[120px] rounded-full"></div>
        
        <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 p-8 rounded-2xl shadow-2xl relative z-10">
          <div className="flex flex-col items-center mb-8">
            <div className="bg-indigo-600 p-3 rounded-xl mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
            </div>
            <h1 className="text-3xl font-bold">Melodix</h1>
            <p className="text-zinc-500 mt-2 text-center">Your premium music library management system.</p>
          </div>

          <div className="space-y-4">
            {authMode === 'login' && (
              <>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-500 uppercase">Email Address</label>
                  <input type="email" placeholder="john@example.com" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 focus:outline-none focus:border-indigo-500 transition-colors" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-xs font-semibold text-zinc-500 uppercase">Password</label>
                    <button onClick={() => setAuthMode('forgot')} className="text-xs text-indigo-400 hover:text-indigo-300">Forgot?</button>
                  </div>
                  <input type="password" placeholder="••••••••" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 focus:outline-none focus:border-indigo-500 transition-colors" />
                </div>
                <button 
                  onClick={() => setUser({ ...user, isAuthenticated: true })}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-lg mt-4 transition-all"
                >
                  Sign In
                </button>
                <p className="text-center text-sm text-zinc-500 mt-4">
                  New here? <button onClick={() => setAuthMode('signup')} className="text-white hover:underline">Create an account</button>
                </p>
              </>
            )}

            {authMode === 'signup' && (
              <>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-500 uppercase">Username</label>
                  <input type="text" placeholder="melodix_lover" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 focus:outline-none focus:border-indigo-500 transition-colors" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-500 uppercase">Email</label>
                  <input type="email" placeholder="john@example.com" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 focus:outline-none focus:border-indigo-500 transition-colors" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-500 uppercase">Password</label>
                  <input type="password" placeholder="••••••••" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 focus:outline-none focus:border-indigo-500 transition-colors" />
                </div>
                <button 
                  onClick={() => setUser({ ...user, isAuthenticated: true })}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-lg mt-4"
                >
                  Create Account
                </button>
                <p className="text-center text-sm text-zinc-500 mt-4">
                  Already have an account? <button onClick={() => setAuthMode('login')} className="text-white hover:underline">Log in</button>
                </p>
              </>
            )}

            {authMode === 'forgot' && (
              <>
                <p className="text-sm text-zinc-400 mb-4">Enter your email and we'll send you a recovery link.</p>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-500 uppercase">Email Address</label>
                  <input type="email" placeholder="john@example.com" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 focus:outline-none focus:border-indigo-500 transition-colors" />
                </div>
                <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-lg mt-4">
                  Send Recovery Link
                </button>
                <button onClick={() => setAuthMode('login')} className="w-full text-zinc-500 hover:text-white text-sm mt-4 underline">Back to Login</button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-black text-white">
      <div className="flex-1 flex overflow-hidden">
        <Sidebar 
          currentView={currentView} 
          setCurrentView={setCurrentView} 
          playlists={playlists}
          onPlaylistSelect={handlePlaylistSelect}
        />

        <main className="flex-1 overflow-y-auto bg-gradient-to-b from-zinc-900 to-black p-8">
          {currentView === 'home' && (
            <div className="space-y-10">
              <section>
                <div className="bg-gradient-to-r from-indigo-900/40 to-purple-900/40 p-12 rounded-3xl border border-white/5 relative overflow-hidden group">
                  <div className="relative z-10 max-w-xl">
                    <h2 className="text-5xl font-extrabold mb-4 leading-tight">Your Music,<br/>Perfectly Curated.</h2>
                    <p className="text-zinc-400 text-lg mb-8">Manage your private library, create playlists, and explore YouTube integration with intelligent metadata enrichment.</p>
                    <button 
                      onClick={createPlaylist}
                      className="bg-white text-black font-bold px-8 py-4 rounded-full hover:scale-105 transition-transform"
                    >
                      Create New Playlist
                    </button>
                  </div>
                  <img src="https://picsum.photos/seed/abstract/800/800" className="absolute right-[-100px] top-[-100px] w-[500px] h-[500px] rounded-full blur-[60px] opacity-30 group-hover:opacity-50 transition-opacity" alt="" />
                </div>
              </section>

              <section>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold">Your Playlists</h3>
                  <button onClick={() => setCurrentView('library')} className="text-sm font-semibold text-zinc-400 hover:text-white uppercase tracking-wider">See all</button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {playlists.map(p => (
                    <div 
                      key={p.id}
                      onClick={() => handlePlaylistSelect(p.id)}
                      className="bg-zinc-900/40 p-4 rounded-xl hover:bg-zinc-800/60 transition-all cursor-pointer group border border-transparent hover:border-zinc-700 shadow-sm hover:shadow-xl"
                    >
                      <div className="aspect-square rounded-lg overflow-hidden mb-4 relative">
                        <img src={p.coverImage} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={p.name} />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center shadow-2xl">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
                          </button>
                        </div>
                      </div>
                      <h4 className="font-bold truncate">{p.name}</h4>
                      <p className="text-xs text-zinc-500 mt-1">{p.songs.length} songs</p>
                    </div>
                  ))}
                  <div 
                    onClick={createPlaylist}
                    className="bg-zinc-900/40 p-4 rounded-xl border border-dashed border-zinc-700 flex flex-col items-center justify-center text-zinc-500 hover:text-white hover:border-zinc-500 transition-all cursor-pointer aspect-[1/1.2]"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                    <span className="mt-4 font-medium">Add Playlist</span>
                  </div>
                </div>
              </section>
            </div>
          )}

          {currentView === 'library' && (
             <div className="space-y-6">
                <div className="flex justify-between items-end">
                  <h2 className="text-4xl font-extrabold">Your Library</h2>
                  <button onClick={createPlaylist} className="bg-indigo-600 px-4 py-2 rounded-lg font-medium hover:bg-indigo-500 transition-colors">New Playlist</button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                  {playlists.map(p => (
                    <div 
                      key={p.id}
                      onClick={() => handlePlaylistSelect(p.id)}
                      className="bg-zinc-900/40 p-3 rounded-xl hover:bg-zinc-800/60 transition-all cursor-pointer group border border-transparent hover:border-zinc-700"
                    >
                      <img src={p.coverImage} className="w-full aspect-square object-cover rounded-lg mb-3" alt={p.name} />
                      <h4 className="font-bold truncate text-sm">{p.name}</h4>
                      <p className="text-[10px] text-zinc-500 mt-1 uppercase">Playlist • {p.songs.length} tracks</p>
                    </div>
                  ))}
                </div>
             </div>
          )}

          {currentView === 'playlist' && activePlaylist && (
            <div className="space-y-8 animate-in fade-in duration-500">
              {isEditingPlaylist ? (
                <div className="bg-zinc-900/60 p-8 rounded-2xl border border-zinc-800 max-w-2xl">
                   <h3 className="text-xl font-bold mb-4">Edit Playlist Details</h3>
                   <div className="space-y-4">
                      <div>
                        <label className="text-xs font-bold text-zinc-500 uppercase">Name</label>
                        <input 
                          type="text" 
                          className="w-full bg-black border border-zinc-800 rounded px-4 py-2 mt-1 focus:border-indigo-500 outline-none" 
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-zinc-500 uppercase">Description</label>
                        <textarea 
                          rows={3}
                          className="w-full bg-black border border-zinc-800 rounded px-4 py-2 mt-1 focus:border-indigo-500 outline-none" 
                          value={editDesc}
                          onChange={(e) => setEditDesc(e.target.value)}
                        />
                      </div>
                      <div className="flex space-x-3 mt-6">
                        <button onClick={savePlaylistEdit} className="bg-indigo-600 px-6 py-2 rounded-lg font-bold">Save Changes</button>
                        <button onClick={() => setIsEditingPlaylist(false)} className="bg-zinc-800 px-6 py-2 rounded-lg font-bold">Cancel</button>
                      </div>
                   </div>
                </div>
              ) : (
                <div className="flex flex-col md:flex-row items-end space-y-6 md:space-y-0 md:space-x-8">
                  <img src={activePlaylist.coverImage} className="w-48 h-48 md:w-64 md:h-64 rounded-xl shadow-2xl object-cover" alt="" />
                  <div className="flex-1">
                    <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">Playlist</p>
                    <h1 className="text-4xl md:text-7xl font-black mb-4">{activePlaylist.name}</h1>
                    <p className="text-zinc-400">{activePlaylist.description}</p>
                    <div className="flex items-center space-x-4 mt-6">
                      <button 
                        onClick={() => activePlaylist.songs[0] && playSong(activePlaylist.songs[0])}
                        className="w-14 h-14 bg-indigo-600 rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-lg shadow-indigo-600/20"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="white" className="ml-1"><path d="M8 5v14l11-7z"/></svg>
                      </button>
                      <button 
                        onClick={() => setIsSearchOpen(true)}
                        className="bg-zinc-800 hover:bg-zinc-700 px-6 py-3 rounded-full font-bold flex items-center space-x-2 transition-colors shadow-lg"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                        <span>Add Music</span>
                      </button>
                      <button 
                        onClick={startEditing}
                        className="p-3 text-zinc-400 hover:text-white bg-zinc-900 rounded-full transition-colors"
                        title="Edit Playlist"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
                      </button>
                      <button 
                        onClick={() => deletePlaylist(activePlaylist.id)}
                        className="p-3 text-zinc-400 hover:text-red-500 bg-zinc-900 rounded-full transition-colors"
                        title="Delete Playlist"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-10 border-t border-zinc-900">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-zinc-500 text-xs uppercase border-b border-zinc-900">
                      <th className="py-4 px-4 w-12">#</th>
                      <th className="py-4 px-4">Title</th>
                      <th className="py-4 px-4">Album</th>
                      <th className="py-4 px-4">YouTube</th>
                      <th className="py-4 px-4 text-center">
                        <svg className="inline" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      </th>
                      <th className="py-4 px-4 w-12"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {activePlaylist.songs.map((song, index) => (
                      <tr 
                        key={song.id} 
                        className={`group hover:bg-white/5 transition-colors cursor-pointer ${currentSong?.id === song.id ? 'bg-indigo-900/20 text-indigo-400' : ''}`}
                      >
                        <td className="py-3 px-4 text-zinc-500 font-medium" onClick={() => playSong(song)}>
                          <div className="group-hover:hidden">{index + 1}</div>
                          <div className="hidden group-hover:block text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                          </div>
                        </td>
                        <td className="py-3 px-4" onClick={() => playSong(song)}>
                          <div className="flex items-center space-x-3">
                            <img src={song.thumbnail} className="w-10 h-10 rounded shadow-md object-cover" alt="" />
                            <div className="flex flex-col">
                              <span className="font-semibold truncate max-w-[200px]">{song.title}</span>
                              <span className="text-xs text-zinc-500">{song.artist}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-zinc-400 text-sm truncate max-w-[150px]">{song.album}</td>
                        <td className="py-3 px-4">
                          <a 
                            href={song.youtubeUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-xs text-zinc-500 hover:text-indigo-400 underline truncate max-w-[150px] block"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Watch Video
                          </a>
                        </td>
                        <td className="py-3 px-4 text-zinc-400 text-sm text-center font-mono">{song.duration}</td>
                        <td className="py-3 px-4">
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleRemoveSong(song.id); }}
                            className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-red-500 transition-opacity"
                            title="Remove from playlist"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                    {activePlaylist.songs.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-20 text-center">
                          <div className="flex flex-col items-center justify-center space-y-4">
                            <div className="bg-zinc-800 p-6 rounded-full">
                              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#52525b" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
                            </div>
                            <div className="space-y-2">
                              <p className="text-xl font-bold">Your playlist is empty</p>
                              <p className="text-zinc-500">Add songs using the search button to get started.</p>
                            </div>
                            <button 
                              onClick={() => setIsSearchOpen(true)}
                              className="bg-white text-black font-bold px-6 py-2 rounded-full mt-4"
                            >
                              Search Songs
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
