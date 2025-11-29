import { useState } from 'react';
import { TrendingUp, TrendingDown, Activity, Scale, Ruler, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import './Progress.css';

function Progress() {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const stats = {
    weight: { current: 72.5, previous: 74.2, unit: 'kg', trend: 'down' },
    bodyFat: { current: 18.5, previous: 20.1, unit: '%', trend: 'down' },
    muscle: { current: 35.2, previous: 34.8, unit: 'kg', trend: 'up' },
    workouts: { current: 18, previous: 15, unit: 'sessions', trend: 'up' }
  };

  const weeklyProgress = [
    { day: 'Mon', calories: 450, steps: 8500, workout: true },
    { day: 'Tue', calories: 380, steps: 6200, workout: true },
    { day: 'Wed', calories: 520, steps: 9100, workout: true },
    { day: 'Thu', calories: 280, steps: 5400, workout: false },
    { day: 'Fri', calories: 410, steps: 7800, workout: true },
    { day: 'Sat', calories: 600, steps: 12000, workout: true },
    { day: 'Sun', calories: 200, steps: 4200, workout: false }
  ];

  const achievements = [
    { id: 1, name: 'First Workout', description: 'Complete your first workout', icon: '⭐', unlocked: true, date: '2024-01-15' },
    { id: 2, name: '7 Day Streak', description: 'Work out 7 days in a row', icon: '🔥', unlocked: true, date: '2024-01-22' },
    { id: 3, name: 'Early Bird', description: 'Complete a workout before 7 AM', icon: '🌅', unlocked: true, date: '2024-01-25' },
    { id: 4, name: '10K Steps', description: 'Walk 10,000 steps in a day', icon: '👟', unlocked: true, date: '2024-02-01' },
    { id: 5, name: '30 Day Streak', description: 'Work out 30 days in a row', icon: '🏆', unlocked: false },
    { id: 6, name: 'Weight Goal', description: 'Reach your target weight', icon: '🎯', unlocked: false },
    { id: 7, name: '100 Workouts', description: 'Complete 100 workouts', icon: '💯', unlocked: false },
    { id: 8, name: 'Marathon', description: 'Run a total of 42km', icon: '🏃', unlocked: false },
  ];

  const maxCalories = Math.max(...weeklyProgress.map(d => d.calories));

  // Generate deterministic workout data based on day and month
  const getCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Simulated workout schedule - consistent pattern
    const workoutDays = [1, 2, 4, 5, 7, 9, 10, 12, 14, 15, 17, 19, 20, 22, 23, 25, 27, 28, 30];
    
    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push({ day: null, workout: false });
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ 
        day: i, 
        workout: workoutDays.includes(i)
      });
    }
    return days;
  };

  const navigateMonth = (direction) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + direction);
    setCurrentMonth(newMonth);
  };

  return (
    <div className="progress-page">
      <header className="progress-header">
        <div className="header-content">
          <h1>Progress</h1>
          <p>Track your fitness journey</p>
        </div>
        <div className="period-selector">
          {['week', 'month', 'year'].map(period => (
            <button
              key={period}
              className={`period-btn ${selectedPeriod === period ? 'active' : ''}`}
              onClick={() => setSelectedPeriod(period)}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>
      </header>

      <section className="stats-overview">
        <div className="stat-card weight">
          <div className="stat-icon-wrapper">
            <Scale size={24} />
          </div>
          <div className="stat-details">
            <span className="stat-label">Weight</span>
            <div className="stat-value-row">
              <span className="stat-value">{stats.weight.current}</span>
              <span className="stat-unit">{stats.weight.unit}</span>
            </div>
            <div className={`stat-change ${stats.weight.trend}`}>
              {stats.weight.trend === 'down' ? <TrendingDown size={16} /> : <TrendingUp size={16} />}
              <span>{Math.abs(stats.weight.current - stats.weight.previous).toFixed(1)} {stats.weight.unit}</span>
            </div>
          </div>
        </div>

        <div className="stat-card body-fat">
          <div className="stat-icon-wrapper">
            <Activity size={24} />
          </div>
          <div className="stat-details">
            <span className="stat-label">Body Fat</span>
            <div className="stat-value-row">
              <span className="stat-value">{stats.bodyFat.current}</span>
              <span className="stat-unit">{stats.bodyFat.unit}</span>
            </div>
            <div className={`stat-change ${stats.bodyFat.trend}`}>
              {stats.bodyFat.trend === 'down' ? <TrendingDown size={16} /> : <TrendingUp size={16} />}
              <span>{Math.abs(stats.bodyFat.current - stats.bodyFat.previous).toFixed(1)}{stats.bodyFat.unit}</span>
            </div>
          </div>
        </div>

        <div className="stat-card muscle">
          <div className="stat-icon-wrapper">
            <Ruler size={24} />
          </div>
          <div className="stat-details">
            <span className="stat-label">Muscle Mass</span>
            <div className="stat-value-row">
              <span className="stat-value">{stats.muscle.current}</span>
              <span className="stat-unit">{stats.muscle.unit}</span>
            </div>
            <div className={`stat-change ${stats.muscle.trend}`}>
              {stats.muscle.trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              <span>+{Math.abs(stats.muscle.current - stats.muscle.previous).toFixed(1)} {stats.muscle.unit}</span>
            </div>
          </div>
        </div>

        <div className="stat-card workouts">
          <div className="stat-icon-wrapper">
            <Calendar size={24} />
          </div>
          <div className="stat-details">
            <span className="stat-label">Workouts</span>
            <div className="stat-value-row">
              <span className="stat-value">{stats.workouts.current}</span>
              <span className="stat-unit">{stats.workouts.unit}</span>
            </div>
            <div className={`stat-change ${stats.workouts.trend}`}>
              {stats.workouts.trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              <span>+{Math.abs(stats.workouts.current - stats.workouts.previous)} from last {selectedPeriod}</span>
            </div>
          </div>
        </div>
      </section>

      <div className="progress-grid">
        <section className="chart-section">
          <h2>Weekly Activity</h2>
          <div className="chart-container">
            <div className="bar-chart">
              {weeklyProgress.map((data, index) => (
                <div key={index} className="bar-column">
                  <div className="bar-wrapper">
                    <div 
                      className={`bar ${data.workout ? 'has-workout' : ''}`}
                      style={{ height: `${(data.calories / maxCalories) * 100}%` }}
                    >
                      <span className="bar-value">{data.calories}</span>
                    </div>
                  </div>
                  <span className="bar-label">{data.day}</span>
                  <span className="step-count">{(data.steps / 1000).toFixed(1)}k</span>
                </div>
              ))}
            </div>
            <div className="chart-legend">
              <div className="legend-item">
                <span className="legend-dot has-workout"></span>
                <span>Workout day</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot"></span>
                <span>Rest day</span>
              </div>
            </div>
          </div>
        </section>

        <section className="calendar-section">
          <div className="calendar-header">
            <h2>Workout Calendar</h2>
            <div className="calendar-nav">
              <button onClick={() => navigateMonth(-1)} aria-label="Previous month">
                <ChevronLeft size={20} />
              </button>
              <span>{currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
              <button onClick={() => navigateMonth(1)} aria-label="Next month">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
          <div className="calendar-grid">
            <div className="calendar-day-header">Sun</div>
            <div className="calendar-day-header">Mon</div>
            <div className="calendar-day-header">Tue</div>
            <div className="calendar-day-header">Wed</div>
            <div className="calendar-day-header">Thu</div>
            <div className="calendar-day-header">Fri</div>
            <div className="calendar-day-header">Sat</div>
            {getCalendarDays().map((dayData, index) => (
              <div 
                key={index} 
                className={`calendar-day ${dayData.day ? '' : 'empty'} ${dayData.workout ? 'workout' : ''}`}
              >
                {dayData.day && (
                  <>
                    <span className="day-number">{dayData.day}</span>
                    {dayData.workout && <span className="workout-indicator">💪</span>}
                  </>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="achievements-section">
        <h2>Achievements</h2>
        <div className="achievements-grid">
          {achievements.map(achievement => (
            <div 
              key={achievement.id} 
              className={`achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}`}
            >
              <span className="achievement-icon">{achievement.icon}</span>
              <div className="achievement-info">
                <h3>{achievement.name}</h3>
                <p>{achievement.description}</p>
                {achievement.unlocked && achievement.date && (
                  <span className="achievement-date">Unlocked: {achievement.date}</span>
                )}
              </div>
              {!achievement.unlocked && <span className="lock-overlay">🔒</span>}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Progress;
