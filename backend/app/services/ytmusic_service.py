from ytmusicapi import YTMusic
import asyncio
from typing import Any, Dict, List

class YTMusicService:
    def __init__(self):
        # ytmusicapi initializes synchronously
        self.yt = YTMusic()

    async def search(self, query: str, filter: str = None, limit: int = 20) -> List[Dict]:
        return await asyncio.to_thread(self.yt.search, query, filter, limit)

    async def get_song(self, video_id: str) -> Dict:
        return await asyncio.to_thread(self.yt.get_song, video_id)

    async def get_lyrics(self, browse_id: str) -> Dict:
        return await asyncio.to_thread(self.yt.get_lyrics, browse_id)

    async def get_artist(self, channel_id: str) -> Dict:
        return await asyncio.to_thread(self.yt.get_artist, channel_id)

    async def get_artist_albums(self, channel_id: str, params: str) -> Dict:
        return await asyncio.to_thread(self.yt.get_artist_albums, channel_id, params)

    async def get_album(self, browse_id: str) -> Dict:
        return await asyncio.to_thread(self.yt.get_album, browse_id)

    async def get_playlist(self, playlist_id: str, limit: int = 100) -> Dict:
        return await asyncio.to_thread(self.yt.get_playlist, playlist_id, limit)

    async def get_related(self, browse_id: str) -> Any:
        return await asyncio.to_thread(self.yt.get_song_related, browse_id)
        
    async def get_home(self) -> List[Dict]:
        return await asyncio.to_thread(self.yt.get_home)
        
    async def get_charts(self, country: str = "US") -> Dict:
        return await asyncio.to_thread(self.yt.get_charts, country)
        
    async def get_moods(self) -> Dict:
        return await asyncio.to_thread(self.yt.get_mood_categories)
        
    async def get_mood_playlists(self, params: str) -> List[Dict]:
        return await asyncio.to_thread(self.yt.get_mood_playlists, params)
        
    async def get_watch_playlist(self, video_id: str, limit: int = 25) -> Dict:
        return await asyncio.to_thread(self.yt.get_watch_playlist, video_id, limit=limit)
        
    async def get_search_suggestions(self, query: str) -> List[Any]:
        return await asyncio.to_thread(self.yt.get_search_suggestions, query)
        
    async def get_user(self, channel_id: str) -> Dict:
        return await asyncio.to_thread(self.yt.get_user, channel_id)

yt_service = YTMusicService()
