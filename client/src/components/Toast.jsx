import { useEffect } from 'react'; 

export default function Toast({ message, type = 'success', onClose }){
    // set the timer for onClose for 3000ms and remove Toast notification 
    useEffect(() => {
        const timer = setTimeout(onClose, 3000); 
        return () => clearTimeout(timer); 
    }, []); 

    // styles for success and error
    const styles = {
        success: { backgroundColor: '#d0e1fb', color: '#0b1c30' },
        error: { backgroundColor: '#ffdad6', color: '#93000a' }
    }

    return (
        <div
        className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-lg shadow-lg text-sm font-medium transition-all"
        style={styles[type]}
        >
            <span className="material-symbols-outlined text-sm">
                {type === 'success' ? 'check_circle' : 'error'}
            </span>
            {message}
            <button onClick={onClose} className="material-symbols-outlined text-sm ml-2 opacity-60 hover:opacity-100">
                close
            </button>
        </div>
    )
}

