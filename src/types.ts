export interface Song {
  videoId: string;
  title: string;
  artists?: { name: string; id: string }[];
  thumbnails?: { url: string; width: number; height: number }[];
  album?: { name: string; id: string };
  duration?: string;
}

export interface HomeSection {
  title: string;
  contents: HomeItem[];
}

export interface HomeItem {
  title: string;
  videoId?: string;
  playlistId?: string;
  browseId?: string;
  thumbnails?: { url: string; width: number; height: number }[];
  description?: string;
  artists?: { name: string; id: string }[];
}
