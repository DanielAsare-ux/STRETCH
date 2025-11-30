import { useState, useEffect } from 'react';
import { 
  Flame, 
  Calendar, 
  Award, 
  TrendingUp,
  Shield,
  Zap,
  Check,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import './SmartStreak.css';

function SmartStreak() {
  const [streakData, setStreakData] = useState(() => {
    const saved = localStorage.getItem('streakData');
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      currentStreak: 0,
      longestStreak: 0,
      totalWorkouts: 0,
      streakFreezes: 2,
      lastWorkoutDate: null,
      workoutHistory: {},
      weeklyGoal: 5,
      weeklyCompleted: 0,
      restDaysAllowed: 2,
      achievements: []
    };
  });

  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [showWorkoutModal, setShowWorkoutModal] = useState(false);

  useEffect(() => {
    localStorage.setItem('streakData', JSON.stringify(streakData));
  }, [streakData]);

  // Check streak on initial load only
  useEffect(() => {
    const checkStreak = () => {
      const today = new Date().toISOString().split('T')[0];
      const saved = localStorage.getItem('streakData');
      if (saved) {
        const data = JSON.parse(saved);
        const lastWorkout = data.lastWorkoutDate;
        
        if (lastWorkout && data.currentStreak > 0) {
          const daysSinceLastWorkout = Math.floor(
            (new Date(today) - new Date(lastWorkout)) / (1000 * 60 * 60 * 24)
          );
          
          if (daysSinceLastWorkout > data.restDaysAllowed + 1) {
            // Streak broken - update localStorage directly
            const updated = { ...data, currentStreak: 0 };
            localStorage.setItem('streakData', JSON.stringify(updated));
            setStreakData(updated);
          }
        }
      }
    };
    
    checkStreak();
  }, []); // Only run on mount

  const logWorkout = () => {
    const today = new Date().toISOString().split('T')[0];
    
    setStreakData(prev => {
      const newHistory = { ...prev.workoutHistory, [today]: true };
      const newStreak = prev.currentStreak + 1;
      const newLongest = Math.max(prev.longestStreak, newStreak);
      const newTotal = prev.totalWorkouts + 1;
      
      // Calculate weekly completed
      const startOfWeek = getStartOfWeek(new Date());
      let weeklyCompleted = 0;
      for (let i = 0; i < 7; i++) {
        const date = new Date(startOfWeek);
        date.setDate(date.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];
        if (newHistory[dateStr]) weeklyCompleted++;
      }

      // Check for new achievements
      const newAchievements = [...prev.achievements];
      
      if (newStreak === 7 && !newAchievements.includes('week_warrior')) {
        newAchievements.push('week_warrior');
      }
      if (newStreak === 30 && !newAchievements.includes('monthly_master')) {
        newAchievements.push('monthly_master');
      }
      if (newTotal === 50 && !newAchievements.includes('fifty_strong')) {
        newAchievements.push('fifty_strong');
      }
      if (newTotal === 100 && !newAchievements.includes('century_club')) {
        newAchievements.push('century_club');
      }

      return {
        ...prev,
        currentStreak: newStreak,
        longestStreak: newLongest,
        totalWorkouts: newTotal,
        lastWorkoutDate: today,
        workoutHistory: newHistory,
        weeklyCompleted,
        achievements: newAchievements
      };
    });

    setShowWorkoutModal(false);
  };

  const useStreakFreeze = () => {
    if (streakData.streakFreezes > 0) {
      const today = new Date().toISOString().split('T')[0];
      setStreakData(prev => ({
        ...prev,
        streakFreezes: prev.streakFreezes - 1,
        workoutHistory: { ...prev.workoutHistory, [today]: 'freeze' },
        lastWorkoutDate: today
      }));
    }
  };

  const getStartOfWeek = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];

    // Add padding for first week
    const startPadding = firstDay.getDay() || 7;
    for (let i = 1; i < startPadding; i++) {
      const prevDate = new Date(year, month, 1 - (startPadding - i));
      days.push({ date: prevDate, isCurrentMonth: false });
    }

    // Add days of month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({ date: new Date(year, month, i), isCurrentMonth: true });
    }

    // Add padding for last week
    const endPadding = 7 - (days.length % 7);
    if (endPadding < 7) {
      for (let i = 1; i <= endPadding; i++) {
        days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false });
      }
    }

    return days;
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const getDateStatus = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    const status = streakData.workoutHistory[dateStr];
    if (status === true) return 'completed';
    if (status === 'freeze') return 'freeze';
    return null;
  };

  const prevMonth = () => {
    setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1));
  };

  const achievements = [
    { id: 'week_warrior', name: '7 Day Warrior', icon: '🔥', description: '7 day streak', unlocked: streakData.achievements.includes('week_warrior') },
    { id: 'monthly_master', name: 'Monthly Master', icon: '👑', description: '30 day streak', unlocked: streakData.achievements.includes('monthly_master') },
    { id: 'fifty_strong', name: '50 Strong', icon: '💪', description: '50 total workouts', unlocked: streakData.achievements.includes('fifty_strong') },
    { id: 'century_club', name: 'Century Club', icon: '🏆', description: '100 total workouts', unlocked: streakData.achievements.includes('century_club') },
  ];

  const todayWorkedOut = streakData.workoutHistory[new Date().toISOString().split('T')[0]];

  return (
    <div className="smart-streak">
      <header className="streak-header">
        <div className="header-content">
          <h1><Flame className="header-icon" /> Smart Streak System</h1>
          <p>Build consistency with intelligent streak tracking</p>
        </div>
      </header>

      <div className="streak-dashboard">
        <div className="main-streak-card">
          <div className="streak-flame">
            <Flame size={48} />
            <span className="streak-count">{streakData.currentStreak}</span>
          </div>
          <div className="streak-info">
            <h2>Day Streak</h2>
            <p>Keep the fire burning! 🔥</p>
          </div>
          <div className="streak-actions">
            {!todayWorkedOut && (
              <button className="log-workout-btn" onClick={() => setShowWorkoutModal(true)}>
                <Check size={20} />
                Log Today&apos;s Workout
              </button>
            )}
            {todayWorkedOut && (
              <div className="completed-badge">
                <Check size={18} />
                Today Complete!
              </div>
            )}
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <TrendingUp size={24} />
            <span className="stat-value">{streakData.longestStreak}</span>
            <span className="stat-label">Longest Streak</span>
          </div>
          <div className="stat-card">
            <Zap size={24} />
            <span className="stat-value">{streakData.totalWorkouts}</span>
            <span className="stat-label">Total Workouts</span>
          </div>
          <div className="stat-card freezes">
            <Shield size={24} />
            <span className="stat-value">{streakData.streakFreezes}</span>
            <span className="stat-label">Streak Freezes</span>
            {!todayWorkedOut && streakData.streakFreezes > 0 && (
              <button className="use-freeze-btn" onClick={useStreakFreeze}>
                Use Freeze
              </button>
            )}
          </div>
        </div>

        <div className="weekly-progress">
          <h3>Weekly Goal</h3>
          <div className="weekly-bar">
            <div 
              className="weekly-fill"
              style={{ width: `${(streakData.weeklyCompleted / streakData.weeklyGoal) * 100}%` }}
            />
          </div>
          <span className="weekly-text">
            {streakData.weeklyCompleted} / {streakData.weeklyGoal} workouts this week
          </span>
        </div>

        <div className="calendar-section">
          <div className="calendar-header">
            <button onClick={prevMonth}><ChevronLeft size={20} /></button>
            <h3>
              <Calendar size={18} />
              {selectedMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h3>
            <button onClick={nextMonth}><ChevronRight size={20} /></button>
          </div>
          <div className="calendar-grid">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
              <div key={day} className="calendar-day-header">{day}</div>
            ))}
            {getDaysInMonth(selectedMonth).map((dayInfo, idx) => {
              const status = getDateStatus(dayInfo.date);
              return (
                <div 
                  key={idx} 
                  className={`calendar-day ${!dayInfo.isCurrentMonth ? 'other-month' : ''} ${isToday(dayInfo.date) ? 'today' : ''} ${status || ''}`}
                >
                  <span>{dayInfo.date.getDate()}</span>
                  {status === 'completed' && <Check size={12} />}
                  {status === 'freeze' && <Shield size={12} />}
                </div>
              );
            })}
          </div>
        </div>

        <div className="achievements-section">
          <h3><Award size={18} /> Achievements</h3>
          <div className="achievements-grid">
            {achievements.map(achievement => (
              <div 
                key={achievement.id} 
                className={`achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}`}
              >
                <span className="achievement-icon">{achievement.icon}</span>
                <div className="achievement-info">
                  <span className="achievement-name">{achievement.name}</span>
                  <span className="achievement-desc">{achievement.description}</span>
                </div>
                {!achievement.unlocked && <span className="lock-icon">🔒</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {showWorkoutModal && (
        <div className="modal-overlay" onClick={() => setShowWorkoutModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowWorkoutModal(false)}>
              <X size={20} />
            </button>
            <div className="modal-icon">
              <Flame size={48} />
            </div>
            <h2>Log Your Workout</h2>
            <p>Did you complete a workout today?</p>
            <div className="modal-actions">
              <button className="confirm-btn" onClick={logWorkout}>
                <Check size={20} />
                Yes, I Did It!
              </button>
              <button className="cancel-btn" onClick={() => setShowWorkoutModal(false)}>
                Not Yet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SmartStreak;
