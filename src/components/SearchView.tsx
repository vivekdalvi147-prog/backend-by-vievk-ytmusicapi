import { useState } from 'react';
import { Search as SearchIcon, Play, AlertTriangle } from 'lucide-react';
import { searchMusic } from '../api';
import { Song } from '../types';

interface SearchViewProps {
  onPlaySong: (song: Song) => void;
}

export default function SearchView({ onPlaySong }: SearchViewProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const data = await searchMusic(query);
      setResults(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 p-6 sm:p-8 overflow-y-auto pb-32">
      <div className="max-w-4xl mx-auto">
        
        <form onSubmit={handleSearch} className="relative mb-10">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <SearchIcon className="h-6 w-6 text-neutral-400" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-neutral-800 text-white rounded-full py-4 pl-14 pr-6 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-lg"
            placeholder="Search for songs, artists, or albums..."
          />
        </form>

        {loading && (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-900/30 border border-red-800 rounded-xl p-6 mb-8 text-center">
            <AlertTriangle className="w-10 h-10 text-red-500 mx-auto mb-3" />
            <h3 className="text-xl font-bold text-red-100 mb-2">Search Error</h3>
            <p className="text-red-300 mb-4">{error}</p>
            <div className="bg-red-950 p-4 rounded-lg text-sm text-red-200 text-left">
              <strong>Note:</strong> We fixed the bug in the generated python backend code (the <code className="bg-red-900 px-1 rounded">limit</code> vs <code className="bg-red-900 px-1 rounded">scope</code> issue). 
              You need to export your backend files again and <strong>redeploy them to Render</strong> for the search API to work correctly.
            </div>
          </div>
        )}

        {!loading && !error && results.length > 0 && (
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white mb-4">Results</h2>
            {results.map((item, idx) => {
              if (item.category !== 'Songs' && item.category !== 'Videos' && item.resultType !== 'song' && item.resultType !== 'video') {
                 // only render playable items for simplicity in this demo
                 return null;
              }
              const imgUrl = item.thumbnails?.[0]?.url || 'https://images.unsplash.com/photo-1614680376593-902f74a5cecb?auto=format&fit=crop&w=150&q=80';
              
              return (
                <div 
                  key={idx}
                  onClick={() => onPlaySong({
                    videoId: item.videoId,
                    title: item.title,
                    artists: item.artists,
                    thumbnails: item.thumbnails,
                    duration: item.duration
                  })}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-neutral-800 cursor-pointer group transition"
                >
                  <div className="relative w-14 h-14 flex-shrink-0">
                    <img src={imgUrl} alt={item.title} className="w-full h-full object-cover rounded" />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                      <Play className="w-6 h-6 text-white fill-current" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-medium truncate">{item.title}</h4>
                    <p className="text-neutral-400 text-sm truncate">
                      {item.artists?.map((a: any) => a.name).join(', ')}
                    </p>
                  </div>
                  {item.duration && (
                    <div className="text-neutral-400 text-sm">{item.duration}</div>
                  )}
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
