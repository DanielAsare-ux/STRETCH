import { useState, useEffect, useCallback } from 'react';
import { X, Play, Pause, SkipForward, CheckCircle, Clock, Flame, Trophy } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import './WorkoutSession.css';

// Exercise database for generating workout exercises
const exercisesByCategory = {
  calisthenics: [
    { name: 'Push-Ups', reps: 15, duration: 45 },
    { name: 'Squats', reps: 20, duration: 60 },
    { name: 'Lunges', reps: 12, duration: 45 },
    { name: 'Plank Hold', duration: 30 },
    { name: 'Mountain Climbers', reps: 20, duration: 45 },
    { name: 'Burpees', reps: 10, duration: 60 },
    { name: 'Tricep Dips', reps: 15, duration: 45 },
    { name: 'Leg Raises', reps: 15, duration: 45 },
  ],
  cardio: [
    { name: 'Jumping Jacks', reps: 30, duration: 45 },
    { name: 'High Knees', duration: 45 },
    { name: 'Butt Kicks', duration: 45 },
    { name: 'Mountain Climbers', reps: 20, duration: 45 },
    { name: 'Burpees', reps: 10, duration: 60 },
    { name: 'Jump Squats', reps: 15, duration: 45 },
    { name: 'Running in Place', duration: 60 },
    { name: 'Star Jumps', reps: 15, duration: 45 },
  ],
  strength: [
    { name: 'Push-Ups', reps: 15, duration: 45 },
    { name: 'Diamond Push-Ups', reps: 10, duration: 45 },
    { name: 'Wide Push-Ups', reps: 12, duration: 45 },
    { name: 'Tricep Dips', reps: 15, duration: 45 },
    { name: 'Pike Push-Ups', reps: 10, duration: 45 },
    { name: 'Plank Hold', duration: 45 },
    { name: 'Superman Hold', duration: 30 },
    { name: 'Glute Bridges', reps: 20, duration: 45 },
  ],
  flexibility: [
    { name: 'Forward Fold', duration: 30 },
    { name: 'Downward Dog', duration: 30 },
    { name: 'Cat-Cow Stretch', duration: 30 },
    { name: 'Hip Flexor Stretch', duration: 30 },
    { name: 'Quad Stretch', duration: 30 },
    { name: 'Hamstring Stretch', duration: 30 },
    { name: 'Shoulder Stretch', duration: 30 },
    { name: "Child's Pose", duration: 30 },
  ],
  hiit: [
    { name: 'Burpees', reps: 10, duration: 45 },
    { name: 'Jump Squats', reps: 15, duration: 30 },
    { name: 'Mountain Climbers', reps: 30, duration: 30 },
    { name: 'High Knees', duration: 30 },
    { name: 'Push-Ups', reps: 15, duration: 30 },
    { name: 'Tuck Jumps', reps: 10, duration: 30 },
    { name: 'Plank Jacks', reps: 20, duration: 30 },
    { name: 'Speed Skaters', reps: 20, duration: 30 },
  ],
};

function WorkoutSession({ workout, onClose, onComplete }) {
  const { logWorkout } = useAppContext();
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [totalTimeElapsed, setTotalTimeElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [phase, setPhase] = useState('ready'); // ready, warmup, workout, rest, cooldown, complete
  const [exercises] = useState(() => {
    // Initialize exercises synchronously based on workout
    const category = workout.category || 'calisthenics';
    const availableExercises = exercisesByCategory[category] || exercisesByCategory.calisthenics;
    const shuffled = [...availableExercises].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, workout.exercises || 8);
  });
  const [caloriesBurned, setCaloriesBurned] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(3); // 3 second countdown to start

  const currentExercise = exercises[currentExerciseIndex];

  const handleComplete = useCallback(() => {
    const completedWorkout = {
      name: workout.name,
      duration: Math.ceil(totalTimeElapsed / 60),
      caloriesBurned: caloriesBurned,
      exercisesCompleted: exercises.length,
      completedAt: new Date().toISOString()
    };
    
    logWorkout(completedWorkout);
    setPhase('complete');
    
    if (onComplete) {
      onComplete(completedWorkout);
    }
  }, [workout.name, totalTimeElapsed, caloriesBurned, exercises.length, logWorkout, onComplete]);

  // Timer effect
  useEffect(() => {
    let interval = null;
    
    if (isRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            // Timer is about to hit 0, handle the transition in the next render
            return 0;
          }
          return prev - 1;
        });
        setTotalTimeElapsed(prev => prev + 1);
        
        // Calculate calories burned (approximately)
        if (phase === 'workout') {
          // Calculate calories per second, use default if workout values are missing or zero
          const caloriesPerSecond = (workout.calories && workout.duration) 
            ? workout.calories / (workout.duration * 60) 
            : 0.15;
          setCaloriesBurned(prev => prev + caloriesPerSecond);
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeRemaining, phase, workout.calories, workout.duration]);

  // Handle phase transitions when timer reaches 0
  useEffect(() => {
    if (!isRunning || timeRemaining !== 0) return;
    
    // Use setTimeout to schedule state updates after render
    const timeoutId = setTimeout(() => {
      if (phase === 'ready') {
        setPhase('workout');
        setTimeRemaining(currentExercise?.duration || 45);
        setIsRunning(true);
      } else if (phase === 'workout') {
        if (currentExerciseIndex < exercises.length - 1) {
          setPhase('rest');
          setTimeRemaining(15);
        } else {
          handleComplete();
        }
      } else if (phase === 'rest') {
        setCurrentExerciseIndex(prev => prev + 1);
        setPhase('workout');
        setTimeRemaining(exercises[currentExerciseIndex + 1]?.duration || 45);
      }
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [isRunning, timeRemaining, phase, currentExerciseIndex, exercises, currentExercise, handleComplete]);

  const togglePause = () => {
    setIsRunning(!isRunning);
  };

  const skipExercise = () => {
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
      setPhase('workout');
      setTimeRemaining(exercises[currentExerciseIndex + 1]?.duration || 45);
    } else {
      handleComplete();
    }
  };

  const startWorkout = () => {
    setIsRunning(true);
    setPhase('ready');
    setTimeRemaining(3);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (phase === 'complete') {
    return (
      <div className="workout-session-overlay">
        <div className="workout-session complete">
          <div className="complete-content">
            <div className="complete-icon">
              <Trophy size={64} />
            </div>
            <h2>Workout Complete! 🎉</h2>
            <p>Great job finishing {workout.name}!</p>
            
            <div className="complete-stats">
              <div className="complete-stat">
                <Clock size={24} />
                <span className="stat-value">{Math.ceil(totalTimeElapsed / 60)}</span>
                <span className="stat-label">Minutes</span>
              </div>
              <div className="complete-stat">
                <Flame size={24} />
                <span className="stat-value">{Math.round(caloriesBurned)}</span>
                <span className="stat-label">Calories</span>
              </div>
              <div className="complete-stat">
                <CheckCircle size={24} />
                <span className="stat-value">{exercises.length}</span>
                <span className="stat-label">Exercises</span>
              </div>
            </div>
            
            <button className="done-btn" onClick={onClose}>
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="workout-session-overlay">
      <div className="workout-session">
        <header className="session-header">
          <h2>{workout.name}</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </header>

        <div className="session-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${((currentExerciseIndex + 1) / exercises.length) * 100}%` }}
            />
          </div>
          <span className="progress-text">
            Exercise {currentExerciseIndex + 1} of {exercises.length}
          </span>
        </div>

        {phase === 'ready' && !isRunning && (
          <div className="ready-content">
            <h3>Ready to start?</h3>
            <p>Get into position for the first exercise</p>
            <div className="first-exercise-preview">
              <span className="exercise-name">{currentExercise?.name}</span>
              {currentExercise?.reps && <span className="exercise-reps">{currentExercise.reps} reps</span>}
            </div>
            <button className="start-btn" onClick={startWorkout}>
              <Play size={24} />
              Start Workout
            </button>
          </div>
        )}

        {(phase === 'ready' && isRunning) && (
          <div className="countdown-content">
            <h3>Get Ready!</h3>
            <div className="big-timer">{timeRemaining}</div>
            <p>{currentExercise?.name}</p>
          </div>
        )}

        {phase === 'workout' && currentExercise && (
          <div className="exercise-content">
            <div className="exercise-display">
              <h3>{currentExercise.name}</h3>
              {currentExercise.reps && (
                <p className="exercise-reps">{currentExercise.reps} reps</p>
              )}
            </div>
            
            <div className="timer-display">
              <div className="timer-circle">
                <svg viewBox="0 0 100 100">
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="45" 
                    className="timer-bg"
                  />
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="45" 
                    className="timer-progress"
                    style={{ 
                      strokeDashoffset: 283 - (283 * (timeRemaining / (currentExercise.duration || 45)))
                    }}
                  />
                </svg>
                <span className="timer-value">{timeRemaining}</span>
              </div>
            </div>

            <div className="session-controls">
              <button className="control-btn skip" onClick={skipExercise}>
                <SkipForward size={20} />
                Skip
              </button>
              <button className="control-btn pause" onClick={togglePause}>
                {isRunning ? <Pause size={24} /> : <Play size={24} />}
              </button>
            </div>
          </div>
        )}

        {phase === 'rest' && (
          <div className="rest-content">
            <h3>Rest</h3>
            <div className="big-timer">{timeRemaining}</div>
            <p>Next: {exercises[currentExerciseIndex + 1]?.name}</p>
            <button className="skip-rest-btn" onClick={skipExercise}>
              Skip Rest
            </button>
          </div>
        )}

        <div className="session-stats">
          <div className="session-stat">
            <Clock size={16} />
            <span>{formatTime(totalTimeElapsed)}</span>
          </div>
          <div className="session-stat">
            <Flame size={16} />
            <span>{Math.round(caloriesBurned)} cal</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WorkoutSession;
