import { useState } from 'react';
import { 
  Sparkles, 
  Target, 
  Clock, 
  Dumbbell, 
  Zap,
  ChevronRight,
  RotateCcw,
  Play,
  Check
} from 'lucide-react';
import './AIWorkoutGenerator.css';

// AI Workout Generation Algorithm
const generateWorkout = (preferences) => {
  const { goal, fitnessLevel, duration, focusAreas } = preferences;
  
  // Exercise database categorized by type and difficulty
  const exerciseDB = {
    warmup: [
      { name: 'Jumping Jacks', duration: 60, calories: 10, level: 'easy' },
      { name: 'High Knees', duration: 45, calories: 8, level: 'easy' },
      { name: 'Arm Circles', duration: 30, calories: 3, level: 'easy' },
      { name: 'Leg Swings', duration: 30, calories: 3, level: 'easy' },
      { name: 'Torso Twists', duration: 30, calories: 3, level: 'easy' },
    ],
    upperBody: {
      easy: [
        { name: 'Wall Push-Ups', reps: 12, calories: 5, muscle: 'chest' },
        { name: 'Knee Push-Ups', reps: 10, calories: 6, muscle: 'chest' },
        { name: 'Arm Circles', reps: 20, calories: 3, muscle: 'shoulders' },
        { name: 'Tricep Dips (Chair)', reps: 10, calories: 5, muscle: 'triceps' },
      ],
      medium: [
        { name: 'Standard Push-Ups', reps: 15, calories: 8, muscle: 'chest' },
        { name: 'Diamond Push-Ups', reps: 10, calories: 9, muscle: 'triceps' },
        { name: 'Pike Push-Ups', reps: 10, calories: 8, muscle: 'shoulders' },
        { name: 'Tricep Dips', reps: 15, calories: 7, muscle: 'triceps' },
        { name: 'Incline Push-Ups', reps: 12, calories: 7, muscle: 'chest' },
      ],
      hard: [
        { name: 'Archer Push-Ups', reps: 8, calories: 12, muscle: 'chest' },
        { name: 'Decline Push-Ups', reps: 15, calories: 10, muscle: 'chest' },
        { name: 'Handstand Hold', duration: 30, calories: 8, muscle: 'shoulders' },
        { name: 'Pseudo Planche Push-Ups', reps: 8, calories: 12, muscle: 'shoulders' },
        { name: 'One-Arm Push-Up Progression', reps: 5, calories: 15, muscle: 'chest' },
      ],
      expert: [
        { name: 'One-Arm Push-Ups', reps: 5, calories: 18, muscle: 'chest' },
        { name: 'Handstand Push-Ups', reps: 8, calories: 15, muscle: 'shoulders' },
        { name: 'Planche Leans', duration: 20, calories: 12, muscle: 'shoulders' },
        { name: 'Muscle-Up Negatives', reps: 5, calories: 20, muscle: 'back' },
      ]
    },
    lowerBody: {
      easy: [
        { name: 'Bodyweight Squats', reps: 15, calories: 8, muscle: 'quads' },
        { name: 'Glute Bridges', reps: 15, calories: 6, muscle: 'glutes' },
        { name: 'Calf Raises', reps: 20, calories: 5, muscle: 'calves' },
        { name: 'Standing Leg Raises', reps: 12, calories: 4, muscle: 'hip flexors' },
      ],
      medium: [
        { name: 'Jump Squats', reps: 12, calories: 12, muscle: 'quads' },
        { name: 'Lunges', reps: 12, calories: 10, muscle: 'quads' },
        { name: 'Bulgarian Split Squats', reps: 10, calories: 12, muscle: 'quads' },
        { name: 'Single-Leg Glute Bridges', reps: 12, calories: 8, muscle: 'glutes' },
      ],
      hard: [
        { name: 'Pistol Squat Progressions', reps: 6, calories: 15, muscle: 'quads' },
        { name: 'Box Jumps', reps: 10, calories: 15, muscle: 'quads' },
        { name: 'Nordic Curl Negatives', reps: 6, calories: 12, muscle: 'hamstrings' },
        { name: 'Shrimp Squats', reps: 6, calories: 14, muscle: 'quads' },
      ],
      expert: [
        { name: 'Pistol Squats', reps: 8, calories: 18, muscle: 'quads' },
        { name: 'Nordic Curls', reps: 6, calories: 15, muscle: 'hamstrings' },
        { name: 'Plyometric Lunges', reps: 12, calories: 18, muscle: 'quads' },
        { name: 'Single-Leg Box Jumps', reps: 6, calories: 16, muscle: 'quads' },
      ]
    },
    core: {
      easy: [
        { name: 'Dead Bug', reps: 12, calories: 5, muscle: 'abs' },
        { name: 'Bird Dog', reps: 12, calories: 4, muscle: 'core' },
        { name: 'Plank Hold', duration: 30, calories: 5, muscle: 'core' },
        { name: 'Crunches', reps: 15, calories: 5, muscle: 'abs' },
      ],
      medium: [
        { name: 'Bicycle Crunches', reps: 20, calories: 8, muscle: 'obliques' },
        { name: 'Mountain Climbers', reps: 20, calories: 10, muscle: 'core' },
        { name: 'Plank Hold', duration: 60, calories: 8, muscle: 'core' },
        { name: 'Leg Raises', reps: 12, calories: 7, muscle: 'lower abs' },
        { name: 'Russian Twists', reps: 20, calories: 8, muscle: 'obliques' },
      ],
      hard: [
        { name: 'L-Sit Progression', duration: 20, calories: 10, muscle: 'core' },
        { name: 'Dragon Flag Negatives', reps: 6, calories: 12, muscle: 'abs' },
        { name: 'Hanging Leg Raises', reps: 10, calories: 10, muscle: 'lower abs' },
        { name: 'Ab Wheel Rollouts', reps: 10, calories: 12, muscle: 'core' },
      ],
      expert: [
        { name: 'L-Sit Hold', duration: 30, calories: 15, muscle: 'core' },
        { name: 'Dragon Flags', reps: 8, calories: 18, muscle: 'abs' },
        { name: 'Front Lever Progressions', duration: 15, calories: 15, muscle: 'core' },
        { name: 'Human Flag Attempts', reps: 3, calories: 12, muscle: 'obliques' },
      ]
    },
    cardio: {
      easy: [
        { name: 'Marching in Place', duration: 60, calories: 8, muscle: 'cardio' },
        { name: 'Step Touch', duration: 60, calories: 7, muscle: 'cardio' },
      ],
      medium: [
        { name: 'Burpees', reps: 10, calories: 15, muscle: 'full body' },
        { name: 'High Knees', duration: 45, calories: 12, muscle: 'cardio' },
        { name: 'Mountain Climbers', duration: 45, calories: 12, muscle: 'cardio' },
      ],
      hard: [
        { name: 'Burpee Box Jumps', reps: 8, calories: 18, muscle: 'full body' },
        { name: 'Tuck Jumps', reps: 10, calories: 15, muscle: 'legs' },
      ],
      expert: [
        { name: 'Muscle-Up Burpees', reps: 5, calories: 25, muscle: 'full body' },
        { name: 'Clapping Push-Up Burpees', reps: 8, calories: 22, muscle: 'full body' },
      ]
    },
    cooldown: [
      { name: 'Standing Forward Fold', duration: 30, calories: 2 },
      { name: 'Quad Stretch', duration: 30, calories: 2 },
      { name: 'Shoulder Stretch', duration: 30, calories: 2 },
      { name: 'Hip Flexor Stretch', duration: 30, calories: 2 },
      { name: 'Deep Breathing', duration: 60, calories: 2 },
    ]
  };

  const levelMap = {
    beginner: 'easy',
    intermediate: 'medium',
    advanced: 'hard',
    expert: 'expert'
  };

  const level = levelMap[fitnessLevel] || 'medium';
  
  // Calculate time allocation based on duration and goal
  const totalSeconds = duration * 60;
  const warmupTime = Math.min(180, totalSeconds * 0.15); // 15% for warmup, max 3 min
  const cooldownTime = Math.min(180, totalSeconds * 0.1); // 10% for cooldown, max 3 min
  // Main workout time is used implicitly in the exercise selection logic

  // Select exercises based on goal
  const workout = {
    name: generateWorkoutName(goal),
    warmup: [],
    mainWorkout: [],
    cooldown: [],
    totalCalories: 0,
    totalDuration: duration,
    difficulty: fitnessLevel
  };

  // Add warmup exercises
  const shuffledWarmup = [...exerciseDB.warmup].sort(() => Math.random() - 0.5);
  let warmupAccumulated = 0;
  for (const exercise of shuffledWarmup) {
    if (warmupAccumulated + exercise.duration <= warmupTime) {
      workout.warmup.push({ ...exercise, type: 'warmup' });
      warmupAccumulated += exercise.duration;
      workout.totalCalories += exercise.calories;
    }
  }

  // Determine exercise categories based on goal and focus areas
  let categories = [];
  if (goal === 'strength') {
    categories = focusAreas.length > 0 ? focusAreas : ['upperBody', 'lowerBody', 'core'];
  } else if (goal === 'cardio') {
    categories = ['cardio', 'core'];
  } else if (goal === 'flexibility') {
    categories = ['core', 'lowerBody'];
  } else {
    categories = ['upperBody', 'lowerBody', 'core', 'cardio'];
  }

  // Calculate exercises per category
  const exercisesPerCategory = Math.ceil(8 / categories.length);
  
  // Add main workout exercises
  categories.forEach(category => {
    if (exerciseDB[category] && exerciseDB[category][level]) {
      const categoryExercises = [...exerciseDB[category][level]].sort(() => Math.random() - 0.5);
      const selected = categoryExercises.slice(0, exercisesPerCategory);
      selected.forEach(exercise => {
        workout.mainWorkout.push({ ...exercise, type: category });
        workout.totalCalories += exercise.calories;
      });
    }
  });

  // Add cooldown
  const shuffledCooldown = [...exerciseDB.cooldown].sort(() => Math.random() - 0.5);
  let cooldownAccumulated = 0;
  for (const exercise of shuffledCooldown) {
    if (cooldownAccumulated + exercise.duration <= cooldownTime) {
      workout.cooldown.push({ ...exercise, type: 'cooldown' });
      cooldownAccumulated += exercise.duration;
      workout.totalCalories += exercise.calories;
    }
  }

  // Adjust calorie estimate based on intensity
  const intensityMultiplier = {
    beginner: 0.8,
    intermediate: 1.0,
    advanced: 1.2,
    expert: 1.4
  };
  workout.totalCalories = Math.round(workout.totalCalories * (intensityMultiplier[fitnessLevel] || 1));

  return workout;
};

const generateWorkoutName = (goal) => {
  const prefixes = ['Power', 'Ultimate', 'Dynamic', 'Intense', 'Supreme', 'Elite', 'Fusion'];
  const goalNames = {
    strength: ['Strength Builder', 'Muscle Forge', 'Power Session'],
    cardio: ['Cardio Blast', 'Heart Pumper', 'Endurance Rush'],
    flexibility: ['Flex Flow', 'Mobility Master', 'Stretch Session'],
    general: ['Full Body Burn', 'Total Fitness', 'Complete Workout']
  };
  
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const names = goalNames[goal] || goalNames.general;
  const name = names[Math.floor(Math.random() * names.length)];
  
  return `${prefix} ${name}`;
};

function AIWorkoutGenerator() {
  const [step, setStep] = useState(1);
  const [preferences, setPreferences] = useState({
    goal: '',
    fitnessLevel: '',
    duration: 30,
    equipment: [],
    focusAreas: []
  });
  const [generatedWorkout, setGeneratedWorkout] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const goals = [
    { id: 'strength', name: 'Build Strength', icon: '💪', description: 'Focus on muscle building and power' },
    { id: 'cardio', name: 'Improve Cardio', icon: '🏃', description: 'Boost endurance and heart health' },
    { id: 'flexibility', name: 'Increase Flexibility', icon: '🧘', description: 'Improve mobility and stretching' },
    { id: 'general', name: 'General Fitness', icon: '⚡', description: 'Balanced full-body workout' }
  ];

  const fitnessLevels = [
    { id: 'beginner', name: 'Beginner', description: 'New to exercise or returning after a break' },
    { id: 'intermediate', name: 'Intermediate', description: 'Regular exercise for 6+ months' },
    { id: 'advanced', name: 'Advanced', description: '2+ years of consistent training' },
    { id: 'expert', name: 'Expert', description: 'Athlete-level conditioning' }
  ];

  const focusAreas = [
    { id: 'upperBody', name: 'Upper Body', icon: '💪' },
    { id: 'lowerBody', name: 'Lower Body', icon: '🦵' },
    { id: 'core', name: 'Core', icon: '🎯' },
    { id: 'cardio', name: 'Cardio', icon: '❤️' }
  ];

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const workout = generateWorkout(preferences);
    setGeneratedWorkout(workout);
    setIsGenerating(false);
    setStep(4);
  };

  const resetGenerator = () => {
    setStep(1);
    setPreferences({
      goal: '',
      fitnessLevel: '',
      duration: 30,
      equipment: [],
      focusAreas: []
    });
    setGeneratedWorkout(null);
  };

  return (
    <div className="ai-generator">
      <header className="generator-header">
        <div className="header-content">
          <h1><Sparkles className="header-icon" /> AI Workout Generator</h1>
          <p>Powered by intelligent algorithms to create your perfect workout</p>
        </div>
        {step > 1 && step < 4 && (
          <button className="reset-btn" onClick={resetGenerator}>
            <RotateCcw size={16} /> Start Over
          </button>
        )}
      </header>

      <div className="progress-steps">
        {[1, 2, 3, 4].map(s => (
          <div key={s} className={`step ${step >= s ? 'active' : ''} ${step === s ? 'current' : ''}`}>
            <div className="step-circle">{step > s ? <Check size={14} /> : s}</div>
            <span className="step-label">
              {s === 1 ? 'Goal' : s === 2 ? 'Level' : s === 3 ? 'Customize' : 'Workout'}
            </span>
          </div>
        ))}
      </div>

      <div className="generator-content">
        {step === 1 && (
          <div className="step-content">
            <h2>What&apos;s your fitness goal?</h2>
            <div className="options-grid">
              {goals.map(goal => (
                <button
                  key={goal.id}
                  className={`option-card ${preferences.goal === goal.id ? 'selected' : ''}`}
                  onClick={() => {
                    setPreferences({ ...preferences, goal: goal.id });
                    setStep(2);
                  }}
                >
                  <span className="option-icon">{goal.icon}</span>
                  <h3>{goal.name}</h3>
                  <p>{goal.description}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="step-content">
            <h2>What&apos;s your fitness level?</h2>
            <div className="options-list">
              {fitnessLevels.map(level => (
                <button
                  key={level.id}
                  className={`level-option ${preferences.fitnessLevel === level.id ? 'selected' : ''}`}
                  onClick={() => {
                    setPreferences({ ...preferences, fitnessLevel: level.id });
                    setStep(3);
                  }}
                >
                  <div className="level-info">
                    <h3>{level.name}</h3>
                    <p>{level.description}</p>
                  </div>
                  <ChevronRight size={20} />
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="step-content">
            <h2>Customize your workout</h2>
            
            <div className="customize-section">
              <label>
                <Clock size={18} />
                Duration: <strong>{preferences.duration} minutes</strong>
              </label>
              <input
                type="range"
                min="10"
                max="60"
                step="5"
                value={preferences.duration}
                onChange={(e) => setPreferences({ ...preferences, duration: parseInt(e.target.value) })}
                className="duration-slider"
              />
              <div className="duration-labels">
                <span>10 min</span>
                <span>60 min</span>
              </div>
            </div>

            <div className="customize-section">
              <label>
                <Target size={18} />
                Focus Areas (optional)
              </label>
              <div className="focus-grid">
                {focusAreas.map(area => (
                  <button
                    key={area.id}
                    className={`focus-btn ${preferences.focusAreas.includes(area.id) ? 'selected' : ''}`}
                    onClick={() => {
                      const updated = preferences.focusAreas.includes(area.id)
                        ? preferences.focusAreas.filter(a => a !== area.id)
                        : [...preferences.focusAreas, area.id];
                      setPreferences({ ...preferences, focusAreas: updated });
                    }}
                  >
                    <span>{area.icon}</span>
                    {area.name}
                  </button>
                ))}
              </div>
            </div>

            <button className="generate-btn" onClick={handleGenerate} disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <div className="loading-spinner" />
                  AI is generating...
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  Generate My Workout
                </>
              )}
            </button>
          </div>
        )}

        {step === 4 && generatedWorkout && (
          <div className="step-content workout-result">
            <div className="workout-header">
              <div className="workout-title">
                <Zap className="title-icon" />
                <div>
                  <h2>{generatedWorkout.name}</h2>
                  <p className="workout-meta">
                    <span><Clock size={14} /> {generatedWorkout.totalDuration} min</span>
                    <span><Dumbbell size={14} /> {generatedWorkout.mainWorkout.length} exercises</span>
                    <span>🔥 ~{generatedWorkout.totalCalories} cal</span>
                  </p>
                </div>
              </div>
              <span className={`difficulty-badge ${generatedWorkout.difficulty}`}>
                {generatedWorkout.difficulty}
              </span>
            </div>

            <div className="workout-sections">
              <div className="workout-section">
                <h3>🔥 Warm-up</h3>
                <div className="exercise-list">
                  {generatedWorkout.warmup.map((exercise, idx) => (
                    <div key={idx} className="exercise-item warmup">
                      <span className="exercise-name">{exercise.name}</span>
                      <span className="exercise-detail">{exercise.duration}s</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="workout-section main">
                <h3>💪 Main Workout</h3>
                <div className="exercise-list">
                  {generatedWorkout.mainWorkout.map((exercise, idx) => (
                    <div key={idx} className="exercise-item">
                      <div className="exercise-info">
                        <span className="exercise-name">{exercise.name}</span>
                        <span className="exercise-muscle">{exercise.muscle}</span>
                      </div>
                      <span className="exercise-detail">
                        {exercise.reps ? `${exercise.reps} reps` : `${exercise.duration}s`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="workout-section">
                <h3>🧘 Cool-down</h3>
                <div className="exercise-list">
                  {generatedWorkout.cooldown.map((exercise, idx) => (
                    <div key={idx} className="exercise-item cooldown">
                      <span className="exercise-name">{exercise.name}</span>
                      <span className="exercise-detail">{exercise.duration}s</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="workout-actions">
              <button className="start-workout-btn">
                <Play size={20} />
                Start Workout
              </button>
              <button className="regenerate-btn" onClick={handleGenerate}>
                <RotateCcw size={18} />
                Generate Another
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AIWorkoutGenerator;
