import { AlertTriangle, Key, Server, Download, CheckCircle } from 'lucide-react';

export default function GuideView() {
  return (
    <div className="flex-1 p-6 sm:p-8 overflow-y-auto pb-32">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-2xl p-8 text-white shadow-lg">
          <h1 className="text-3xl font-bold mb-4">Backend Deployment Fixes & Guide</h1>
          <p className="text-blue-100 text-lg">
            Aapke Render deployment se related sabhi problems ka solution yaha hai.
          </p>
        </div>

        {/* Not Found Issue */}
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
          <div className="bg-neutral-900 px-6 py-4 flex items-center gap-3">
            <Server className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl font-semibold text-white">1. Root URL <code>{`{"detail": "Not Found"}`}</code> Kyu Aa Raha Hai?</h2>
          </div>
          <div className="p-6 text-neutral-800 space-y-4">
            <p>
              Jab aap <code className="bg-neutral-100 text-red-600 px-1 py-0.5 rounded">https://backend-by-vievk-ytmusicapi.onrender.com</code> open karte hain, toh FastAPI default me 404 Not Found return karta hai agar humne home page (<code>/</code>) banaya nahi ho.
            </p>
            <div className="bg-green-50 border border-green-200 p-4 rounded-xl flex gap-4">
              <CheckCircle className="text-green-600 w-6 h-6 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-green-900">Solution (Maine Fix Kar Diya Hai)</h4>
                <p className="text-green-800 text-sm mt-1">
                  Maine backend code me <code>/</code> aur <code>/health</code> route add kar diye hain. Ab aapko bas is naye code ko export karke apne Render/GitHub par wapas push karna hai. Uske baad aapko ek Welcome message dikhega Not Found ki jagah!
                </p>
              </div>
            </div>
            <p className="font-medium mt-4">Abhi ke liye aap sahi URLs visit kar sakte ho:</p>
            <ul className="list-disc pl-6 space-y-2 text-sm text-blue-600">
              <li><a href="https://backend-by-vievk-ytmusicapi.onrender.com/docs" target="_blank" rel="noreferrer" className="hover:underline">/docs (Swagger UI yaha hai)</a></li>
              <li><a href="https://backend-by-vievk-ytmusicapi.onrender.com/api/v1/home" target="_blank" rel="noreferrer" className="hover:underline">/api/v1/home (Home API data)</a></li>
            </ul>
          </div>
        </div>

        {/* SECRET_KEY Issue */}
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
          <div className="bg-neutral-900 px-6 py-4 flex items-center gap-3">
            <Key className="w-6 h-6 text-yellow-400" />
            <h2 className="text-xl font-semibold text-white">2. `SECRET_KEY` Kya Hai Aur Iska Kya Karu?</h2>
          </div>
          <div className="p-6 text-neutral-800 space-y-4">
            <p>
              <strong>SECRET_KEY</strong> ek bahut bada random password/string hota hai jo aapka backend use karta hai security ke liye (jaise users ko login karwana aur JWT tokens ko encrypt karna).
            </p>
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl">
              <h4 className="font-bold text-yellow-900 mb-2">Aapko kya karna hai:</h4>
              <ol className="list-decimal pl-4 space-y-2 text-sm text-yellow-800">
                <li>Render dashboard me apne Web Service par jao.</li>
                <li>Left menu me <strong>Environment</strong> tab par click karo.</li>
                <li><strong>Add Environment Variable</strong> par click karo.</li>
                <li>Key me likho: <code>SECRET_KEY</code></li>
                <li>Value me likho: <code>vmusic_super_secret_key_2026_vivek_dalvi</code> (Ya koi bhi lamba password).</li>
                <li>Save Changes par click karo.</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Action Item */}
        <div className="bg-blue-50 rounded-2xl shadow-sm border border-blue-200 overflow-hidden">
          <div className="p-6 flex items-start gap-4">
            <div className="bg-blue-600 text-white p-3 rounded-full flex-shrink-0">
              <Download className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-blue-900 mb-2">Final Step: Naya Code Deploy Karo</h3>
              <p className="text-blue-800 mb-4">
                Maine search error aur Not Found error dono theek kar diye hain <code>backend/</code> folder me. Lekin aapka live Render server abhi purana code chala raha hai.
              </p>
              <ul className="space-y-2 text-sm text-blue-900 font-medium bg-white/50 p-4 rounded-lg">
                <li>1. AI Studio me upar se <strong>Export &rarr; ZIP</strong> karo.</li>
                <li>2. ZIP extract karke naya <code>backend</code> folder apne GitHub repo me push (upload) karo.</li>
                <li>3. Render apne aap naya code detect karke build kar dega.</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
