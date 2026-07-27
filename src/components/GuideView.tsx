import { AlertTriangle, Key, Server, Smartphone, CheckCircle, Code, Play } from 'lucide-react';

export default function GuideView() {
  return (
    <div className="flex-1 p-6 sm:p-8 overflow-y-auto pb-32">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-gradient-to-r from-green-700 to-green-600 rounded-2xl p-8 text-white shadow-lg">
          <h1 className="text-3xl font-bold mb-4">🎉 Backend is Live & Working!</h1>
          <p className="text-green-100 text-lg">
            Aapne successfully code deploy kar diya hai. Ab backend bilkul sahi chal raha hai. Niche Android me connect karne ka pura guide hai.
          </p>
        </div>

        {/* Root Status */}
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
          <div className="bg-neutral-900 px-6 py-4 flex items-center gap-3">
            <Server className="w-6 h-6 text-green-400" />
            <h2 className="text-xl font-semibold text-white">1. Root URL Update</h2>
          </div>
          <div className="p-6 text-neutral-800 space-y-4">
            <div className="bg-green-50 border border-green-200 p-4 rounded-xl flex gap-4">
              <CheckCircle className="text-green-600 w-6 h-6 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-green-900">Success!</h4>
                <p className="text-green-800 mt-1">
                  Aapka bheja hua screenshot bilkul sahi hai. Jo <code>{"{\"message\":\"Welcome to VMusic API\"...}"}</code> aa raha hai, iska matlab aapka API 100% properly host ho chuka hai.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* SECRET_KEY Explanation */}
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
          <div className="bg-neutral-900 px-6 py-4 flex items-center gap-3">
            <Key className="w-6 h-6 text-yellow-400" />
            <h2 className="text-xl font-semibold text-white">2. `SECRET_KEY` Kaise Use Hoga?</h2>
          </div>
          <div className="p-6 text-neutral-800 space-y-4">
            <p>
              Aapka sawal tha ki kya Android app se call karte waqt <code>SECRET_KEY</code> bhejna padega?
            </p>
            <div className="bg-yellow-50 border border-yellow-200 p-5 rounded-xl">
              <h4 className="font-bold text-yellow-900 mb-2">Jawab: NAHI. Aapko app se key nahi bhejni hai.</h4>
              <p className="text-yellow-800 text-sm space-y-2">
                Abhi jo humne backend banaya hai usme <strong>saare music endpoints (search, home, song) PUBLIC hain</strong>. Android app direct URL call kar sakti hai bina kisi password ya key ke.
                <br/><br/>
                <strong>Fir SECRET_KEY kyu rakha?</strong><br/>
                SECRET_KEY server ke andar (internal) use hota hai. Agar future me aap chahte ho ki log app me "Login" karein aur unka data (favorites) save ho, toh server is <code>SECRET_KEY</code> ka use karke ek JWT Token banata hai. Ye security ke liye backend me rakha gaya hai, par Android code me iski zarurat nahi padegi music play karne ke liye.
              </p>
            </div>
          </div>
        </div>

        {/* Android Connection Guide */}
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
          <div className="bg-neutral-900 px-6 py-4 flex items-center gap-3">
            <Smartphone className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl font-semibold text-white">3. Android App Se Kaise Connect Karein (Retrofit)</h2>
          </div>
          <div className="p-6 text-neutral-800 space-y-6">
            <p>
              Android (Kotlin) me apne API ko call karne ka sabse achha tarika <strong>Retrofit</strong> hai. Yaha step-by-step code hai:
            </p>
            
            <div className="space-y-2">
              <h3 className="font-bold text-neutral-900 flex items-center gap-2"><Code className="w-4 h-4 text-blue-500" /> Step A: Dependencies add karo (build.gradle)</h3>
              <pre className="bg-neutral-950 text-neutral-300 p-4 rounded-lg text-sm overflow-x-auto">
{`implementation("com.squareup.retrofit2:retrofit:2.9.0")
implementation("com.squareup.retrofit2:converter-gson:2.9.0")
// Kotlin Coroutines ke liye
implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.7.3")`}
              </pre>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-neutral-900 flex items-center gap-2"><Code className="w-4 h-4 text-blue-500" /> Step B: Data Classes Banao</h3>
              <p className="text-sm text-neutral-600">Aapka backend `{`success, data, message`}` format me response deta hai.</p>
              <pre className="bg-neutral-950 text-neutral-300 p-4 rounded-lg text-sm overflow-x-auto">
{`data class StandardResponse<T>(
    val success: Boolean,
    val data: T,
    val message: String?
)

data class SongItem(
    val videoId: String?,
    val title: String,
    val duration: String?
    // aur fields add kar sakte ho thumbnails etc ke liye
)`}
              </pre>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-neutral-900 flex items-center gap-2"><Code className="w-4 h-4 text-blue-500" /> Step C: Api Interface Banao</h3>
              <pre className="bg-neutral-950 text-neutral-300 p-4 rounded-lg text-sm overflow-x-auto">
{`import retrofit2.http.GET
import retrofit2.http.Query

interface VMusicApi {
    @GET("api/v1/search")
    suspend fun searchMusic(
        @Query("q") query: String
    ): StandardResponse<List<SongItem>>

    @GET("api/v1/home")
    suspend fun getHomeData(): StandardResponse<Any>
}`}
              </pre>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-neutral-900 flex items-center gap-2"><Code className="w-4 h-4 text-blue-500" /> Step D: Retrofit Client Banake Call Karo</h3>
              <pre className="bg-neutral-950 text-neutral-300 p-4 rounded-lg text-sm overflow-x-auto">
{`import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

val retrofit = Retrofit.Builder()
    .baseUrl("https://backend-by-vievk-ytmusicapi.onrender.com/")
    .addConverterFactory(GsonConverterFactory.create())
    .build()

val api = retrofit.create(VMusicApi::class.java)

// Kahi ViewModel ya Repository me coroutine ke andar call karo:
suspend fun fetchArijitSongs() {
    try {
        val response = api.searchMusic("Arijit Singh")
        if (response.success) {
            val songs = response.data
            // Yaha RecyclerView me songs list set kardo
        }
    } catch (e: Exception) {
        // Error handle karo
    }
}`}
              </pre>
            </div>
          </div>
        </div>

        {/* How to play */}
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
          <div className="bg-neutral-900 px-6 py-4 flex items-center gap-3">
            <Play className="w-6 h-6 text-purple-400" />
            <h2 className="text-xl font-semibold text-white">4. Android Par Music PLAY Kaise Karein? (Full Code)</h2>
          </div>
          <div className="p-6 text-neutral-800 space-y-6">
            <p>
              API se aapko sirf <code>videoId</code> milta hai (jaise <code>"kJQP7kiw5Fk"</code>). Android ka <strong>ExoPlayer</strong> direct YouTube videoId ko play nahi kar sakta. Hamein us videoId se <strong>direct audio stream URL (.m4a/.webm)</strong> nikalna hoga. 
            </p>
            <p className="text-sm font-medium">Iske liye sabse best tarika hai <strong>youtubedl-android</strong> library use karna.</p>

            <div className="space-y-2">
              <h3 className="font-bold text-neutral-900 flex items-center gap-2"><Code className="w-4 h-4 text-purple-500" /> Step 1: Add Dependencies (build.gradle)</h3>
              <pre className="bg-neutral-950 text-neutral-300 p-4 rounded-lg text-sm overflow-x-auto">
{`// ExoPlayer (Media3) ke liye
implementation("androidx.media3:media3-exoplayer:1.2.0")

// YoutubeDL ke liye (JitPack repository add karna mat bhulna settings.gradle me)
implementation("com.github.yausername.youtubedl-android:library:0.16.0")`}
              </pre>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-neutral-900 flex items-center gap-2"><Code className="w-4 h-4 text-purple-500" /> Step 2: Initialize YoutubeDL</h3>
              <p className="text-sm text-neutral-600">Apne Application class ya MainActivity ke <code>onCreate()</code> me likho:</p>
              <pre className="bg-neutral-950 text-neutral-300 p-4 rounded-lg text-sm overflow-x-auto">
{`import com.yausername.youtubedl_android.YoutubeDL

try {
    YoutubeDL.getInstance().init(applicationContext)
} catch (e: Exception) {
    Log.e("VMusic", "Failed to initialize youtubedl-android", e)
}`}
              </pre>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-neutral-900 flex items-center gap-2"><Code className="w-4 h-4 text-purple-500" /> Step 3: Extract Audio & Play with ExoPlayer</h3>
              <p className="text-sm text-neutral-600">Ye function background me URL extract karega aur ExoPlayer me set karega:</p>
              <pre className="bg-neutral-950 text-neutral-300 p-4 rounded-lg text-sm overflow-x-auto">
{`import androidx.media3.exoplayer.ExoPlayer
import androidx.media3.common.MediaItem
import com.yausername.youtubedl_android.YoutubeDLRequest
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

// 1. ExoPlayer setup (Activity ya Service me)
val player = ExoPlayer.Builder(context).build()

// 2. Play function
suspend fun playSong(videoId: String) {
    withContext(Dispatchers.IO) {
        try {
            // YouTube Music ka link banayein
            val videoUrl = "https://music.youtube.com/watch?v=$videoId"
            val request = YoutubeDLRequest(videoUrl)
            
            // Sirf best audio mangwayein (video nahi)
            request.addOption("-f", "bestaudio")
            
            // Extract info (is process me 1-2 second lag sakte hain)
            val streamInfo = YoutubeDL.getInstance().getInfo(request)
            
            // Ye raha aapka DIRECT playable audio link!
            val directAudioUrl = streamInfo.url 
            
            withContext(Dispatchers.Main) {
                val mediaItem = MediaItem.fromUri(directAudioUrl)
                player.setMediaItem(mediaItem)
                player.prepare()
                player.play() // Gaana chalu! 🎵
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }
}`}
              </pre>
            </div>

            <div className="bg-blue-50 border border-blue-200 p-5 rounded-xl">
              <h4 className="font-bold text-blue-900 mb-2">💡 Alternative Idea (Backend API)</h4>
              <p className="text-blue-800 text-sm">
                Agar Android me <code>youtubedl-android</code> library use karne me error aaye ya size bada lage, toh hum <strong>Python Backend me ek naya endpoint bana sakte hain</strong> <code>/api/v1/stream/{"{videoId}"}</code>. <br/><br/>
                Backend khud stream URL nikal kar de dega aur Android app me direct ExoPlayer chal jayega. Agar aapko wo chahiye, toh mujhe bata dena, main backend me add kar dunga!
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
