/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import Sidebar from './components/Sidebar';
import HomeFeed from './components/HomeFeed';
import SearchView from './components/SearchView';
import Player from './components/Player';
import { Song } from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'search'>('home');
  const [currentSong, setCurrentSong] = useState<Song | null>(null);

  return (
    <div className="flex h-screen bg-neutral-950 font-sans overflow-hidden">
      <Sidebar currentView={currentView} onNavigate={setCurrentView} />
      
      <main className="flex-1 flex flex-col min-w-0 bg-neutral-950 border-l border-neutral-900">
        {/* Mobile Header */}
        <div className="md:hidden p-4 border-b border-neutral-900 flex justify-between items-center bg-black">
          <span className="text-white font-bold text-xl">VMusic</span>
          <div className="flex gap-4">
            <button 
              onClick={() => setCurrentView('home')} 
              className={`font-medium ${currentView === 'home' ? 'text-white' : 'text-neutral-500'}`}
            >
              Home
            </button>
            <button 
              onClick={() => setCurrentView('search')} 
              className={`font-medium ${currentView === 'search' ? 'text-white' : 'text-neutral-500'}`}
            >
              Search
            </button>
          </div>
        </div>

        {currentView === 'home' && <HomeFeed onPlaySong={setCurrentSong} />}
        {currentView === 'search' && <SearchView onPlaySong={setCurrentSong} />}
      </main>

      {/* Persistent Player */}
      <Player currentSong={currentSong} />
    </div>
  );
}
