import { useState } from 'react';
import { 
  Activity, 
  ChevronRight, 
  RotateCcw,
  Award,
  TrendingUp,
  CheckCircle
} from 'lucide-react';
import './MobilityScore.css';

function MobilityScore() {
  const [currentTest, setCurrentTest] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const mobilityTests = [
    {
      id: 'shoulders',
      name: 'Shoulder Mobility',
      icon: '💪',
      question: 'Can you touch your hands behind your back (one over shoulder, one from below)?',
      options: [
        { value: 5, label: 'Fingers touch easily', description: 'Full overlap' },
        { value: 4, label: 'Fingers just touch', description: 'Tips touching' },
        { value: 3, label: 'Close but not touching', description: '1-2 inches gap' },
        { value: 2, label: 'Moderate gap', description: '3-5 inches gap' },
        { value: 1, label: 'Large gap', description: '6+ inches gap' },
      ]
    },
    {
      id: 'hips',
      name: 'Hip Flexibility',
      icon: '🦵',
      question: 'How deep can you squat with heels on the ground?',
      options: [
        { value: 5, label: 'Full deep squat', description: 'Butt to heels, heels down' },
        { value: 4, label: 'Below parallel', description: 'Thighs below horizontal' },
        { value: 3, label: 'Parallel squat', description: 'Thighs horizontal' },
        { value: 2, label: 'Above parallel', description: 'Slight knee bend' },
        { value: 1, label: 'Very limited', description: 'Heels come up early' },
      ]
    },
    {
      id: 'hamstrings',
      name: 'Hamstring Flexibility',
      icon: '🧘',
      question: 'Standing with straight legs, how far can you reach toward your toes?',
      options: [
        { value: 5, label: 'Palms flat on floor', description: 'Excellent flexibility' },
        { value: 4, label: 'Touch toes easily', description: 'Good flexibility' },
        { value: 3, label: 'Touch toes with effort', description: 'Average flexibility' },
        { value: 2, label: 'Reach ankles', description: 'Below average' },
        { value: 1, label: 'Reach shins or higher', description: 'Limited flexibility' },
      ]
    },
    {
      id: 'spine',
      name: 'Spine Mobility',
      icon: '🔄',
      question: 'Sitting with legs extended, how far can you rotate your torso?',
      options: [
        { value: 5, label: 'Full 90° rotation', description: 'Can look behind easily' },
        { value: 4, label: 'Good rotation (70-80°)', description: 'Comfortable twist' },
        { value: 3, label: 'Moderate rotation (50-60°)', description: 'Some restriction' },
        { value: 2, label: 'Limited rotation (30-40°)', description: 'Noticeable tightness' },
        { value: 1, label: 'Minimal rotation (<30°)', description: 'Very restricted' },
      ]
    },
    {
      id: 'ankles',
      name: 'Ankle Mobility',
      icon: '🦶',
      question: 'In a lunge position, how far can your knee go past your toes while heel stays down?',
      options: [
        { value: 5, label: '4+ inches past toes', description: 'Excellent dorsiflexion' },
        { value: 4, label: '2-3 inches past toes', description: 'Good mobility' },
        { value: 3, label: 'Knee at toes', description: 'Average mobility' },
        { value: 2, label: 'Knee behind toes', description: 'Limited mobility' },
        { value: 1, label: 'Heel comes up', description: 'Very limited' },
      ]
    },
    {
      id: 'wrists',
      name: 'Wrist Mobility',
      icon: '✋',
      question: 'Can you place palms flat on floor with fingers pointing toward you (tabletop position)?',
      options: [
        { value: 5, label: 'Completely flat, no pain', description: 'Excellent mobility' },
        { value: 4, label: 'Flat with slight discomfort', description: 'Good mobility' },
        { value: 3, label: 'Fingers slightly lifted', description: 'Average mobility' },
        { value: 2, label: 'Only fingertips down', description: 'Limited mobility' },
        { value: 1, label: 'Cannot do this', description: 'Very restricted' },
      ]
    }
  ];

  const handleAnswer = (testId, value) => {
    setAnswers({ ...answers, [testId]: value });
    
    if (currentTest < mobilityTests.length - 1) {
      setCurrentTest(currentTest + 1);
    } else {
      setShowResults(true);
    }
  };

  const calculateResults = () => {
    const results = mobilityTests.map(test => ({
      ...test,
      score: answers[test.id] || 0,
      maxScore: 5,
      percentage: ((answers[test.id] || 0) / 5) * 100
    }));

    const totalScore = Object.values(answers).reduce((sum, val) => sum + val, 0);
    const maxPossible = mobilityTests.length * 5;
    const overallPercentage = Math.round((totalScore / maxPossible) * 100);

    return { results, totalScore, maxPossible, overallPercentage };
  };

  const getScoreLevel = (percentage) => {
    if (percentage >= 80) return { level: 'Excellent', color: '#00ff88', advice: 'Maintain your excellent mobility with regular stretching.' };
    if (percentage >= 60) return { level: 'Good', color: '#00d4ff', advice: 'Focus on your weaker areas to achieve balanced mobility.' };
    if (percentage >= 40) return { level: 'Fair', color: '#ffb347', advice: 'Regular mobility work will significantly improve your movement.' };
    return { level: 'Needs Work', color: '#ff4444', advice: 'Start with daily stretching routines to improve mobility.' };
  };

  const resetAssessment = () => {
    setCurrentTest(0);
    setAnswers({});
    setShowResults(false);
  };

  const getRecommendations = (results) => {
    const weak = results.filter(r => r.score <= 2);
    const recommendations = [];

    weak.forEach(area => {
      switch (area.id) {
        case 'shoulders':
          recommendations.push({
            area: 'Shoulders',
            exercises: ['Shoulder dislocates with band', 'Wall slides', 'Thread the needle stretch']
          });
          break;
        case 'hips':
          recommendations.push({
            area: 'Hips',
            exercises: ['Deep squat holds', '90/90 hip stretch', 'Pigeon pose']
          });
          break;
        case 'hamstrings':
          recommendations.push({
            area: 'Hamstrings',
            exercises: ['Standing forward fold', 'Seated pike stretch', 'Single leg RDL stretch']
          });
          break;
        case 'spine':
          recommendations.push({
            area: 'Spine',
            exercises: ['Cat-cow stretches', 'Seated spinal twist', 'Thread the needle']
          });
          break;
        case 'ankles':
          recommendations.push({
            area: 'Ankles',
            exercises: ['Wall ankle stretch', 'Ankle circles', 'Calf raises off step']
          });
          break;
        case 'wrists':
          recommendations.push({
            area: 'Wrists',
            exercises: ['Wrist circles', 'Prayer stretch', 'Finger extensions']
          });
          break;
        default:
          break;
      }
    });

    return recommendations;
  };

  if (showResults) {
    const { results, overallPercentage } = calculateResults();
    const scoreLevel = getScoreLevel(overallPercentage);
    const recommendations = getRecommendations(results);

    return (
      <div className="mobility-score">
        <header className="mobility-header">
          <h1><Activity className="header-icon" /> Mobility Score</h1>
          <button className="reset-btn" onClick={resetAssessment}>
            <RotateCcw size={16} /> Retake Assessment
          </button>
        </header>

        <div className="results-container">
          <div className="overall-score" style={{ '--score-color': scoreLevel.color }}>
            <div className="score-ring">
              <svg viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" className="ring-bg" />
                <circle 
                  cx="50" 
                  cy="50" 
                  r="45" 
                  className="ring-progress"
                  style={{ strokeDashoffset: 283 - (283 * overallPercentage / 100) }}
                />
              </svg>
              <div className="score-content">
                <span className="score-number">{overallPercentage}</span>
                <span className="score-label">Overall</span>
              </div>
            </div>
            <div className="score-info">
              <h2 style={{ color: scoreLevel.color }}>{scoreLevel.level}</h2>
              <p>{scoreLevel.advice}</p>
            </div>
          </div>

          <div className="breakdown-section">
            <h3><TrendingUp size={20} /> Detailed Breakdown</h3>
            <div className="breakdown-grid">
              {results.map(result => (
                <div key={result.id} className="breakdown-card">
                  <div className="breakdown-header">
                    <span className="breakdown-icon">{result.icon}</span>
                    <span className="breakdown-name">{result.name}</span>
                    <span 
                      className="breakdown-score"
                      style={{ color: result.percentage >= 60 ? '#00ff88' : result.percentage >= 40 ? '#ffb347' : '#ff4444' }}
                    >
                      {result.score}/5
                    </span>
                  </div>
                  <div className="breakdown-bar">
                    <div 
                      className="breakdown-fill"
                      style={{ 
                        width: `${result.percentage}%`,
                        background: result.percentage >= 60 ? '#00ff88' : result.percentage >= 40 ? '#ffb347' : '#ff4444'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {recommendations.length > 0 && (
            <div className="recommendations-section">
              <h3><Award size={20} /> Recommended Exercises</h3>
              <div className="recommendations-grid">
                {recommendations.map((rec, idx) => (
                  <div key={idx} className="recommendation-card">
                    <h4>{rec.area}</h4>
                    <ul>
                      {rec.exercises.map((ex, i) => (
                        <li key={i}>
                          <CheckCircle size={14} />
                          {ex}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  const currentTestData = mobilityTests[currentTest];

  return (
    <div className="mobility-score">
      <header className="mobility-header">
        <div className="header-content">
          <h1><Activity className="header-icon" /> Mobility Assessment</h1>
          <p>Answer honestly for accurate results</p>
        </div>
      </header>

      <div className="progress-bar-container">
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${((currentTest + 1) / mobilityTests.length) * 100}%` }}
          />
        </div>
        <span className="progress-text">
          Test {currentTest + 1} of {mobilityTests.length}
        </span>
      </div>

      <div className="test-card">
        <div className="test-header">
          <span className="test-icon">{currentTestData.icon}</span>
          <h2>{currentTestData.name}</h2>
        </div>
        
        <p className="test-question">{currentTestData.question}</p>

        <div className="options-list">
          {currentTestData.options.map(option => (
            <button
              key={option.value}
              className="option-btn"
              onClick={() => handleAnswer(currentTestData.id, option.value)}
            >
              <div className="option-content">
                <span className="option-label">{option.label}</span>
                <span className="option-desc">{option.description}</span>
              </div>
              <ChevronRight size={20} />
            </button>
          ))}
        </div>
      </div>

      <div className="test-dots">
        {mobilityTests.map((_, idx) => (
          <span 
            key={idx} 
            className={`dot ${idx === currentTest ? 'active' : ''} ${idx < currentTest ? 'completed' : ''}`}
          />
        ))}
      </div>
    </div>
  );
}

export default MobilityScore;
