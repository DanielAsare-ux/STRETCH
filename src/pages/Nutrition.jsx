import { useState } from 'react';
import { Plus, Droplets, Apple, Flame, Target, Coffee, Pizza, Salad, X } from 'lucide-react';
import './Nutrition.css';

function Nutrition() {
  const [waterIntake, setWaterIntake] = useState(5);
  const [showAddMeal, setShowAddMeal] = useState(false);

  const dailyGoals = {
    calories: { current: 1450, goal: 2000 },
    protein: { current: 85, goal: 120 },
    carbs: { current: 180, goal: 250 },
    fat: { current: 45, goal: 65 }
  };

  const meals = [
    { 
      id: 1, 
      name: 'Breakfast', 
      time: '8:00 AM', 
      icon: <Coffee />, 
      items: ['Oatmeal with berries', 'Greek yogurt', 'Green tea'],
      calories: 380,
      protein: 18,
      carbs: 52,
      fat: 8
    },
    { 
      id: 2, 
      name: 'Lunch', 
      time: '12:30 PM', 
      icon: <Salad />, 
      items: ['Grilled chicken salad', 'Quinoa', 'Olive oil dressing'],
      calories: 520,
      protein: 42,
      carbs: 38,
      fat: 22
    },
    { 
      id: 3, 
      name: 'Snack', 
      time: '3:30 PM', 
      icon: <Apple />, 
      items: ['Apple slices', 'Almond butter'],
      calories: 180,
      protein: 5,
      carbs: 24,
      fat: 9
    },
    { 
      id: 4, 
      name: 'Dinner', 
      time: '7:00 PM', 
      icon: <Pizza />, 
      items: ['Salmon fillet', 'Steamed vegetables', 'Brown rice'],
      calories: 370,
      protein: 20,
      carbs: 66,
      fat: 6
    }
  ];

  const getMacroPercentage = (current, goal) => Math.min((current / goal) * 100, 100);

  return (
    <div className="nutrition-page">
      <header className="nutrition-header">
        <div className="header-content">
          <h1>Nutrition</h1>
          <p>Track your meals and hydration</p>
        </div>
        <button className="add-meal-btn" onClick={() => setShowAddMeal(true)}>
          <Plus size={20} />
          Log Meal
        </button>
      </header>

      <div className="nutrition-grid">
        <section className="calories-overview">
          <div className="calories-ring">
            <svg viewBox="0 0 200 200">
              <circle 
                cx="100" 
                cy="100" 
                r="85" 
                className="ring-bg"
              />
              <circle 
                cx="100" 
                cy="100" 
                r="85" 
                className="ring-progress"
                strokeDasharray={`${getMacroPercentage(dailyGoals.calories.current, dailyGoals.calories.goal) * 5.34} 534`}
              />
            </svg>
            <div className="calories-center">
              <Flame className="calories-icon" />
              <span className="calories-value">{dailyGoals.calories.current}</span>
              <span className="calories-label">of {dailyGoals.calories.goal} cal</span>
            </div>
          </div>
          <h2>Daily Calories</h2>
          <p className="calories-remaining">{dailyGoals.calories.goal - dailyGoals.calories.current} cal remaining</p>
        </section>

        <section className="macros-section">
          <h2>Macronutrients</h2>
          <div className="macros-grid">
            <div className="macro-card protein">
              <div className="macro-header">
                <span className="macro-icon">🥩</span>
                <span className="macro-name">Protein</span>
              </div>
              <div className="macro-progress">
                <div 
                  className="macro-fill"
                  style={{ width: `${getMacroPercentage(dailyGoals.protein.current, dailyGoals.protein.goal)}%` }}
                />
              </div>
              <div className="macro-values">
                <span>{dailyGoals.protein.current}g</span>
                <span>/ {dailyGoals.protein.goal}g</span>
              </div>
            </div>

            <div className="macro-card carbs">
              <div className="macro-header">
                <span className="macro-icon">🍞</span>
                <span className="macro-name">Carbs</span>
              </div>
              <div className="macro-progress">
                <div 
                  className="macro-fill"
                  style={{ width: `${getMacroPercentage(dailyGoals.carbs.current, dailyGoals.carbs.goal)}%` }}
                />
              </div>
              <div className="macro-values">
                <span>{dailyGoals.carbs.current}g</span>
                <span>/ {dailyGoals.carbs.goal}g</span>
              </div>
            </div>

            <div className="macro-card fat">
              <div className="macro-header">
                <span className="macro-icon">🥑</span>
                <span className="macro-name">Fat</span>
              </div>
              <div className="macro-progress">
                <div 
                  className="macro-fill"
                  style={{ width: `${getMacroPercentage(dailyGoals.fat.current, dailyGoals.fat.goal)}%` }}
                />
              </div>
              <div className="macro-values">
                <span>{dailyGoals.fat.current}g</span>
                <span>/ {dailyGoals.fat.goal}g</span>
              </div>
            </div>
          </div>
        </section>

        <section className="water-section">
          <h2><Droplets /> Water Intake</h2>
          <div className="water-tracker">
            <div className="water-glasses">
              {[...Array(8)].map((_, i) => (
                <button
                  key={i}
                  className={`water-glass ${i < waterIntake ? 'filled' : ''}`}
                  onClick={() => setWaterIntake(i + 1)}
                  aria-label={`Set water intake to ${i + 1} glasses`}
                >
                  <Droplets size={20} />
                </button>
              ))}
            </div>
            <p className="water-status">{waterIntake} of 8 glasses</p>
          </div>
        </section>
      </div>

      <section className="meals-section">
        <div className="meals-header">
          <h2>Today&apos;s Meals</h2>
          <span className="total-calories">
            <Target size={18} /> Total: {meals.reduce((sum, m) => sum + m.calories, 0)} cal
          </span>
        </div>
        <div className="meals-list">
          {meals.map(meal => (
            <article key={meal.id} className="meal-card">
              <div className="meal-icon">{meal.icon}</div>
              <div className="meal-info">
                <div className="meal-header">
                  <h3>{meal.name}</h3>
                  <span className="meal-time">{meal.time}</span>
                </div>
                <ul className="meal-items">
                  {meal.items.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
                <div className="meal-macros">
                  <span>{meal.calories} cal</span>
                  <span>P: {meal.protein}g</span>
                  <span>C: {meal.carbs}g</span>
                  <span>F: {meal.fat}g</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {showAddMeal && (
        <div className="modal-overlay" onClick={() => setShowAddMeal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Log a Meal</h2>
              <button className="close-btn" onClick={() => setShowAddMeal(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="modal-content">
              <div className="form-group">
                <label>Meal Name</label>
                <input type="text" placeholder="e.g., Lunch" />
              </div>
              <div className="form-group">
                <label>Food Items</label>
                <textarea placeholder="List your food items..."></textarea>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Calories</label>
                  <input type="number" placeholder="0" />
                </div>
                <div className="form-group">
                  <label>Protein (g)</label>
                  <input type="number" placeholder="0" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Carbs (g)</label>
                  <input type="number" placeholder="0" />
                </div>
                <div className="form-group">
                  <label>Fat (g)</label>
                  <input type="number" placeholder="0" />
                </div>
              </div>
              <button className="submit-btn">Log Meal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Nutrition;
