import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navigation />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/workouts" element={<Workouts />} />
            <Route path="/nutrition" element={<Nutrition />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/features" element={<Features />} />
            <Route path="/ai-workout" element={<AIWorkoutGenerator />} />
            <Route path="/form-correction" element={<FormCorrection />} />
            <Route path="/mobility-score" element={<MobilityScore />} />
            <Route path="/smart-streak" element={<SmartStreak />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
