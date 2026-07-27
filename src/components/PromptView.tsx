import { useState } from 'react';
import { Copy, CheckCircle, Bot, Sparkles } from 'lucide-react';

export default function PromptView() {
  const [copied, setCopied] = useState(false);

  const promptText = `You are an Expert Android Developer specializing in Kotlin, MVVM, Jetpack Compose, and Media3 (ExoPlayer).
I want to build a music streaming app named "VMusic".

I already have a custom Python FastAPI backend live at:
BASE_URL = "https://backend-by-vievk-ytmusicapi.onrender.com/"

Here are the strict requirements for the app:

### 1. Architecture & Tech Stack
- Kotlin, Jetpack Compose for UI
- MVVM Architecture with Hilt/Dagger for Dependency Injection (optional but preferred)
- Retrofit & Gson for API calls
- Kotlin Coroutines & Flow for async operations
- Jetpack Media3 (ExoPlayer & MediaSessionService) for background audio playback
- Coil for image loading

### 2. API Integration (Retrofit)
All API responses follow this standard JSON wrapper:
\`{ "success": true, "data": <Actual Data>, "message": null }\`

Create the Retrofit interface for these endpoints:
1. Home Feed: \`GET api/v1/home\`
2. Search: \`GET api/v1/search?q={query}\`

### 3. Music Playback Logic (CRITICAL STEP)
The API returns a \`videoId\` for songs, NOT a direct .mp3 link. 
You MUST implement stream extraction using \`youtubedl-android\` before passing the URL to ExoPlayer.

Setup:
- Add \`implementation("com.github.yausername.youtubedl-android:library:0.16.0")\`
- Initialize \`YoutubeDL.getInstance().init(applicationContext)\` in Application class.

Extraction Logic:
\`\`\`kotlin
val videoUrl = "https://music.youtube.com/watch?v=$videoId"
val request = YoutubeDLRequest(videoUrl)
request.addOption("-f", "bestaudio")
val streamInfo = YoutubeDL.getInstance().getInfo(request)
val playableAudioUrl = streamInfo.url // Pass THIS to ExoPlayer
\`\`\`

### 4. Background Playback (Media3)
- Create a \`MediaSessionService\` so music plays in the background and shows a notification controller.
- Handle play, pause, next, and previous actions.

### 5. UI Requirements (Dark Theme)
- Home Screen: Fetch from \`/home\` and display horizontal scrolling lists (LazyRow) for different sections.
- Search Screen: A search bar that calls \`/search\` and shows results in a LazyColumn.
- Mini Player: A persistent bottom bar showing the currently playing song, play/pause button, and a progress bar.
- Full Player Screen: Shows album art, song name, artist, seek bar, and full controls.

Please provide the complete, step-by-step code to build this Android application, starting from the Gradle dependencies, Retrofit setup, ExoPlayer service, and finally the Compose UI screens.`;

  const handleCopy = () => {
    navigator.clipboard.writeText(promptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 p-6 sm:p-8 overflow-y-auto pb-32">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-gradient-to-r from-purple-900 to-purple-800 rounded-2xl p-8 text-white shadow-lg flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-4 flex items-center gap-3">
              <Bot className="w-8 h-8" />
              AI Prompt Generator
            </h1>
            <p className="text-purple-100 text-lg max-w-2xl">
              Niche diya gaya prompt copy karein aur kisi bhi AI (ChatGPT, Claude, ya Gemini) ko dein. Ye prompt AI ko batayega ki aapka backend kaise use karna hai aur music play kaise hoga.
            </p>
          </div>
          <Sparkles className="w-16 h-16 text-purple-400 opacity-50 hidden md:block" />
        </div>

        <div className="bg-neutral-900 rounded-2xl shadow-sm border border-neutral-800 overflow-hidden">
          <div className="flex justify-between items-center px-6 py-4 bg-black border-b border-neutral-800">
            <span className="text-neutral-400 font-mono text-sm">prompt.txt</span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition"
            >
              {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy Prompt'}
            </button>
          </div>
          <div className="p-6">
            <pre className="text-neutral-300 font-mono text-sm whitespace-pre-wrap leading-relaxed">
              {promptText}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
