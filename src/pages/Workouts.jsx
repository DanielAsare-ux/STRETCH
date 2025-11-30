import { useState } from 'react';
import { Search, Filter, Clock, Flame, Play, Heart, ChevronDown } from 'lucide-react';
import './Workouts.css';

function Workouts() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState([1, 4]);

  const categories = [
    { id: 'all', name: 'All Workouts', icon: '🏋️' },
    { id: 'cardio', name: 'Cardio', icon: '🏃' },
    { id: 'strength', name: 'Strength', icon: '💪' },
    { id: 'flexibility', name: 'Flexibility', icon: '🧘' },
    { id: 'hiit', name: 'HIIT', icon: '⚡' },
  ];

  const workouts = [
    { id: 1, name: 'Full Body Burn', category: 'hiit', duration: 30, calories: 350, difficulty: 'Hard', exercises: 12, image: '🔥' },
    { id: 2, name: 'Morning Yoga Flow', category: 'flexibility', duration: 20, calories: 120, difficulty: 'Easy', exercises: 8, image: '🧘' },
    { id: 3, name: 'Cardio Blast', category: 'cardio', duration: 25, calories: 280, difficulty: 'Medium', exercises: 10, image: '🏃' },
    { id: 4, name: 'Upper Body Strength', category: 'strength', duration: 35, calories: 250, difficulty: 'Medium', exercises: 14, image: '💪' },
    { id: 5, name: 'Core Crusher', category: 'strength', duration: 15, calories: 180, difficulty: 'Hard', exercises: 8, image: '🎯' },
    { id: 6, name: 'Stretching Routine', category: 'flexibility', duration: 10, calories: 50, difficulty: 'Easy', exercises: 6, image: '🌟' },
    { id: 7, name: 'Tabata Training', category: 'hiit', duration: 20, calories: 300, difficulty: 'Hard', exercises: 8, image: '⏱️' },
    { id: 8, name: 'Leg Day Power', category: 'strength', duration: 40, calories: 320, difficulty: 'Hard', exercises: 16, image: '🦵' },
    { id: 9, name: 'Fat Burner Express', category: 'cardio', duration: 15, calories: 200, difficulty: 'Medium', exercises: 6, image: '🚀' },
  ];

  const toggleFavorite = (id) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const filteredWorkouts = workouts.filter(workout => {
    const matchesCategory = activeCategory === 'all' || workout.category === activeCategory;
    const matchesSearch = workout.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="workouts-page">
      <header className="workouts-header">
        <div className="header-content">
          <h1>Workouts</h1>
          <p>Find the perfect workout for your goals</p>
        </div>
        <div className="header-actions">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search workouts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="filter-button">
            <Filter size={20} />
            <span>Filter</span>
            <ChevronDown size={16} />
          </button>
        </div>
      </header>

      <section className="categories-section">
        <div className="categories-scroll">
          {categories.map(category => (
            <button
              key={category.id}
              className={`category-chip ${activeCategory === category.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(category.id)}
            >
              <span className="category-icon">{category.icon}</span>
              <span className="category-name">{category.name}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="workouts-grid">
        {filteredWorkouts.map(workout => (
          <article key={workout.id} className="workout-item">
            <div className="workout-image">
              <span className="workout-emoji">{workout.image}</span>
              <button 
                className={`favorite-btn ${favorites.includes(workout.id) ? 'active' : ''}`}
                onClick={() => toggleFavorite(workout.id)}
                aria-label={favorites.includes(workout.id) ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Heart size={20} fill={favorites.includes(workout.id) ? 'currentColor' : 'none'} />
              </button>
            </div>
            <div className="workout-content">
              <h3>{workout.name}</h3>
              <div className="workout-stats">
                <div className="stat">
                  <Clock size={16} />
                  <span>{workout.duration} min</span>
                </div>
                <div className="stat">
                  <Flame size={16} />
                  <span>{workout.calories} cal</span>
                </div>
              </div>
              <div className="workout-footer">
                <span className={`difficulty-badge ${workout.difficulty.toLowerCase()}`}>
                  {workout.difficulty}
                </span>
                <span className="exercises-count">{workout.exercises} exercises</span>
              </div>
              <button className="start-workout-btn">
                <Play size={18} />
                Start Workout
              </button>
            </div>
          </article>
        ))}
      </section>

      {filteredWorkouts.length === 0 && (
        <div className="no-results">
          <p>No workouts found matching your criteria</p>
          <button onClick={() => { setActiveCategory('all'); setSearchQuery(''); }}>
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}

export default Workouts;
