/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

// Helper function to check if we need to reset daily data
const getInitialAppData = () => {
  const saved = localStorage.getItem('stretchAppData');
  const today = new Date().toDateString();
  
  if (saved) {
    const parsed = JSON.parse(saved);
    // Reset daily stats if it's a new day
    if (parsed.todayStats.date !== today) {
      return {
        ...parsed,
        todayStats: {
          ...parsed.todayStats,
          calories: 0,
          workouts: 0,
          activeMinutes: 0,
          date: today
        },
        nutrition: {
          ...parsed.nutrition,
          calories: { ...parsed.nutrition.calories, current: 0 },
          protein: { ...parsed.nutrition.protein, current: 0 },
          carbs: { ...parsed.nutrition.carbs, current: 0 },
          fat: { ...parsed.nutrition.fat, current: 0 },
          meals: [],
          waterIntake: 0
        }
      };
    }
    return parsed;
  }
  
  return {
    todayStats: {
      calories: 0,
      workouts: 0,
      streak: 0,
      activeMinutes: 0,
      date: today
    },
    nutrition: {
      calories: { current: 0, goal: 2000 },
      protein: { current: 0, goal: 120 },
      carbs: { current: 0, goal: 250 },
      fat: { current: 0, goal: 65 },
      meals: [],
      waterIntake: 0
    },
    workoutHistory: [],
    achievements: [
      { id: 1, name: '7 Day Streak', icon: '🔥', unlocked: false },
      { id: 2, name: 'First Workout', icon: '⭐', unlocked: false },
      { id: 3, name: '10 Workouts', icon: '🏆', unlocked: false },
    ]
  };
};

export function AppProvider({ children }) {
  const [appData, setAppData] = useState(getInitialAppData);

  // Save to localStorage whenever appData changes
  useEffect(() => {
    localStorage.setItem('stretchAppData', JSON.stringify(appData));
  }, [appData]);

  const logWorkout = (workout) => {
    setAppData(prev => {
      const newWorkoutCount = prev.todayStats.workouts + 1;
      // Streak increments on first workout of the day
      // This is intentional: completing at least one workout per day maintains/increases the streak
      const isFirstWorkoutToday = prev.todayStats.workouts === 0;
      const newStreak = isFirstWorkoutToday ? prev.todayStats.streak + 1 : prev.todayStats.streak;
      
      // Check achievements
      const newAchievements = [...prev.achievements];
      
      // First workout achievement
      if (!newAchievements.find(a => a.id === 2)?.unlocked) {
        const achievement = newAchievements.find(a => a.id === 2);
        if (achievement) achievement.unlocked = true;
      }
      
      // 10 workouts achievement
      const totalWorkouts = prev.workoutHistory.length + 1;
      if (totalWorkouts >= 10 && !newAchievements.find(a => a.id === 3)?.unlocked) {
        const achievement = newAchievements.find(a => a.id === 3);
        if (achievement) achievement.unlocked = true;
      }
      
      // 7 day streak achievement
      if (newStreak >= 7 && !newAchievements.find(a => a.id === 1)?.unlocked) {
        const achievement = newAchievements.find(a => a.id === 1);
        if (achievement) achievement.unlocked = true;
      }

      return {
        ...prev,
        todayStats: {
          ...prev.todayStats,
          calories: prev.todayStats.calories + (workout.caloriesBurned || 0),
          workouts: newWorkoutCount,
          streak: newStreak,
          activeMinutes: prev.todayStats.activeMinutes + (workout.duration || 0)
        },
        workoutHistory: [
          ...prev.workoutHistory,
          {
            ...workout,
            date: new Date().toISOString(),
            id: Date.now()
          }
        ],
        achievements: newAchievements
      };
    });
  };

  const logMeal = (meal) => {
    setAppData(prev => ({
      ...prev,
      nutrition: {
        ...prev.nutrition,
        calories: {
          ...prev.nutrition.calories,
          current: prev.nutrition.calories.current + (meal.calories || 0)
        },
        protein: {
          ...prev.nutrition.protein,
          current: prev.nutrition.protein.current + (meal.protein || 0)
        },
        carbs: {
          ...prev.nutrition.carbs,
          current: prev.nutrition.carbs.current + (meal.carbs || 0)
        },
        fat: {
          ...prev.nutrition.fat,
          current: prev.nutrition.fat.current + (meal.fat || 0)
        },
        meals: [
          ...prev.nutrition.meals,
          {
            ...meal,
            id: Date.now(),
            time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
          }
        ]
      }
    }));
  };

  const setWaterIntake = (glasses) => {
    setAppData(prev => ({
      ...prev,
      nutrition: {
        ...prev.nutrition,
        waterIntake: glasses
      }
    }));
  };

  return (
    <AppContext.Provider value={{ 
      appData, 
      setAppData, 
      logWorkout, 
      logMeal,
      setWaterIntake 
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
