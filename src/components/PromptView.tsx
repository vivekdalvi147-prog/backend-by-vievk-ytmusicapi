import { useState } from 'react';
import { Copy, CheckCircle, Bot, Sparkles } from 'lucide-react';

export default function PromptView() {
  const [copied, setCopied] = useState(false);

  const promptText = `Act as an Expert Senior Android Developer. I want to build a fully functional music streaming Android app named "VMusic" from scratch (0 to 100).

I already have a custom Python FastAPI backend live at:
BASE_URL = "https://backend-by-vievk-ytmusicapi.onrender.com/"

Here are the strict, step-by-step requirements for the app. Generate the complete production-ready code for all of these:

### 1. Architecture & Tech Stack
- **UI:** Kotlin, Jetpack Compose (Material 3, Dark Theme by default).
- **Architecture:** MVVM (Model-View-ViewModel) with Clean Architecture principles.
- **Dependency Injection:** Hilt / Dagger.
- **Networking:** Retrofit & Gson for API calls.
- **Async:** Kotlin Coroutines & Flow.
- **Media Player:** Jetpack Media3 (ExoPlayer & MediaSessionService) for background audio playback.
- **Image Loading:** Coil.

### 2. API Integration (Retrofit)
All API responses follow this standard JSON wrapper:
\`{ "success": true, "data": <Actual Data>, "message": null }\`

Create the Retrofit interface (\`VMusicApi\`) for these endpoints:
1. **Home Feed:** \`GET api/v1/home\`
2. **Search:** \`GET api/v1/search?q={query}&filter=songs\` 
   *(Crucial: ALWAYS append \`&filter=songs\` to the search query to prevent backend crashes).*

### 3. CRITICAL: Music Stream Extraction Logic (How to Play Audio)
The API returns a YouTube \`videoId\` for songs (e.g., "kJQP7kiw5Fk"). YOU CANNOT PASS THIS ID DIRECTLY TO EXOPLAYER. IT WILL FAIL AND STAY AT 0:00.
You MUST implement stream extraction using the \`youtubedl-android\` library BEFORE passing the URL to ExoPlayer.

**Extraction Logic (MUST Run in IO Coroutine):**
1. Add dependency: \`implementation("com.github.yausername.youtubedl-android:library:0.16.0")\`
2. Initialize in Application: \`YoutubeDL.getInstance().init(applicationContext)\`
3. When a user clicks a song, show a "Loading" state in the UI.
4. In an IO Coroutine, run:
   \`val request = YoutubeDLRequest("https://music.youtube.com/watch?v=$videoId")\`
   \`request.addOption("-f", "bestaudio")\`
   \`val streamInfo = YoutubeDL.getInstance().getInfo(request)\`
   \`val playableAudioUrl = streamInfo.url // <-- Direct .m4a link\`
5. Pass \`playableAudioUrl\` to ExoPlayer, call \`prepare()\` and \`play()\` on the Main thread.

### 4. Background Playback & Media3 Service
- Create a \`MediaSessionService\` so music plays seamlessly in the background.
- Show a Media Notification with Play, Pause, Next, Previous actions.
- Handle Player States (Loading, Playing, Paused, Error).

### 5. UI Requirements (Jetpack Compose)
1. **Home Screen:** Fetch from \`/home\` and display horizontal scrolling lists (\`LazyRow\`) for different sections (Top Charts, New Releases).
2. **Search Screen:** A sticky search bar that calls \`/search\` and shows results in a \`LazyColumn\`.
3. **Mini Player:** A persistent bottom bar showing the currently playing song title, artist, a play/pause button, and a progress bar.
4. **Full Player Screen:** A modal/full-screen view showing large album art, song name, artist, interactive seek bar (Slider), and full media controls.

### Your Task:
Please provide the complete, step-by-step code to build this app. Start with:
1. \`build.gradle.kts\` (All required dependencies)
2. Network layer (Retrofit, Data Classes)
3. Media3 Service (ExoPlayer setup + YoutubeDL integration logic)
4. ViewModels (with the loading state and extraction logic)
5. Compose UI Screens (Home, Search, Player).`;

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
