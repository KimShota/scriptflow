import { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom'; 
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';

// define options for pasing and audio
const PACING_OPTIONS = ['fast', 'medium', 'slow']; 
const AUDIO_OPTIONS = ['mix', 'voiceover', 'trending_sounds', 'dialogue_bg_music', 'dialogue_only', 'no_voice', 'custom']; 

const emptyForm = {
  creatorName: '',
  reelLink: '',
  views: '',
  hookTitle: '',
  hookVisual: '',
  hookVerbal: '',
  storyArc: '',
  pacing: 'fast',
  cta: '',
  format: '',
  duration: '',
  audio: 'voiceover',
  audioCustom: '',
  notes: ''
}

export default function AnalysisPage(){
    const navigate = useNavigate(); 
    const { token } = useAuth()
    const [analyses, setAnalyses] = useState([])
    const [loading, setLoading] = useState(true)
    const [panelOpen, setPanelOpen] = useState(false)
    const [form, setForm] = useState(emptyForm)
    const [saving, setSaving] = useState(false)
    const [search, setSearch] = useState('')
    const [pacingFilter, setPacingFilter] = useState('all')
    const [audioFilter, setAudioFilter] = useState('all')
    const [toast, setToast] = useState(null)
    const [editingId, setEditingId] = useState(null); 
    const [selectedIds, setSelectedIds] = useState([]); 
    const [summary, setSummary] = useState(''); 
    const [summarizing, setSummarizing] = useState(false); 
    const [summaryOpen, setSummaryOpen] = useState(false); 

    // fetch all the analyses when component loads for the first time
    useEffect(() => {
        fetchAnalyses(); 
    }, []); 

    const fetchAnalyses = async () => {
        try{
            // send http request to the analysis api
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/analysis`, {
                headers: { Authorization: `Bearer ${token}` }
            }); 
            
            const data = await res.json(); 
            if (res.ok){
                setAnalyses(data); 
            }
        } catch (error){
            console.error('Failed to fetch analyses', error); 
        } finally{
            setLoading(false); 
        }
    }

    // reflect changes on the form 
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value }); 
    }

    // function to edit or save an analysis
    const handleSave = async () => {
        if (!form.creatorName.trim()) {
            setToast({ message: 'Creator name is required', type: 'error' })
            return
        }
        setSaving(true); 
        
        try {
            // get the right URL (editing or saving)
            const url = editingId
                ? `${import.meta.env.VITE_API_URL}/api/analysis/${editingId}`
                : `${import.meta.env.VITE_API_URL}/api/analysis`

            // sent HTTP request to edit or save analysis
            const res = await fetch(url, {
                method: editingId ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...form,
                    views: form.views ? parseInt(form.views.toString().replace(/[^0-9]/g, '')) : null
                })
            }); 

            const data = await res.json(); 
            if (!res.ok) {
                setToast({ message: data.error || 'Failed to save', type: 'error' }); 
                return; 
            }

            // edit or save
            if (editingId) {
                setAnalyses(analyses.map(a => a.id === editingId ? data : a)); 
                setToast({ message: 'Analysis updated successfully', type: 'success' }); 
            } else {
                setAnalyses([data, ...analyses]); 
                setToast({ message: 'Analysis saved successfully', type: 'success' }); 
            }

            setForm(emptyForm);
            setEditingId(null);
            setPanelOpen(false); 
        } catch (err) {
            setToast({ message: 'Something went wrong', type: 'error' }); 
        } finally {
            setSaving(false); 
        }
    }

    // function to edit an analysis
    const handleEdit = (analysis) => {
        setEditingId(analysis.id); 
        setForm({
            creatorName: analysis.creatorName || '',
            reelLink: analysis.reelLink || '',
            views: analysis.views || '',
            hookTitle: analysis.hookTitle || '',
            hookVisual: analysis.hookVisual || '',
            hookVerbal: analysis.hookVerbal || '',
            storyArc: analysis.storyArc || '',
            pacing: analysis.pacing || 'fast',
            cta: analysis.cta || '',
            format: analysis.format || '',
            duration: analysis.duration || '',
            audio: analysis.audio || 'voiceover',
            audioCustom: analysis.audioCustom || '',
            notes: analysis.notes || ''
        }); 
        setPanelOpen(true); 
    }

    // function to delete analysis
    const handleDelete = async (id) => {
        if (!confirm('Delete this analysis?')){
            return; 
        }
        try {
            // send HTTP request to DELETE endpoint
            await fetch(`${import.meta.env.VITE_API_URL}/api/analysis/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            }); 
            // remove the deleted analysis 
            setAnalyses(analyses.filter(a => a.id !== id)); 
            setToast({ message: 'Analysis deleted', type: 'success' }); 
        } catch (error){
            setToast({ message: 'Failed to delete', type: 'error' }); 
        }
    }

    // function to handle closing or opening panel
    const handleClosePanel = () => {
        setPanelOpen(false);
        setEditingId(null);
        setForm(emptyForm);
    }

    // function to filter analyses based on creators' name, pacing, or audio
    const filteredAnalyses = analyses.filter(a => {
        const matchesSearch = a.creatorName.toLowerCase().includes(search.toLowerCase()); 
        const matchesPacing = pacingFilter === 'all' || a.pacing === pacingFilter; 
        const matchesAudio = audioFilter === 'all' || a.audio === audioFilter; 
        return matchesSearch && matchesPacing && matchesAudio
    }); 

    // function to return the correct badge for the chosen pacing 
    const pacingBadge = (pacing) => {
        const styles = {
            fast: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
            medium: 'bg-blue-100 text-blue-800 border border-blue-200',
            slow: 'bg-slate-100 text-slate-800 border border-slate-200'
        }
        return styles[pacing] || styles.medium; 
    }

    // function to convert and display the number 
    const formatViews = (views) => {
        if (!views) return '-'
        if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`
        if (views >= 1000) return `${(views / 1000).toFixed(0)}K`
        return views
    }

    // function to return the right audio label 
    const formatAudio = (audio) => {
        const labels = {
            mix: 'Mix',
            voiceover: 'Voiceover',
            trending_sounds: 'Trending Sounds',
            dialogue_bg_music: 'Dialogue + BG Music',
            dialogue_only: 'Dialogue Only',
            no_voice: 'No Voice',
            custom: 'Custom'
        }
        return labels[audio] || audio; 
    }

    // function to select analyses
    const toggleSelect = (id, e) => {
      // stop the event from bubbling up to the parent 
      e.stopPropagation(); 
      setSelectedIds(prev => 
        prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
      ); 
    }

    // function to select all analyses
    const toggleSelectAll = () => {
      if (selectedIds.length === filteredAnalyses.length) {
        setSelectedIds([]); 
      } else {
        setSelectedIds(filteredAnalyses.map(a => a.id)); 
      }
    }

    const handleSummarize = async () => {
      // get all the selected analyses
      const selectedAnalyses = analyses.filter(a => selectedIds.includes(a.id)); 
      setSummarizing(true); 
      try {
        // send http request to summarize-analysis endpoint with post request 
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/gemini/summarize-analysis`, {
          method: 'POST', 
          headers: {
            'Content-Type': 'application/json', 
            Authorization: `Bearer ${token}`
          }, 
          body: JSON.stringify({ analyses: selectedAnalyses })
        }); 
        const data = await res.json(); 
        if (!res.ok){
          setToast({ message: data.error || 'Failed to summarize', type: 'error' }); 
          return; 
        }
        setSummary(data.summary); 
        setSummaryOpen(true); 
      } catch (error){
        setToast({ message: 'Something went wrong', type: 'error' }); 
      } finally{
        setSummarizing(false); 
      }
    }

    return (
    <div className="min-h-screen" style={{ backgroundColor: '#f7f9fb' }}>

      {/* Top Nav */}
      <header className="bg-white border-b sticky top-0 z-50" style={{ borderColor: '#c6c6cd' }}>
        <div className="flex justify-between items-center h-16 px-10 w-full max-w-[1200px] mx-auto">
          <div className="flex items-center gap-8">
            <span className="text-lg font-black text-black">ScriptFlow</span>
            <nav className="hidden md:flex gap-4">
              <span className="text-sm font-semibold text-black border-b-2 border-black pb-1">Creator Analysis</span>
              <button
                onClick={() => navigate('/dashboard')}
                className="text-sm font-medium hover:text-black transition-colors"
                style={{ color: '#45464d' }}
              >
                Back to Dashboard
              </button>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <button className="material-symbols-outlined p-2 rounded-full hover:bg-gray-100 transition-colors" style={{ color: '#45464d' }}>
              settings
            </button>
            <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white text-xs font-bold">S</div>
          </div>
        </div>
      </header>

      <main className="px-10 py-8 max-w-[1200px] mx-auto">

        {/* Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black mb-2">Creator Analysis</h1>
          <p className="text-base" style={{ color: '#45464d' }}>Track and analyze what works for top creators in your niche.</p>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-end justify-between mb-6 bg-white p-4 rounded-lg border" style={{ borderColor: '#c6c6cd' }}>
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: '#45464d' }}>Search Creator</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: '#45464d' }}>search</span>
                <input
                  type="text"
                  placeholder="Search by name..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-64 pl-10 pr-4 py-2 border rounded text-sm focus:outline-none focus:border-black"
                  style={{ borderColor: '#c6c6cd' }}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: '#45464d' }}>Pacing</label>
              <select
                value={pacingFilter}
                onChange={e => setPacingFilter(e.target.value)}
                className="px-3 py-2 border rounded text-sm focus:outline-none focus:border-black"
                style={{ borderColor: '#c6c6cd' }}
              >
                <option value="all">All</option>
                {PACING_OPTIONS.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: '#45464d' }}>Audio Type</label>
              <select
                value={audioFilter}
                onChange={e => setAudioFilter(e.target.value)}
                className="px-3 py-2 border rounded text-sm focus:outline-none focus:border-black"
                style={{ borderColor: '#c6c6cd' }}
              >
                <option value="all">All</option>
                {AUDIO_OPTIONS.map(a => <option key={a} value={a}>{formatAudio(a)}</option>)}
              </select>
            </div>
          </div>
          <button
            onClick={() => setPanelOpen(true)}
            className="bg-black text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            Add Analysis
          </button>
        </div>

        {selectedIds.length > 0 && (
          <div className="flex items-center gap-3 mb-4 px-4 py-3 bg-black text-white rounded-lg">
            <span className="text-sm font-medium">{selectedIds.length} creator{selectedIds.length > 1 ? 's' : ''} selected</span>
            <button
              onClick={handleSummarize}
              disabled={summarizing}
              className="ml-auto flex items-center gap-2 bg-white text-black px-4 py-1.5 rounded font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-sm">auto_awesome</span>
              {summarizing ? 'Summarizing...' : 'Summarize with AI'}
            </button>
            <button
              onClick={() => setSelectedIds([])}
              className="material-symbols-outlined text-sm hover:opacity-70 transition-opacity"
            >
              close
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredAnalyses.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 bg-white border rounded-xl text-center" style={{ borderColor: '#c6c6cd' }}>
            <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: '#f2f4f6' }}>
              <span className="material-symbols-outlined text-4xl text-black">analytics</span>
            </div>
            <h2 className="text-2xl font-semibold text-black mb-2">No analyses yet</h2>
            <p className="text-base mb-8 max-w-md" style={{ color: '#45464d' }}>Start tracking what works for top creators in your niche.</p>
            <button
              onClick={() => setPanelOpen(true)}
              className="bg-black text-white px-6 py-3 rounded-lg text-sm font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              Add Analysis
            </button>
          </div>
        )}

        {/* Table */}
        {!loading && filteredAnalyses.length > 0 && (
          <div className="bg-white border rounded-xl overflow-hidden" style={{ borderColor: '#c6c6cd' }}>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse" style={{ minWidth: '1200px' }}>
                <thead style={{ backgroundColor: '#f2f4f6' }}>
                  <tr className="border-b" style={{ borderColor: '#c6c6cd' }}>
                    <th className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.length === filteredAnalyses.length && filteredAnalyses.length > 0}
                        onChange={toggleSelectAll}
                        className="cursor-pointer"
                      />
                    </th>
                    {['Creator', 'Views', 'Title Hook', 'Visual Hook', 'Verbal Hook', 'Story Arc', 'Pacing', 'CTA', 'Format', 'Duration', 'Audio', 'Notes', ''].map(h => (
                      <th key={h} className="px-4 py-3 text-xs font-medium whitespace-nowrap" style={{ color: '#45464d' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredAnalyses.map((a, i) => (
                    <tr
                      key={a.id}
                      onClick={() => handleEdit(a)}
                      className="border-b hover:bg-gray-50 transition-colors group"
                      style={{ borderColor: '#c6c6cd', backgroundColor: i % 2 === 0 ? '#ffffff' : '#f7f9fb' }}
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(a.id)}
                          onChange={(e) => toggleSelect(a.id, e)}
                          onClick={(e) => e.stopPropagation()}
                          className="cursor-pointer"
                        />
                      </td>
                      <td className="px-4 py-3 font-medium text-sm text-black">{a.creatorName}</td>
                      <td className="px-4 py-3 text-sm" style={{ color: '#45464d' }}>{formatViews(a.views)}</td>
                      <td className="px-4 py-3 text-sm max-w-[150px] truncate">{a.hookTitle || '-'}</td>
                      <td className="px-4 py-3 text-sm max-w-[150px] truncate">{a.hookVisual || '-'}</td>
                      <td className="px-4 py-3 text-sm max-w-[150px] truncate">{a.hookVerbal || '-'}</td>
                      <td className="px-4 py-3 text-sm max-w-[150px] truncate">{a.storyArc || '-'}</td>
                      <td className="px-4 py-3">
                        {a.pacing && (
                          <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase ${pacingBadge(a.pacing)}`}>
                            {a.pacing}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm max-w-[120px] truncate">{a.cta || '-'}</td>
                      <td className="px-4 py-3 text-sm">{a.format || '-'}</td>
                      <td className="px-4 py-3 text-sm">{a.duration || '-'}</td>
                      <td className="px-4 py-3 text-sm">{a.audio ? formatAudio(a.audio) : '-'}</td>
                      <td className="px-4 py-3 text-sm max-w-[150px] truncate italic" style={{ color: '#76777d' }}>{a.notes || '-'}</td>
                      <td className="px-4 py-3">
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                handleDelete(a.id)
                            }}
                            className="material-symbols-outlined opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all text-sm"
                            style={{ color: '#45464d' }}
                        >
                          delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Backdrop */}
      {panelOpen && (
        <div
          className="fixed inset-0 z-40"
          style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}
          onClick={() => setPanelOpen(false)}
        />
      )}

      {/* Slide-in Panel */}
      <aside
        className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 border-l flex flex-col transition-transform duration-300"
        style={{
          borderColor: '#c6c6cd',
          transform: panelOpen ? 'translateX(0)' : 'translateX(100%)'
        }}
      >
        <div className="flex justify-between items-center p-6 border-b" style={{ borderColor: '#c6c6cd' }}>
          <h2 className="text-lg font-semibold text-black">
            {editingId ? 'Edit Analysis' : 'Add Analysis'}
          </h2>
          <button onClick={handleClosePanel} className="material-symbols-outlined hover:text-black transition-colors" style={{ color: '#45464d' }}>close</button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: '#45464d' }}>Creator Name *</label>
            <input name="creatorName" value={form.creatorName} onChange={handleChange} placeholder="e.g. Alex Hormozi" className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:border-black" style={{ borderColor: '#c6c6cd' }} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: '#45464d' }}>Reel Link</label>
            <input name="reelLink" value={form.reelLink} onChange={handleChange} placeholder="https://instagram.com/reels/..." className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:border-black" style={{ borderColor: '#c6c6cd' }} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: '#45464d' }}>Views</label>
              <input name="views" value={form.views} onChange={handleChange} placeholder="2400000" className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:border-black" style={{ borderColor: '#c6c6cd' }} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: '#45464d' }}>Duration</label>
              <input name="duration" value={form.duration} onChange={handleChange} placeholder="45s" className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:border-black" style={{ borderColor: '#c6c6cd' }} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: '#45464d' }}>Title Hook</label>
            <textarea name="hookTitle" value={form.hookTitle} onChange={handleChange} placeholder="Text appearing on screen..." rows={2} className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:border-black" style={{ borderColor: '#c6c6cd' }} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: '#45464d' }}>Visual Hook</label>
            <input name="hookVisual" value={form.hookVisual} onChange={handleChange} placeholder="What happens in first 3s?" className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:border-black" style={{ borderColor: '#c6c6cd' }} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: '#45464d' }}>Verbal Hook</label>
            <input name="hookVerbal" value={form.hookVerbal} onChange={handleChange} placeholder="First words spoken..." className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:border-black" style={{ borderColor: '#c6c6cd' }} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: '#45464d' }}>Story Arc</label>
            <input name="storyArc" value={form.storyArc} onChange={handleChange} placeholder="e.g. Problem → Solution → CTA" className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:border-black" style={{ borderColor: '#c6c6cd' }} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: '#45464d' }}>Pacing</label>
              <select name="pacing" value={form.pacing} onChange={handleChange} className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:border-black" style={{ borderColor: '#c6c6cd' }}>
                {PACING_OPTIONS.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: '#45464d' }}>Audio</label>
              <select name="audio" value={form.audio} onChange={handleChange} className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:border-black" style={{ borderColor: '#c6c6cd' }}>
                {AUDIO_OPTIONS.map(a => <option key={a} value={a}>{formatAudio(a)}</option>)}
              </select>
            </div>
          </div>
          {form.audio === 'custom' && (
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: '#45464d' }}>Custom Audio</label>
              <input name="audioCustom" value={form.audioCustom} onChange={handleChange} placeholder="Describe the audio..." className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:border-black" style={{ borderColor: '#c6c6cd' }} />
            </div>
          )}
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: '#45464d' }}>CTA</label>
            <input name="cta" value={form.cta} onChange={handleChange} placeholder="Call to action used..." className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:border-black" style={{ borderColor: '#c6c6cd' }} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: '#45464d' }}>Format</label>
            <input name="format" value={form.format} onChange={handleChange} placeholder="e.g. Talking Head, B-roll" className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:border-black" style={{ borderColor: '#c6c6cd' }} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: '#45464d' }}>Notes</label>
            <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="Key takeaways..." rows={3} className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:border-black" style={{ borderColor: '#c6c6cd' }} />
          </div>
        </div>

        <div className="p-6 border-t flex gap-3" style={{ borderColor: '#c6c6cd', backgroundColor: '#f2f4f6' }}>
          <button onClick={handleClosePanel} className="flex-1 px-4 py-2 border rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors" style={{ borderColor: '#c6c6cd', color: '#45464d' }}>Cancel</button>
          <button onClick={handleSave} disabled={saving} className="flex-1 px-4 py-2 bg-black text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50">
            {saving ? 'Saving...' : 'Save Analysis'}
          </button>
        </div>
      </aside>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {summaryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col mx-4">
            <div className="flex justify-between items-center p-6 border-b" style={{ borderColor: '#c6c6cd' }}>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-black">auto_awesome</span>
                <h2 className="text-lg font-semibold text-black">AI Analysis Summary</h2>
              </div>
              <button
                onClick={() => setSummaryOpen(false)}
                className="material-symbols-outlined hover:text-black transition-colors"
                style={{ color: '#45464d' }}
              >
                close
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-3">
                {summary.split('\n').map((line, i) => {
                  // heading with ###
                  if (line.startsWith('### ')) {
                    return (
                      <h3 key={i} className="font-bold text-black text-base mt-6 mb-2 first:mt-0">
                        {line.replace('### ', '')}
                      </h3>
                    )
                  }
                  // bold text with **text**
                  if (line.startsWith('* **') || line.startsWith('- **')) {
                    const content = line.replace(/^\* |^- /, '')
                    const parts = content.split(/\*\*(.*?)\*\*/g)
                    return (
                      <p key={i} className="text-sm flex gap-2" style={{ color: '#191c1e' }}>
                        <span className="text-black mt-0.5">•</span>
                        <span>
                          {parts.map((part, j) =>
                            j % 2 === 1
                              ? <strong key={j} className="font-semibold text-black">{part}</strong>
                              : part
                          )}
                        </span>
                      </p>
                    )
                  }
                  // regular bullet
                  if (line.startsWith('* ') || line.startsWith('- ')) {
                    return (
                      <p key={i} className="text-sm flex gap-2" style={{ color: '#191c1e' }}>
                        <span className="text-black mt-0.5">•</span>
                        <span>{line.replace(/^\* |^- /, '')}</span>
                      </p>
                    )
                  }
                  // empty line
                  if (line.trim() === '') return null
                  // regular paragraph
                  return (
                    <p key={i} className="text-sm" style={{ color: '#45464d' }}>{line}</p>
                  )
                })}
              </div>
            </div>
            <div className="p-6 border-t" style={{ borderColor: '#c6c6cd', backgroundColor: '#f2f4f6' }}>
              <button
                onClick={() => setSummaryOpen(false)}
                className="w-full bg-black text-white py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  ); 
}