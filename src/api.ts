const BASE_URL = 'https://backend-by-vievk-ytmusicapi.onrender.com/api/v1';

export async function fetchHome() {
  const res = await fetch(`${BASE_URL}/home`);
  if (!res.ok) throw new Error('Failed to fetch home');
  const json = await res.json();
  return json.data;
}

export async function searchMusic(query: string) {
  const res = await fetch(`${BASE_URL}/search?q=${encodeURIComponent(query)}`);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to search');
  }
  const json = await res.json();
  return json.data;
}

export async function fetchPlaylist(playlistId: string) {
  const res = await fetch(`${BASE_URL}/playlist/${playlistId}`);
  if (!res.ok) throw new Error('Failed to fetch playlist');
  const json = await res.json();
  return json.data;
}
