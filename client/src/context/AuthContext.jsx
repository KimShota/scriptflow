import { createContext, useContext, useState, useEffect } from 'react'; 

// create context object 
const AuthContext = createContext(); 

export function AuthProvider({ children }){
    const [token, setToken] = useState(localStorage.getItem('token')); 
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user'))); 

    // save and update token and user credentials when user logs in
    const login = (token, user) => {
        localStorage.setItem('token', token); 
        localStorage.setItem('user', JSON.stringify(user));
        setToken(token); 
        setUser(user);  
    }

    // clear token and user data stored in local storage when logout 
    const logout = () => {
        localStorage.removeItem('token'); 
        localStorage.removeItem('user');
        setToken(null); 
        setUser(null);  
    }

    // wrap the entire app around with authcontext to make sure that every component carries user data
    return (
        <AuthContext.Provider value={{ token, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

// short-cut function to let components access user data stored inside AuthContext
export function useAuth(){
    return useContext(AuthContext); 
}