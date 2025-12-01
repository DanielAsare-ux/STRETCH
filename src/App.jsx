import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Workouts from './pages/Workouts';
import Nutrition from './pages/Nutrition';
import Progress from './pages/Progress';
import Profile from './pages/Profile';
import Features from './pages/Features';
import AIWorkoutGenerator from './pages/AIWorkoutGenerator';
import FormCorrection from './pages/FormCorrection';
import MobilityScore from './pages/MobilityScore';
import SmartStreak from './pages/SmartStreak';
import Login from './pages/Login';
import Register from './pages/Register';
import './App.css';

// Protected Route component
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

// Public Route component (redirects to home if already logged in)
function PublicRoute({ children }) {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return children;
}

function AppContent() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="app">
      {isAuthenticated && <Navigation />}
      <main className={`main-content ${!isAuthenticated ? 'no-nav' : ''}`}>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          <Route path="/register" element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } />
          
          {/* Protected routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
          <Route path="/workouts" element={
            <ProtectedRoute>
              <Workouts />
            </ProtectedRoute>
          } />
          <Route path="/nutrition" element={
            <ProtectedRoute>
              <Nutrition />
            </ProtectedRoute>
          } />
          <Route path="/progress" element={
            <ProtectedRoute>
              <Progress />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/features" element={
            <ProtectedRoute>
              <Features />
            </ProtectedRoute>
          } />
          <Route path="/ai-workout" element={
            <ProtectedRoute>
              <AIWorkoutGenerator />
            </ProtectedRoute>
          } />
          <Route path="/form-correction" element={
            <ProtectedRoute>
              <FormCorrection />
            </ProtectedRoute>
          } />
          <Route path="/mobility-score" element={
            <ProtectedRoute>
              <MobilityScore />
            </ProtectedRoute>
          } />
          <Route path="/smart-streak" element={
            <ProtectedRoute>
              <SmartStreak />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <AppContent />
        </Router>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
