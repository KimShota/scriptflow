import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"; // turn app into SPA, allowing the app to load the component without fully reloading
import { AuthProvider, useAuth } from "./context/AuthContext";
import LandingPage from './pages/LandingPage'; 
import LoginPage from './pages/LoginPage'; 
import RegisterPage from './pages/RegisterPage'; 
import Dashboard from './pages/Dashboard'; 
import ScriptEditor from './pages/ScriptEditor'; 
import AnalysisPage from './pages/AnalysisPage'

// function to let authorized user into the component
function ProtectedRoute({ children }){
  const { token } = useAuth(); // load token from react state 
  return token ? children : <Navigate to="/login" /> // brings user back to login page if not authorized
}

// function to bring user back to dashboard 
function PublicRoute({ children }){
  const { token } = useAuth(); 
  return !token ? children : <Navigate to="/dashboard" />
}

// function to redirect user to the correct component based on user state
function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/scripts/new" element={<ProtectedRoute><ScriptEditor /></ProtectedRoute>} />
      <Route path="/scripts/:id" element={<ProtectedRoute><ScriptEditor /></ProtectedRoute>} />
      <Route path="/analysis" element={<ProtectedRoute><AnalysisPage /></ProtectedRoute>} />
    </Routes>
  )
}

export default function App(){
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  ); 
}