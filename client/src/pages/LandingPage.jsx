import { useNavigate } from 'react-router-dom'

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="font-sans min-h-screen" style={{ backgroundColor: '#f7f9fb', color: '#191c1e' }}>
      
      {/* Top Nav */}
      <nav className="bg-white border-b sticky top-0 z-50" style={{ borderColor: '#c6c6cd' }}>
        <div className="flex justify-between items-center max-w-[1200px] mx-auto px-10 h-16 w-full">
          <span className="text-lg font-black text-black">ScriptFlow</span>
          <div className="flex items-center gap-8">
            <button
              onClick={() => navigate('/login')}
              className="text-sm font-medium hover:text-black transition-colors"
              style={{ color: '#505f76' }}
            >
              Log In
            </button>
            <button
              onClick={() => navigate('/register')}
              className="bg-black text-white text-sm font-medium px-4 py-2 rounded hover:opacity-90 transition-opacity"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="py-24 px-10 overflow-hidden">
          <div className="max-w-[1200px] mx-auto text-center flex flex-col items-center">
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-8 text-xs font-medium"
              style={{ backgroundColor: '#d0e1fb', color: '#54647a' }}
            >
              <span className="material-symbols-outlined text-sm">auto_awesome</span>
              Revolutionizing Scriptwriting
            </div>
            <h1 className="text-5xl md:text-[64px] font-bold text-black mb-4 max-w-4xl leading-tight tracking-tight">
              Write Better Scripts. <br />
              <span style={{ color: '#505f76' }}>Create Better Content.</span>
            </h1>
            <p className="text-base mb-8 max-w-2xl" style={{ color: '#45464d' }}>
              The all-in-one workspace to plan, write, and organize your short-form video scripts. From hook to export, stay organized and creative.
            </p>
            <button
              onClick={() => navigate('/register')}
              className="bg-black text-white text-lg font-semibold px-8 py-4 rounded hover:opacity-90 transition-all mb-16 shadow-lg"
            >
              Get Started — It's Free
            </button>

            {/* App Preview */}
            <div className="relative w-full max-w-[1000px] mt-8 rounded-xl overflow-hidden border shadow-2xl" style={{ borderColor: '#c6c6cd' }}>
              <div className="bg-white p-8 text-left">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {['Morning Routine', 'Tech Review', 'Travel Vlog'].map((title, i) => (
                    <div key={i} className="border rounded-lg p-4" style={{ borderColor: '#c6c6cd' }}>
                      <span
                        className="text-xs font-medium px-2 py-0.5 rounded uppercase"
                        style={{
                          backgroundColor: i === 0 ? '#fcdeb5' : i === 1 ? '#d3e4fe' : '#e0e3e5',
                          color: i === 0 ? '#574425' : i === 1 ? '#38485d' : '#45464d'
                        }}
                      >
                        {i === 0 ? 'Ready' : i === 1 ? 'Draft' : 'Posted'}
                      </span>
                      <h3 className="font-semibold text-black mt-2 mb-1">{title}</h3>
                      <p className="text-xs" style={{ color: '#45464d' }}>Short-form content script...</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-white/40 to-transparent pointer-events-none"></div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 px-10" style={{ backgroundColor: '#f2f4f6' }}>
          <div className="max-w-[1200px] mx-auto">
            <div className="mb-16">
              <h2 className="text-2xl font-semibold text-black mb-2">Designed for the Modern Creator</h2>
              <p className="text-sm" style={{ color: '#45464d' }}>Everything you need to go viral, organized in one place.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-2 bg-white p-8 border rounded-xl flex flex-col justify-between hover:shadow-md transition-shadow" style={{ borderColor: '#c6c6cd' }}>
                <div>
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: '#d0e1fb' }}>
                    <span className="material-symbols-outlined" style={{ color: '#54647a' }}>splitscreen</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Structured Script Templates</h3>
                  <p className="text-sm" style={{ color: '#45464d' }}>Master the structure of viral content with dedicated sections for your hook, story beats, and production notes.</p>
                </div>
                <div className="mt-4 border-t pt-4 flex gap-2" style={{ borderColor: '#c6c6cd' }}>
                  {['HOOK', 'VALUE', 'CTA'].map(tag => (
                    <span key={tag} className="px-2 py-1 rounded text-xs font-medium" style={{ backgroundColor: '#e6e8ea' }}>{tag}</span>
                  ))}
                </div>
              </div>
              <div className="bg-white p-8 border rounded-xl hover:shadow-md transition-shadow" style={{ borderColor: '#c6c6cd' }}>
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: '#d0e1fb' }}>
                  <span className="material-symbols-outlined" style={{ color: '#54647a' }}>monitoring</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Track Your Pipeline</h3>
                <p className="text-sm" style={{ color: '#45464d' }}>Visual status badges to keep your production moving. Draft, Ready, or Posted.</p>
              </div>
              <div className="bg-white p-8 border rounded-xl hover:shadow-md transition-shadow" style={{ borderColor: '#c6c6cd' }}>
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: '#d0e1fb' }}>
                  <span className="material-symbols-outlined" style={{ color: '#54647a' }}>auto_fix</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Grammar Correction</h3>
                <p className="text-sm" style={{ color: '#45464d' }}>AI-powered fixes that maintain your voice while polishing your delivery.</p>
              </div>
              <div className="md:col-span-4 bg-black text-white p-8 rounded-xl flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold mb-2">Built for Short-Form</h3>
                  <p className="opacity-80 text-sm">Stop using horizontal document tools for vertical content. ScriptFlow is optimized specifically for Reels, TikToks, and Shorts.</p>
                </div>
                <div className="flex gap-4">
                  {[['smartphone', 'TikTok Ready'], ['play_circle', 'Reels Sync']].map(([icon, label]) => (
                    <div key={label} className="bg-white/10 p-4 rounded-lg flex items-center gap-2">
                      <span className="material-symbols-outlined text-white">{icon}</span>
                      <span className="text-sm font-medium">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-24 px-10">
          <div className="max-w-[1200px] mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-black">Simple Workflow, Big Impact</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                ['1', 'Create a new script', 'Start from scratch or use one of our viral-proven frameworks in seconds.'],
                ['2', 'Fill in your framework', 'Draft your hook, add your visual cues, and structure your value points seamlessly.'],
                ['3', 'Save, polish, and post', 'Use AI to refine your tone, track your status, and get ready for the camera.']
              ].map(([num, title, desc]) => (
                <div key={num} className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full border-2 border-black flex items-center justify-center text-3xl font-bold mb-4">{num}</div>
                  <h3 className="text-lg font-semibold mb-2">{title}</h3>
                  <p className="text-sm" style={{ color: '#45464d' }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 px-10">
          <div
            className="max-w-[1000px] mx-auto rounded-2xl p-12 md:p-20 text-center relative overflow-hidden"
            style={{ backgroundColor: '#e0e3e5' }}
          >
            <div className="relative z-10">
              <h2 className="text-4xl font-bold text-black mb-4">Start writing your next viral script today</h2>
              <p className="mb-10 max-w-xl mx-auto" style={{ color: '#45464d' }}>
                Join creators who have streamlined their content creation process with ScriptFlow.
              </p>
              <button
                onClick={() => navigate('/register')}
                className="bg-black text-white text-lg font-semibold px-10 py-4 rounded-full hover:opacity-90 transition-all shadow-xl"
              >
                Get Started
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t" style={{ borderColor: '#c6c6cd' }}>
        <div className="flex flex-col md:flex-row justify-between items-center max-w-[1200px] mx-auto py-8 px-10 w-full">
          <span className="font-bold text-black mb-4 md:mb-0">ScriptFlow</span>
          <span className="text-sm mb-4 md:mb-0" style={{ color: '#505f76' }}>© 2024 ScriptFlow. Professional content management.</span>
          <div className="flex gap-8">
            <a href="#" className="text-xs hover:text-black transition-colors" style={{ color: '#45464d' }}>Support</a>
            <a href="#" className="text-xs hover:text-black transition-colors" style={{ color: '#45464d' }}>Settings</a>
          </div>
        </div>
      </footer>

    </div>
  )
}