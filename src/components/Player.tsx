import { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from 'lucide-react';
import { Song } from '../types';

interface PlayerProps {
  currentSong: Song | null;
  onNext?: () => void;
  onPrevious?: () => void;
}

export default function Player({ currentSong, onNext, onPrevious }: PlayerProps) {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const playerRef = useRef<ReactPlayer>(null);

  useEffect(() => {
    if (currentSong) {
      setPlaying(true);
    }
  }, [currentSong]);

  if (!currentSong) return null;

  const url = `https://www.youtube.com/watch?v=${currentSong.videoId}`;
  const thumbnail = currentSong.thumbnails?.[0]?.url || 'https://images.unsplash.com/photo-1614680376593-902f74a5cecb?auto=format&fit=crop&w=150&q=80';

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = date.getUTCSeconds().toString().padStart(2, '0');
    if (hh) {
      return `${hh}:${mm.toString().padStart(2, '0')}:${ss}`;
    }
    return `${mm}:${ss}`;
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlayed(parseFloat(e.target.value));
  };

  const handleSeekMouseUp = (e: React.MouseEvent<HTMLInputElement>) => {
    if (playerRef.current) {
      playerRef.current.seekTo(parseFloat((e.target as HTMLInputElement).value));
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 h-24 bg-neutral-900 border-t border-neutral-800 flex items-center px-4 sm:px-6 z-50 text-white">
      {/* Hidden YouTube Player */}
      <div className="hidden">
        <ReactPlayer
          ref={playerRef}
          url={url}
          playing={playing}
          volume={volume}
          muted={muted}
          onProgress={(state) => setPlayed(state.played)}
          onDuration={(d) => setDuration(d)}
          onEnded={onNext}
          config={{
            youtube: {
              playerVars: { showinfo: 0, controls: 0 }
            }
          }}
        />
      </div>

      {/* Track Info */}
      <div className="flex items-center w-1/3 min-w-0">
        <img src={thumbnail} alt="Cover" className="w-14 h-14 rounded-md object-cover mr-4" />
        <div className="truncate">
          <h4 className="text-sm font-semibold truncate">{currentSong.title}</h4>
          <p className="text-xs text-neutral-400 truncate">
            {currentSong.artists?.map(a => a.name).join(', ') || 'Unknown Artist'}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center justify-center w-1/3">
        <div className="flex items-center gap-4 sm:gap-6 mb-2">
          <button onClick={onPrevious} className="text-neutral-400 hover:text-white transition">
            <SkipBack className="w-5 h-5 fill-current" />
          </button>
          <button 
            onClick={() => setPlaying(!playing)} 
            className="w-10 h-10 flex items-center justify-center bg-white text-black rounded-full hover:scale-105 transition"
          >
            {playing ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-1" />}
          </button>
          <button onClick={onNext} className="text-neutral-400 hover:text-white transition">
            <SkipForward className="w-5 h-5 fill-current" />
          </button>
        </div>
        <div className="flex items-center w-full max-w-md gap-2">
          <span className="text-xs text-neutral-400 w-10 text-right">{formatTime(played * duration)}</span>
          <input
            type="range"
            min={0}
            max={0.999999}
            step="any"
            value={played}
            onMouseDown={() => setPlaying(false)}
            onChange={handleSeekChange}
            onMouseUp={handleSeekMouseUp}
            className="w-full h-1 bg-neutral-600 rounded-lg appearance-none cursor-pointer accent-white"
          />
          <span className="text-xs text-neutral-400 w-10">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Volume */}
      <div className="hidden sm:flex items-center justify-end w-1/3 gap-3">
        <button onClick={() => setMuted(!muted)} className="text-neutral-400 hover:text-white">
          {muted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
        <input
          type="range"
          min={0}
          max={1}
          step="any"
          value={muted ? 0 : volume}
          onChange={(e) => {
            setVolume(parseFloat(e.target.value));
            setMuted(false);
          }}
          className="w-24 h-1 bg-neutral-600 rounded-lg appearance-none cursor-pointer accent-white"
        />
      </div>
    </div>
  );
}
