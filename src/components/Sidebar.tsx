import { Home, Search, Library, Music2, Bot } from 'lucide-react';

interface SidebarProps {
  currentView: 'home' | 'search' | 'guide' | 'prompt';
  onNavigate: (view: 'home' | 'search' | 'guide' | 'prompt') => void;
}

export default function Sidebar({ currentView, onNavigate }: SidebarProps) {
  return (
    <div className="w-64 bg-black flex-shrink-0 flex flex-col border-r border-neutral-900 hidden md:flex">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
          <Music2 className="text-white w-6 h-6" />
        </div>
        <span className="text-white text-xl font-bold tracking-tight">VMusic</span>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        <button 
          onClick={() => onNavigate('home')}
          className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg font-medium transition ${
            currentView === 'home' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
          }`}
        >
          <Home className="w-5 h-5" />
          Home
        </button>
        <button 
          onClick={() => onNavigate('search')}
          className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg font-medium transition ${
            currentView === 'search' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
          }`}
        >
          <Search className="w-5 h-5" />
          Search
        </button>
        <button 
          onClick={() => onNavigate('guide')}
          className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg font-medium transition ${
            currentView === 'guide' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
          }`}
        >
          <Library className="w-5 h-5" />
          Setup Guide
        </button>
        <button 
          onClick={() => onNavigate('prompt')}
          className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg font-medium transition ${
            currentView === 'prompt' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
          }`}
        >
          <Bot className="w-5 h-5" />
          AI Prompt
        </button>
      </nav>
      
      <div className="p-6">
        <div className="bg-neutral-900 rounded-xl p-4">
          <p className="text-xs text-neutral-400 text-center">Powered by<br/><strong className="text-neutral-200">YTMusicAPI</strong> & <strong className="text-neutral-200">FastAPI</strong></p>
        </div>
      </div>
    </div>
  );
}
