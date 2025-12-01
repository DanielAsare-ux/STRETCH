import { useState } from 'react';
import { Flame, Target, Trophy, Clock, ArrowRight, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import WorkoutSession from '../components/WorkoutSession';
import './Home.css';

function Home() {
  const { appData } = useAppContext();
  const [activeWorkout, setActiveWorkout] = useState(null);

  const todayStats = {
    calories: appData.todayStats.calories,
    caloriesGoal: 600,
    workouts: appData.todayStats.workouts,
    streak: appData.todayStats.streak,
    activeMinutes: appData.todayStats.activeMinutes
  };

  const quickWorkouts = [
    { id: 1, name: 'Morning Stretch', duration: 15, durationLabel: '15 min', difficulty: 'Easy', image: '🧘', category: 'flexibility', exercises: 6, calories: 50 },
    { id: 2, name: 'HIIT Cardio', duration: 20, durationLabel: '20 min', difficulty: 'Hard', image: '🏃', category: 'hiit', exercises: 8, calories: 200 },
    { id: 3, name: 'Calisthenics Basics', duration: 20, durationLabel: '20 min', difficulty: 'Easy', image: '🤸', category: 'calisthenics', exercises: 8, calories: 150 },
  ];

  const achievements = appData.achievements;

  const handleStartWorkout = (workout) => {
    setActiveWorkout(workout);
  };

  const handleCloseWorkout = () => {
    setActiveWorkout(null);
  };

  return (
    <div className="home">
      <header className="home-header">
        <div className="welcome-section">
          <h1>Welcome Back! 💪</h1>
          <p>Ready to crush your fitness goals today?</p>
        </div>
        <div className="date-display">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </div>
      </header>

      <section className="stats-grid">
        <div className="stat-card calories">
          <div className="stat-icon">
            <Flame />
          </div>
          <div className="stat-info">
            <span className="stat-value">{todayStats.calories}</span>
            <span className="stat-label">Calories Burned</span>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${(todayStats.calories / todayStats.caloriesGoal) * 100}%` }}
              />
            </div>
            <span className="stat-goal">Goal: {todayStats.caloriesGoal} cal</span>
          </div>
        </div>

        <div className="stat-card workouts">
          <div className="stat-icon">
            <Target />
          </div>
          <div className="stat-info">
            <span className="stat-value">{todayStats.workouts}</span>
            <span className="stat-label">Workouts Today</span>
          </div>
        </div>

        <div className="stat-card streak">
          <div className="stat-icon">
            <Trophy />
          </div>
          <div className="stat-info">
            <span className="stat-value">{todayStats.streak}</span>
            <span className="stat-label">Day Streak 🔥</span>
          </div>
        </div>

        <div className="stat-card active">
          <div className="stat-icon">
            <Clock />
          </div>
          <div className="stat-info">
            <span className="stat-value">{todayStats.activeMinutes}</span>
            <span className="stat-label">Active Minutes</span>
          </div>
        </div>
      </section>

      <section className="quick-workouts">
        <div className="section-header">
          <h2>Quick Workouts</h2>
          <Link to="/workouts" className="see-all">
            See All <ArrowRight size={16} />
          </Link>
        </div>
        <div className="workout-cards">
          {quickWorkouts.map(workout => (
            <div key={workout.id} className="workout-card">
              <div className="workout-emoji">{workout.image}</div>
              <div className="workout-info">
                <h3>{workout.name}</h3>
                <div className="workout-meta">
                  <span className="workout-duration">{workout.durationLabel}</span>
                  <span className={`workout-difficulty ${workout.difficulty.toLowerCase()}`}>
                    {workout.difficulty}
                  </span>
                </div>
              </div>
              <button 
                className="play-button" 
                aria-label={`Start ${workout.name}`}
                onClick={() => handleStartWorkout(workout)}
              >
                <Play size={20} />
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="achievements-section">
        <div className="section-header">
          <h2>Achievements</h2>
          <Link to="/progress" className="see-all">
            View All <ArrowRight size={16} />
          </Link>
        </div>
        <div className="achievements-grid">
          {achievements.map(achievement => (
            <div 
              key={achievement.id} 
              className={`achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}`}
            >
              <span className="achievement-icon">{achievement.icon}</span>
              <span className="achievement-name">{achievement.name}</span>
              {!achievement.unlocked && <span className="lock-badge">🔒</span>}
            </div>
          ))}
        </div>
      </section>

      <section className="motivation-banner">
        <div className="motivation-content">
          <h2>Keep Going!</h2>
          <p>You&apos;re only {Math.max(0, 5 - todayStats.workouts)} workouts away from your weekly goal!</p>
          <Link to="/workouts" className="cta-button">Start Workout</Link>
        </div>
      </section>

      {activeWorkout && (
        <WorkoutSession
          workout={activeWorkout}
          onClose={handleCloseWorkout}
          onComplete={handleCloseWorkout}
        />
      )}
    </div>
  );
}

export default Home;
