import React, { useState } from 'react';
import { Copy, RefreshCw, Link as LinkIcon, BarChart2, CheckCircle } from 'lucide-react';

function App() {
  const [url, setUrl] = useState('');
  const [shortCode, setShortCode] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStats(null);
    setShortCode(null);

    try {
      const res = await fetch('/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ originalUrl: url }),
      });
      const data = await res.json();
      setShortCode(data.short_code);
    } catch (err) {
      console.error("Error shortening link:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGetStats = async () => {
    if (!shortCode) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/stats/${shortCode}`);
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error("Error fetching stats:", err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    const fullLink = `${window.location.origin}/api/${shortCode}`;
    navigator.clipboard.writeText(fullLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    // Animated Gradient Background
    <div className="min-h-screen flex flex-col items-center justify-center text-white font-sans relative overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900 to-black">
      
      {/* Background Blobs for Glow Effect */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      {/* Main Glass Card */}
      <div className="z-10 bg-gray-900/60 backdrop-blur-xl p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700/50">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-blue-500/10 p-3 rounded-full inline-block mb-3">
            <LinkIcon className="w-8 h-8 text-blue-400" />
          </div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            URLite
          </h1>
          <p className="text-gray-400 text-sm mt-2">Shorten your links securely & fast.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <div className="relative group">
            <input
              type="url"
              placeholder="https://example.com/very-long-url..."
              className="w-full p-4 rounded-xl bg-gray-800/50 border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-white placeholder-gray-500 outline-none transition-all"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
            <div className="absolute inset-0 rounded-xl bg-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none blur-sm -z-10"></div>
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 py-4 rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : 'Shorten URL'}
          </button>
        </form>

        {/* Result Area */}
        {shortCode && (
          <div className="mt-8 animate-fade-in-up">
            <div className="p-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl border border-blue-500/30">
              <div className="bg-gray-900/90 p-4 rounded-lg flex items-center justify-between">
                <a 
                  href={`${window.location.origin}/api/${shortCode}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-400 font-mono text-lg hover:underline truncate mr-4"
                >
                  {window.location.origin}/api/{shortCode}
                </a>
                
                <button 
                  onClick={copyToClipboard}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors relative group"
                  title="Copy to clipboard"
                >
                  {copied ? <CheckCircle className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5 text-gray-400 group-hover:text-white" />}
                </button>
              </div>
            </div>

            {/* Stats Section */}
            <div className="mt-6 pt-6 border-t border-gray-700/50">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-wider flex items-center gap-2">
                  <BarChart2 className="w-4 h-4" /> Analytics
                </h3>
                <button 
                  onClick={handleGetStats}
                  className="text-xs flex items-center gap-1 text-gray-500 hover:text-white transition-colors"
                >
                  <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} /> Refresh
                </button>
              </div>

              {stats ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-800/50 p-3 rounded-xl border border-gray-700/50 text-center">
                    <p className="text-xs text-gray-500 uppercase mb-1">Total Clicks</p>
                    <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                      {stats.clicks}
                    </p>
                  </div>
                  <div className="bg-gray-800/50 p-3 rounded-xl border border-gray-700/50 text-center">
                    <p className="text-xs text-gray-500 uppercase mb-1">Created</p>
                    <p className="text-sm text-gray-300 font-mono mt-1">
                      {new Date(stats.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-center text-gray-600 text-sm italic">Click refresh to see stats</p>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Footer / Copyright */}
      <div className="absolute bottom-4 text-gray-600 text-xs">
        Powered by Microservices & Docker
      </div>
    </div>
  );
}

export default App;