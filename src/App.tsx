/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Terminal, Code, PlayCircle, Smartphone, Server, FileJson, AlertTriangle } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6 sm:p-10 text-center">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 transform rotate-3">
            <Smartphone className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-4">VMusic Android Integration Guide</h1>
          <p className="text-neutral-600 max-w-2xl mx-auto text-lg">
            Your backend is live at <code className="bg-neutral-100 text-blue-600 px-2 py-1 rounded">https://backend-by-vievk-ytmusicapi.onrender.com</code>. 
            Here is the complete guide to connecting your Android app to this API and playing music.
          </p>
        </div>

        {/* Not Found Explanation */}
        <div className="bg-white rounded-2xl shadow-sm border border-red-200 overflow-hidden">
          <div className="bg-red-50 px-6 py-4 border-b border-red-100 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <h2 className="text-lg font-semibold text-red-800">Why are you seeing {"{\"detail\":\"Not Found\"}"}?</h2>
          </div>
          <div className="p-6 space-y-4">
            <p className="text-neutral-700">
              This is completely normal! FastApi returns <code>{`{"detail": "Not Found"}`}</code> when you visit the main domain URL (<code>/</code>) because we didn't create a blank homepage. An API is meant to be accessed via specific <strong>endpoints</strong>.
            </p>
            <div className="bg-neutral-50 rounded-xl border border-neutral-200 p-5">
              <p className="font-semibold text-neutral-900 mb-3">Try clicking these correct URLs instead:</p>
              <ul className="space-y-4 text-sm">
                <li>
                  <a href="https://backend-by-vievk-ytmusicapi.onrender.com/docs" target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline font-medium text-base flex items-center gap-2">
                    🔗 https://backend-by-vievk-ytmusicapi.onrender.com/docs
                  </a>
                  <p className="text-neutral-500 mt-1">This opens the <strong>Swagger UI Documentation</strong> where you can see and test ALL your endpoints easily.</p>
                </li>
                <li>
                  <a href="https://backend-by-vievk-ytmusicapi.onrender.com/api/v1/home" target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline font-medium text-base flex items-center gap-2">
                    🔗 https://backend-by-vievk-ytmusicapi.onrender.com/api/v1/home
                  </a>
                  <p className="text-neutral-500 mt-1">Returns the YT Music Home feed data in JSON format.</p>
                </li>
                <li>
                  <a href="https://backend-by-vievk-ytmusicapi.onrender.com/api/v1/search?q=arijit%20singh" target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline font-medium text-base flex items-center gap-2">
                    🔗 .../api/v1/search?q=arijit singh
                  </a>
                  <p className="text-neutral-500 mt-1">Tests the search API endpoint.</p>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Step 1: Retrofit Setup */}
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
          <div className="bg-neutral-900 px-6 py-4 border-b border-neutral-800 flex items-center gap-3">
            <FileJson className="w-5 h-5 text-green-400" />
            <h2 className="text-lg font-semibold text-white">1. Setup Retrofit (API Connection)</h2>
          </div>
          <div className="p-6 space-y-4">
            <p className="text-neutral-600">First, add Retrofit and Gson to your Android project's <code>build.gradle</code>, then create your API interface to fetch search results, home data, etc.</p>
            <div className="bg-neutral-50 rounded-lg border border-neutral-200 p-4 overflow-x-auto">
              <pre className="text-sm text-neutral-800">
{`// VMusicApi.kt
interface VMusicApi {
    @GET("api/v1/search")
    suspend fun searchMusic(
        @Query("q") query: String
    ): Response<StandardResponse>

    @GET("api/v1/home")
    suspend fun getHomeData(): Response<StandardResponse>
    
    // Add other endpoints as needed
}

// RetrofitClient.kt
val retrofit = Retrofit.Builder()
    .baseUrl("https://backend-by-vievk-ytmusicapi.onrender.com/")
    .addConverterFactory(GsonConverterFactory.create())
    .build()

val api = retrofit.create(VMusicApi::class.java)`}
              </pre>
            </div>
          </div>
        </div>

        {/* Step 2: The Playback Problem & Solution */}
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
          <div className="bg-neutral-900 px-6 py-4 border-b border-neutral-800 flex items-center gap-3">
            <Server className="w-5 h-5 text-purple-400" />
            <h2 className="text-lg font-semibold text-white">2. How to actually PLAY the music? (Crucial)</h2>
          </div>
          <div className="p-6 space-y-4">
            <p className="text-neutral-600">
              <strong>Important:</strong> The <code>ytmusicapi</code> backend gives you song details and a <code>videoId</code>, but <strong>not the raw .mp3/.m4a URL</strong> needed for playback.
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-800">
              <h3 className="font-semibold mb-2">The Solution: Stream Extraction</h3>
              <p className="text-sm mb-4">To play the music in Android, you must extract the direct audio stream URL from the YouTube videoId. You have two options:</p>
              
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 border border-amber-100">
                  <h4 className="font-semibold text-neutral-900 text-sm mb-1">Option A: Android Side (Recommended for speed)</h4>
                  <p className="text-xs text-neutral-600">Use a library like <strong>youtubedl-android</strong> (yaazhini) or <strong>NewPipe Extractor</strong> directly inside your Android app to convert the videoId into a playable URL.</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-amber-100">
                  <h4 className="font-semibold text-neutral-900 text-sm mb-1">Option B: Backend Side</h4>
                  <p className="text-xs text-neutral-600">Add a new endpoint to your Python backend using <code>yt-dlp</code> (Python library) that takes a videoId and returns the direct audio URL, then call it from the app.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Step 3: ExoPlayer Setup */}
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
          <div className="bg-neutral-900 px-6 py-4 border-b border-neutral-800 flex items-center gap-3">
            <PlayCircle className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-semibold text-white">3. Playing Audio with ExoPlayer (Media3)</h2>
          </div>
          <div className="p-6 space-y-4">
            <p className="text-neutral-600">Once you have the extracted audio stream URL (from Option A or Option B), pass it to Android's modern media player: Jetpack Media3 (ExoPlayer).</p>
            <div className="bg-neutral-50 rounded-lg border border-neutral-200 p-4 overflow-x-auto">
              <pre className="text-sm text-neutral-800">
{`// 1. Add dependency in your app's build.gradle
implementation("androidx.media3:media3-exoplayer:1.2.0")

// 2. Play the music in your ViewModel or MediaSession Service
val player = ExoPlayer.Builder(context).build()

// 3. Use the extracted direct audio URL (NOT the standard youtube link)
val audioStreamUrl = "https://rr4---sn-....googlevideo.com/videoplayback?..."

val mediaItem = MediaItem.fromUri(audioStreamUrl)
player.setMediaItem(mediaItem)
player.prepare()
player.play()`}
              </pre>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
