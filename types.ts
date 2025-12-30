
export interface Song {
  id: string;
  youtubeId: string;
  youtubeUrl: string; // Explicit field for the video link
  title: string;
  artist: string;
  album: string;
  duration: string;
  thumbnail: string;
  addedAt: number;
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  songs: Song[];
  createdAt: number;
}

export interface User {
  username: string;
  email: string;
  isAuthenticated: boolean;
}

export type View = 'home' | 'library' | 'playlist' | 'search';
