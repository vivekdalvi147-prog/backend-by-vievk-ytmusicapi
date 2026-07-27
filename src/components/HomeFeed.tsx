import { useEffect, useState } from 'react';
import { fetchHome } from '../api';
import { HomeSection, HomeItem, Song } from '../types';
import { Play } from 'lucide-react';

interface HomeFeedProps {
  onPlaySong: (song: Song) => void;
}

export default function HomeFeed({ onPlaySong }: HomeFeedProps) {
  const [sections, setSections] = useState<HomeSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchHome()
      .then((data) => {
        setSections(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="animate-pulse space-y-8">
          {[1, 2, 3].map((i) => (
            <div key={i}>
              <div className="h-6 w-48 bg-neutral-800 rounded mb-4"></div>
              <div className="flex gap-4 overflow-x-hidden">
                {[1, 2, 3, 4].map((j) => (
                  <div key={j} className="w-40 flex-shrink-0 space-y-2">
                    <div className="w-40 h-40 bg-neutral-800 rounded-lg"></div>
                    <div className="h-4 w-32 bg-neutral-800 rounded"></div>
                    <div className="h-3 w-24 bg-neutral-800 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 text-red-400">
        <p>Error loading home feed: {error}</p>
      </div>
    );
  }

  const handleItemClick = (item: HomeItem) => {
    if (item.videoId) {
      onPlaySong({
        videoId: item.videoId,
        title: item.title,
        artists: item.artists,
        thumbnails: item.thumbnails,
      });
    }
  };

  return (
    <div className="flex-1 p-6 sm:p-8 overflow-y-auto pb-32">
      <div className="max-w-7xl mx-auto space-y-10">
        <h1 className="text-3xl font-bold text-white mb-8">Home</h1>
        {sections.map((section, idx) => (
          <div key={idx} className="space-y-4">
            <h2 className="text-xl font-bold text-white">{section.title}</h2>
            <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
              {section.contents.map((item, i) => {
                const imgUrl = item.thumbnails?.[0]?.url || 'https://images.unsplash.com/photo-1614680376593-902f74a5cecb?auto=format&fit=crop&w=300&q=80';
                const isPlayable = !!item.videoId;

                return (
                  <div 
                    key={i} 
                    className="w-40 flex-shrink-0 group relative cursor-pointer"
                    onClick={() => handleItemClick(item)}
                  >
                    <div className="relative aspect-square mb-3">
                      <img 
                        src={imgUrl} 
                        alt={item.title} 
                        className="w-full h-full object-cover rounded-lg shadow-md"
                      />
                      {isPlayable && (
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                          <button className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-105 transition-transform">
                            <Play className="w-6 h-6 fill-current ml-1" />
                          </button>
                        </div>
                      )}
                    </div>
                    <h3 className="font-semibold text-neutral-100 text-sm line-clamp-2">{item.title}</h3>
                    <p className="text-neutral-400 text-xs mt-1 line-clamp-1">
                      {item.description || item.artists?.map(a => a.name).join(', ')}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
