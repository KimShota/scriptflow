import { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 
import Toast from '../components/Toast';

export default function Dashboard(){
  const navigate = useNavigate(); 
  const { token, user, logout } = useAuth(); 
  const [ scripts, setScripts ] = useState([]); 
  const [ loading, setLoading ] = useState(true); 
  const [ filter, setFilter ] = useState('all'); 
  const [ search, setSearch ] = useState(''); 
  const [toast, setToast] = useState(null); 

  // call fetchScripts only the first time when the component loads 
  useEffect(() => {
    fetchScripts(); 
  }, []); 

  const fetchScripts = async () => {
    try {
      // send http request with jwt token to scripts endpoint 
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/scripts`, {
        headers: { Authorization: `Bearer ${token}` }
      }); 
      // get scripts data
      const data = await res.json(); 
      setScripts(data); 
    } catch (err){
      console.error('Failed to fetch scripts', err); 
    } finally{
      setLoading(false);
    }
  }

  // function to delete a script
  const handleDelete = async (id, e) => {
    // prevent event from bubbling up DOM tree 
    e.stopPropagation(); 
    // make sure user wants to delete
    if (!confirm('Are you sure you want to delete this script?')){
      return; 
    }
    try {
      // send HTTP request to DELETE endpoint with jwt token 
      await fetch(`${import.meta.env.VITE_API_URL}/api/scripts/${id}`, {
        method: 'DELETE', 
        headers: { Authorization: `Bearer ${token}` }
      }); 
      // create a brand new array and store all the scripts except for the one we delete
      setScripts(scripts.filter(s => s.id !== id)); 
      setToast({ message: 'Script deleted', type: 'success' }); 
    } catch (err){
      setToast({ message: 'Failed to delete script', type: 'error' }); 
    }
  }

  // function to log user out
  const handleLogout = () => {
    logout(); 
    // go back to landing page
    navigate('/');
  }

  // function to filter scripts 
  const filteredScripts = scripts.filter(script => {
    // show script if filter matches all or its status
    const matchesFilter = filter === 'all' || script.status === filter; 
    // show scripts if they contain the word in the lower case
    const matchesSearch = script.title.toLowerCase().includes(search.toLowerCase()); 
    return matchesFilter && matchesSearch; 
  }); 

  // function to attach corresponding status badge
  const statusBadge = (status) => {
    const styles = {
      draft: { backgroundColor: '#d3e4fe', color: '#38485d' },
      ready: { backgroundColor: '#fcdeb5', color: '#574425' },
      posted: { backgroundColor: '#e0e3e5', color: '#45464d' }
    }
    return styles[status] || styles.draft; 
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f7f9fb' }}>

      {/* Top Nav */}
      <header className="bg-white border-b sticky top-0 z-50" style={{ borderColor: '#c6c6cd' }}>
        <div className="flex justify-between items-center h-16 px-10 w-full max-w-[1200px] mx-auto">
          <div className="flex items-center gap-8">
            <span className="text-lg font-black text-black">ScriptFlow</span>
            <nav className="hidden md:flex gap-4">
              <span className="text-sm font-semibold text-black border-b-2 border-black pb-1">Dashboard</span>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: '#45464d' }}>search</span>
              <input
                type="text"
                placeholder="Search scripts..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-72 pl-10 pr-4 py-2 bg-white border rounded-lg text-sm focus:outline-none focus:border-black transition-colors"
                style={{ borderColor: '#c6c6cd' }}
              />
            </div>
            <button
              onClick={handleLogout}
              className="text-sm font-medium hover:text-black transition-colors"
              style={{ color: '#45464d' }}
            >
              Log out
            </button>
            <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white text-xs font-bold">
              {user?.email?.[0]?.toUpperCase()}
            </div>
          </div>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-64px)]">

        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 border-r sticky top-16 h-[calc(100vh-64px)] p-4 gap-2" style={{ backgroundColor: '#f2f4f6', borderColor: '#c6c6cd' }}>
          <div className="mb-6">
            <div className="flex items-center gap-3 p-2">
              <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-sm">movie_edit</span>
              </div>
              <div>
                <div className="text-sm font-bold text-black">Workspace</div>
                <div className="text-xs" style={{ color: '#45464d' }}>Creative Suite</div>
              </div>
            </div>
          </div>
          <button
            onClick={() => navigate('/scripts/new')}
            className="bg-black text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 mb-4 hover:opacity-90 transition-opacity"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            <span className="text-xs font-medium">Create New Script</span>
          </button>
          <nav className="flex flex-col gap-1">
            <a className="rounded-lg flex items-center gap-3 px-4 py-3 font-semibold text-xs" style={{ backgroundColor: '#d0e1fb', color: '#54647a' }}>
              <span className="material-symbols-outlined text-sm">description</span>
              All Scripts
            </a>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 px-10 py-8">

          {/* Header */}
          <div className="flex flex-col gap-8 mb-8">
            <div>
              <h1 className="text-4xl font-bold text-black mb-2">My Scripts</h1>
              <p className="text-base" style={{ color: '#45464d' }}>Manage your content pipeline and creative drafts.</p>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b" style={{ borderColor: '#c6c6cd' }}>
              {['all', 'draft', 'ready', 'posted'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className="px-4 py-2 text-xs font-medium rounded-full transition-colors capitalize"
                  style={filter === f
                    ? { backgroundColor: '#000000', color: '#ffffff' }
                    : { color: '#45464d' }
                  }
                >
                  {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-24">
              <span className="material-symbols-outlined animate-spin text-4xl" style={{ color: '#45464d' }}>progress_activity</span>
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredScripts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 px-4 bg-white border rounded-xl card-shadow min-h-[500px] text-center" style={{ borderColor: '#c6c6cd' }}>
              <div className="mb-6 w-20 h-20 rounded-full flex items-center justify-center" style={{ backgroundColor: '#f2f4f6' }}>
                <span className="material-symbols-outlined text-4xl text-black">description</span>
              </div>
              <h2 className="text-2xl font-semibold text-black mb-2">No scripts yet</h2>
              <p className="text-base mb-8 max-w-md" style={{ color: '#45464d' }}>
                Start your first short-form script and bring your content ideas to life.
              </p>
              <button
                onClick={() => navigate('/scripts/new')}
                className="bg-black text-white font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                Create New Script
              </button>
            </div>
          )}

          {/* Script Cards Grid */}
          {!loading && filteredScripts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredScripts.map(script => (
                <article
                  key={script.id}
                  onClick={() => navigate(`/scripts/${script.id}`)}
                  className="bg-white border rounded-lg p-6 card-shadow flex flex-col gap-4 group hover:border-black transition-all cursor-pointer"
                  style={{ borderColor: '#c6c6cd' }}
                >
                  <div className="flex justify-between items-start">
                    <span
                      className="text-xs font-medium px-2 py-0.5 rounded uppercase tracking-wider"
                      style={statusBadge(script.status)}
                    >
                      {script.status}
                    </span>
                    <button
                      onClick={(e) => handleDelete(script.id, e)}
                      className="material-symbols-outlined opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all text-sm"
                      style={{ color: '#45464d' }}
                    >
                      delete
                    </button>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-black mb-2">{script.title}</h3>
                    <p className="text-sm line-clamp-2" style={{ color: '#45464d' }}>
                      {script.mission || script.hookTitle || script.storyProblem || 'No description yet'}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: '#c6c6cd' }}>
                    <div className="flex items-center gap-2" style={{ color: '#45464d' }}>
                      <span className="material-symbols-outlined text-sm">calendar_today</span>
                      <span className="text-xs">
                        {new Date(script.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                </article>
              ))}

              {/* Create New Card */}
              <article
                onClick={() => navigate('/scripts/new')}
                className="bg-white border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-black transition-colors min-h-[200px]"
                style={{ borderColor: '#c6c6cd' }}
              >
                <span className="material-symbols-outlined text-4xl" style={{ color: '#45464d' }}>add_circle</span>
                <span className="text-sm font-medium" style={{ color: '#45464d' }}>Start a new script</span>
              </article>
            </div>
          )}
        </main>
      </div>
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