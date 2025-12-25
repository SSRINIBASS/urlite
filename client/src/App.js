import React, { useState } from 'react';

function App() {
  const [url, setUrl] = useState('');
  const [shortCode, setShortCode] = useState(null); 
  const [stats, setStats] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Using relative path '/api' works automatically on both localhost and your domain
    const res = await fetch('/api/shorten', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ originalUrl: url }),
    });
    const data = await res.json();
    setShortCode(data.short_code);
    setStats(null); 
  };

  const handleGetStats = async () => {
    if (!shortCode) return;
    const res = await fetch(`/api/stats/${shortCode}`);
    const data = await res.json();
    setStats(data);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white font-sans">
      <div className="bg-gray-800 p-8 rounded-xl shadow-2xl w-96 border border-gray-700">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-400">🚀 URL Shortener</h1>
        
        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            type="url"
            placeholder="Paste long URL here..."
            className="p-3 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500 transition"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
          <button type="submit" className="bg-blue-600 hover:bg-blue-500 py-3 rounded font-bold transition transform hover:scale-105">
            Shorten It
          </button>
        </form>

        {/* Result Area */}
        {shortCode && (
          <div className="mt-8 p-4 bg-gray-900 rounded-lg border border-gray-700 text-center animate-pulse-once">
            <p className="text-gray-400 text-sm mb-2">Your Short Link:</p>
            
            {/* 👇 THIS IS THE FIX: dynamic window.location.origin */}
            <a 
              href={`${window.location.origin}/api/${shortCode}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-green-400 font-mono text-xl hover:underline break-all"
            >
              {window.location.origin}/api/{shortCode}
            </a>

            <div className="mt-6 pt-4 border-t border-gray-700">
              <button 
                onClick={handleGetStats}
                className="text-sm bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-gray-300 transition"
              >
                🔄 Refresh Stats
              </button>
              
              {stats && (
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="bg-gray-800 p-2 rounded">
                    <p className="text-xs text-gray-500 uppercase">Clicks</p>
                    <p className="text-2xl font-bold text-yellow-400">{stats.clicks}</p>
                  </div>
                  <div className="bg-gray-800 p-2 rounded">
                    <p className="text-xs text-gray-500 uppercase">Created</p>
                    <p className="text-xs text-gray-300 mt-2">{new Date(stats.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;