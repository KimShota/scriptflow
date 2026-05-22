import { useState } from 'react'; 
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 

export default function LoginPage(){
    const navigate = useNavigate();
    const { login } = useAuth(); 
    const [form, setForm] = useState({ email: '', password: '' }); 
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    // function to update react state
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value }); 
    }

    const handleSubmit = async (e) => {
        // prevent the browser to reload 
        e.preventDefault(); 
        setError(''); 
        setLoading(true); 

        try {
            const res = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });

            // get response data
            const data = await res.json(); 

            // error handling
            if(!res.ok){
                setError(data.error || 'Login failed'); 
                return; 
            }

            // log user in and navigate them to dashboard
            login(data.token, data.user); 
            navigate('/dashboard'); 
        } catch (err){
            setError('Something went wrong. Please try again.'); 
        } finally {
            setLoading(false); 
        }
    }

    return (
        <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#f7f9fb' }}>

            {/* Nav */}
            <nav className="bg-white border-b sticky top-0 z-50" style={{ borderColor: '#c6c6cd' }}>
                <div className="flex justify-between items-center max-w-[1200px] mx-auto px-10 h-16">
                    <button onClick={() => navigate('/')} className="text-lg font-black text-black">
                        ScriptFlow
                    </button>
                </div>
            </nav>

            {/* Form */}
            <div className="flex-1 flex items-center justify-center px-4 py-16">
                <div className="bg-white border rounded-xl p-10 w-full max-w-md card-shadow" style={{ borderColor: '#c6c6cd' }}>
                    <h1 className="text-2xl font-bold text-black mb-2">Welcome back</h1>
                    <p className="text-sm mb-8" style={{ color: '#45464d' }}>Log in to your ScriptFlow account</p>

                    {error && (
                        <div className="mb-6 px-4 py-3 rounded-lg text-sm" style={{ backgroundColor: '#ffdad6', color: '#93000a' }}>
                        {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <div>
                            <label className="block text-xs font-medium mb-1 uppercase tracking-wider" style={{ color: '#45464d' }}>
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                                required
                                className="w-full px-4 py-3 rounded-lg border text-sm focus:outline-none focus:border-black transition-colors"
                                style={{ borderColor: '#c6c6cd' }}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium mb-1 uppercase tracking-wider" style={{ color: '#45464d' }}>
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                required
                                className="w-full px-4 py-3 rounded-lg border text-sm focus:outline-none focus:border-black transition-colors"
                                style={{ borderColor: '#c6c6cd' }}
                            />
                        </div>
                        <button
                        type="submit"
                        disabled={loading}
                        className="bg-black text-white font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 mt-2"
                        >
                            {loading ? 'Logging in...' : 'Log In'}
                        </button>
                    </form>

                    <p className="text-sm text-center mt-6" style={{ color: '#45464d' }}>
                        Don't have an account?{' '}
                        <Link to="/register" className="font-semibold text-black hover:underline">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

