import { useState, useEffect } from 'react'; 
import { useNavigate, useParams } from 'react-router-dom'; 
import { useAuth } from '../context/AuthContext'; 
import Toast from '../components/Toast';

export default function ScriptEditor(){
  const navigate = useNavigate(); 
  const { id } = useParams(); // extract only id from the URL 
  const { token } = useAuth(); 
  const isEditing = Boolean(id); 

  // initialize react state to null
  const [form, setForm] = useState({
    title: '',
    mission: '',
    caption: '',
    status: 'draft',
    hookTitle: '',
    hookVisual: '',
    hookVerbal: '',
    storyProblem: '',
    storyPromise: '',
    storyCredibility: '',
    storyDelivery: '',
    storyCta: '',
    footageNeeded: '',
    audio: ''
  }); 
  const [loading, setLoading] = useState(false); 
  const [saving, setSaving] = useState(false); 
  const [saved, setSaved] = useState(false); 
  const [error, setError] = useState(''); 
  const [toast, setToast] = useState(null); 

  // render the corresponding script 
  useEffect(() => {
    if (isEditing){
      fetchScript(); 
    }
  }, [id]); 

  // function to fetch script
  const fetchScript = async () => {
    setLoading(true); 
    try {
      // send http reques to GET endpoint to get the script 
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/scripts/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      }); 
      const data = await res.json(); 
      if (res.ok){
        setForm(data); 
      }
    } catch (err) {
      console.error('Failed to fetch script', err); 
    } finally {
      setLoading(false); 
    }
  }


  // function to update react state for the form 
  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value });
    setSaved(false); 
  }

  // function to save changes
  const handleSave = async () => {
    if (!form.title.trim()){
      setError('Please add a title before saving'); 
      return; 
    }
    setError(''); 
    setSaving(true); 

    try {
      // set URL according to situation
      const url = isEditing
        ? `${import.meta.env.VITE_API_URL}/api/scripts/${id}`
        : `${import.meta.env.VITE_API_URL}/api/scripts`
      
      // send http request to corresponding endpoint
      const res = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST', 
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      }); 
      const data = await res.json(); 
      
      // error handling
      if (!res.ok){
        setError(data.error || 'Failed to save script'); 
        return; 
      }

      // set react state to saved
      setSaved(true); 
      setToast({ message: 'Script saved successfully', type: 'success'}); 
      if (!isEditing){
        navigate(`/scripts/${data.id}`); 
      }
    } catch (err){
      setError('Something went wrong. Please try again.'); 
    } finally{
      setSaving(false); 
    }
  }

  // automatically expand textarea
  useEffect(() => {
    document.querySelectorAll('textarea').forEach(textarea => {
      textarea.style.height = 'auto'
      textarea.style.height = textarea.scrollHeight + 'px'
    })
  }, [form]); 

  // render this if loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f7f9fb' }}>
        <span className="material-symbols-outlined animate-spin text-4xl" style={{ color: '#45464d' }}>progress_activity</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#f7f9fb' }}>

      {/* Top Nav */}
      <header className="bg-white border-b sticky top-0 z-50" style={{ borderColor: '#c6c6cd' }}>
        <div className="flex justify-between items-center h-16 px-10 w-full max-w-[1200px] mx-auto">
          <div className="flex items-center gap-8">
            <span className="text-lg font-black text-black">ScriptFlow</span>
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-1 text-sm font-semibold text-black hover:opacity-70 transition-opacity border-b-2 border-black pb-1"
            >
              ← Back to Dashboard
            </button>
          </div>
          <div className="flex items-center gap-4">
            <button className="material-symbols-outlined p-2 rounded-full hover:bg-gray-100 transition-colors" style={{ color: '#45464d' }}>
              settings
            </button>
            <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white text-xs font-bold">S</div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow py-8 px-10">
        <div className="max-w-[800px] mx-auto">

          {/* Document Header */}
          <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="flex-grow">
              <label className="block text-xs font-medium mb-1 uppercase tracking-wider" style={{ color: '#45464d' }}>
                Script Title
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Untitled Script"
                className="w-full bg-transparent border-none p-0 text-4xl font-bold text-black focus:ring-0 focus:outline-none placeholder-gray-300"
              />
            </div>
            <div className="flex items-center gap-2 mb-2">
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="border rounded-full px-4 py-1 text-xs font-medium focus:outline-none focus:border-black cursor-pointer"
                style={{ backgroundColor: '#f2f4f6', borderColor: '#c6c6cd', color: '#191c1e' }}
              >
                <option value="draft">Draft</option>
                <option value="ready">Ready</option>
                <option value="posted">Posted</option>
              </select>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 px-4 py-3 rounded-lg text-sm" style={{ backgroundColor: '#ffdad6', color: '#93000a' }}>
              {error}
            </div>
          )}

          {/* Editor Canvas */}
          <div className="bg-white p-12 rounded-lg space-y-8" style={{ boxShadow: '0 4px 12px rgba(15, 23, 42, 0.03)', border: '1px solid #E2E8F0' }}>

            {/* Section 1: Basics */}
            <section>
              <div className="flex items-center justify-between pb-2 mb-6 border-b" style={{ borderColor: '#eceef0' }}>
                <h2 className="text-lg font-semibold text-black">Basics</h2>
                <span className="text-xs font-medium" style={{ color: '#45464d' }}>Step 1 of 4</span>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium mb-2" style={{ color: '#191c1e' }}>Mission</label>
                  <textarea
                    name="mission"
                    value={form.mission}
                    onChange={handleChange}
                    placeholder="What is the core purpose of this video?"
                    rows={2}
                    className="w-full input-minimal p-4 text-sm rounded"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-2" style={{ color: '#191c1e' }}>Caption</label>
                  <textarea
                    name="caption"
                    value={form.caption}
                    onChange={handleChange}
                    placeholder="Write your social media caption here..."
                    rows={3}
                    className="w-full input-minimal p-4 text-sm rounded"
                  />
                </div>
              </div>
            </section>

            {/* Section 2: Hook */}
            <section>
              <div className="flex items-center justify-between pb-2 mb-6 border-b" style={{ borderColor: '#eceef0' }}>
                <h2 className="text-lg font-semibold text-black">The Hook</h2>
                <span className="text-xs font-medium" style={{ color: '#45464d' }}>Step 2 of 4</span>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium mb-2" style={{ color: '#191c1e' }}>Title Hook</label>
                  <textarea
                    name="hookTitle"
                    value={form.hookTitle}
                    onChange={handleChange}
                    placeholder="Overlay text on screen..."
                    rows={2}
                    className="w-full input-minimal p-4 text-sm rounded"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium mb-2" style={{ color: '#191c1e' }}>Visual Hook</label>
                    <textarea
                      name="hookVisual"
                      value={form.hookVisual}
                      onChange={handleChange}
                      placeholder="Describe the opening shot..."
                      rows={4}
                      className="w-full input-minimal p-4 text-sm rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-2" style={{ color: '#191c1e' }}>Verbal Hook</label>
                    <textarea
                      name="hookVerbal"
                      value={form.hookVerbal}
                      onChange={handleChange}
                      placeholder="The very first line spoken..."
                      rows={4}
                      className="w-full input-minimal p-4 text-sm rounded"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3: Storytelling Framework */}
            <section>
              <div className="flex items-center justify-between pb-2 mb-6 border-b" style={{ borderColor: '#eceef0' }}>
                <h2 className="text-lg font-semibold text-black">Storytelling Framework</h2>
                <span className="text-xs font-medium" style={{ color: '#45464d' }}>Step 3 of 4</span>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium mb-2" style={{ color: '#191c1e' }}>Problem</label>
                    <textarea
                      name="storyProblem"
                      value={form.storyProblem}
                      onChange={handleChange}
                      placeholder="Identify the pain point..."
                      rows={3}
                      className="w-full input-minimal p-4 text-sm rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-2" style={{ color: '#191c1e' }}>Promise</label>
                    <textarea
                      name="storyPromise"
                      value={form.storyPromise}
                      onChange={handleChange}
                      placeholder="What is the resolution?"
                      rows={3}
                      className="w-full input-minimal p-4 text-sm rounded"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-2" style={{ color: '#191c1e' }}>Credibility</label>
                  <textarea
                    name="storyCredibility"
                    value={form.storyCredibility}
                    onChange={handleChange}
                    placeholder="Why should they trust you?"
                    rows={2}
                    className="w-full input-minimal p-4 text-sm rounded"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-2" style={{ color: '#191c1e' }}>Delivery</label>
                  <textarea
                    name="storyDelivery"
                    value={form.storyDelivery}
                    onChange={handleChange}
                    placeholder="The main educational or entertaining content..."
                    rows={6}
                    className="w-full input-minimal p-4 text-sm rounded"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-2" style={{ color: '#191c1e' }}>CTA (Call to Action)</label>
                  <textarea
                    name="storyCta"
                    value={form.storyCta}
                    onChange={handleChange}
                    placeholder="Follow, Link in bio, Comment..."
                    rows={2}
                    className="w-full input-minimal p-4 text-sm rounded"
                  />
                </div>
              </div>
            </section>

            {/* Section 4: Production */}
            <section>
              <div className="flex items-center justify-between pb-2 mb-6 border-b" style={{ borderColor: '#eceef0' }}>
                <h2 className="text-lg font-semibold text-black">Production Notes</h2>
                <span className="text-xs font-medium" style={{ color: '#45464d' }}>Step 4 of 4</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium mb-2" style={{ color: '#191c1e' }}>Footage Needed</label>
                  <textarea
                    name="footageNeeded"
                    value={form.footageNeeded}
                    onChange={handleChange}
                    placeholder="B-roll, screen recordings, location shots..."
                    rows={4}
                    className="w-full input-minimal p-4 text-sm rounded"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-2" style={{ color: '#191c1e' }}>Audio</label>
                  <textarea
                    name="audio"
                    value={form.audio}
                    onChange={handleChange}
                    placeholder="Sound effects, specific background tracks..."
                    rows={4}
                    className="w-full input-minimal p-4 text-sm rounded"
                  />
                </div>
              </div>
            </section>

          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex items-center justify-between pb-8">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-sm font-medium hover:text-black transition-colors"
              style={{ color: '#45464d' }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-black text-white px-8 py-2 rounded font-semibold text-sm hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-sm">
                {saved ? 'check' : saving ? 'progress_activity' : 'save'}
              </span>
              {saved ? 'Saved' : saving ? 'Saving...' : 'Save Script'}
            </button>
          </div>

        </div>
      </main>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  ); 
}
