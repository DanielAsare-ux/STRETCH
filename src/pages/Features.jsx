import { useState } from 'react';
import { 
  Sparkles, 
  Camera, 
  Activity, 
  Flame, 
  Smartphone, 
  Clock, 
  BarChart3,
  ChevronRight,
  Lock,
  Zap,
  Target,
  Eye
} from 'lucide-react';
import './Features.css';

function Features() {
  const [selectedFeature, setSelectedFeature] = useState(null);

  const upcomingFeatures = [
    {
      id: 1,
      name: 'AI-Generated Routines',
      icon: <Sparkles size={28} />,
      description: 'Personalized workout plans created by AI based on your goals, fitness level, and available equipment.',
      status: 'Coming Soon',
      preview: {
        title: 'Your AI Coach',
        details: [
          'Analyzes your workout history',
          'Adapts to your progress',
          'Suggests optimal rest days',
          'Creates balanced weekly plans'
        ]
      },
      color: '#c084fc'
    },
    {
      id: 2,
      name: 'Camera Form Correction',
      icon: <Camera size={28} />,
      description: 'Real-time form feedback using your device camera. Perfect for beginners learning proper technique.',
      status: 'In Development',
      preview: {
        title: 'Form Analysis',
        details: [
          'Real-time pose detection',
          'Voice feedback on form',
          'Rep counting automation',
          'Injury prevention alerts'
        ]
      },
      color: '#00d4ff'
    },
    {
      id: 3,
      name: 'Mobility Score System',
      icon: <Activity size={28} />,
      description: 'Track your flexibility and mobility progress with a comprehensive scoring system.',
      status: 'Coming Soon',
      preview: {
        title: 'Your Mobility Score',
        score: 72,
        breakdown: [
          { area: 'Shoulders', score: 85 },
          { area: 'Hips', score: 65 },
          { area: 'Spine', score: 70 },
          { area: 'Ankles', score: 68 }
        ]
      },
      color: '#00ff88'
    },
    {
      id: 4,
      name: 'Smart Streak System',
      icon: <Flame size={28} />,
      description: 'Intelligent streak tracking that accounts for rest days and rewards consistency over perfection.',
      status: 'Coming Soon',
      preview: {
        title: 'Smart Streaks',
        currentStreak: 14,
        details: [
          'Rest day protection',
          'Streak freezes available',
          'Weekly milestones',
          'Monthly challenges'
        ]
      },
      color: '#ff6b35'
    },
    {
      id: 5,
      name: 'AR Pose Previews',
      icon: <Eye size={28} />,
      description: 'View 3D exercise demonstrations overlaid in your space using augmented reality.',
      status: 'Planned',
      preview: {
        title: 'AR Preview',
        details: [
          '3D exercise models',
          'Adjustable speed playback',
          'Multiple angle views',
          'Mirror mode option'
        ]
      },
      color: '#ffb347'
    },
    {
      id: 6,
      name: '5-10 Min Quick Sessions',
      icon: <Clock size={28} />,
      description: 'Ultra-short workouts designed for busy schedules. Effective sessions anywhere, anytime.',
      status: 'Partially Available',
      preview: {
        title: 'Quick Sessions',
        sessions: [
          { name: 'Morning Energizer', duration: '5 min' },
          { name: 'Desk Break Stretch', duration: '7 min' },
          { name: 'Core Blast', duration: '8 min' },
          { name: 'Full Body HIIT', duration: '10 min' }
        ]
      },
      color: '#00d4ff'
    },
    {
      id: 7,
      name: 'Weekly Progress Scans',
      icon: <BarChart3 size={28} />,
      description: 'Use your camera or connected sensors to track body composition and posture changes weekly.',
      status: 'Planned',
      preview: {
        title: 'Progress Tracking',
        details: [
          'Body composition analysis',
          'Posture improvement tracking',
          'Measurement comparisons',
          'Photo progress timeline'
        ]
      },
      color: '#c084fc'
    }
  ];

  const getStatusClass = (status) => {
    switch (status) {
      case 'Partially Available':
        return 'available';
      case 'In Development':
        return 'development';
      case 'Coming Soon':
        return 'coming-soon';
      default:
        return 'planned';
    }
  };

  return (
    <div className="features-page">
      <header className="features-header">
        <div className="header-content">
          <h1>Future Features</h1>
          <p>Exciting capabilities coming to STRETCH</p>
        </div>
        <div className="beta-badge">
          <Zap size={16} />
          <span>Roadmap Preview</span>
        </div>
      </header>

      <section className="features-intro">
        <div className="intro-card">
          <Target size={32} />
          <div className="intro-text">
            <h3>Building the Future of Fitness</h3>
            <p>These features are in various stages of development. Some require advanced AI/ML infrastructure, camera APIs, and AR frameworks that we&apos;re actively working on.</p>
          </div>
        </div>
      </section>

      <section className="features-grid">
        {upcomingFeatures.map(feature => (
          <article 
            key={feature.id} 
            className={`feature-card ${selectedFeature === feature.id ? 'expanded' : ''}`}
            onClick={() => setSelectedFeature(selectedFeature === feature.id ? null : feature.id)}
            style={{ '--feature-color': feature.color }}
          >
            <div className="feature-header">
              <div className="feature-icon" style={{ background: `linear-gradient(135deg, ${feature.color}33, ${feature.color}11)` }}>
                {feature.icon}
              </div>
              <div className="feature-status">
                <span className={`status-badge ${getStatusClass(feature.status)}`}>
                  {feature.status === 'Planned' && <Lock size={12} />}
                  {feature.status}
                </span>
              </div>
            </div>
            
            <h3>{feature.name}</h3>
            <p className="feature-description">{feature.description}</p>
            
            <div className="feature-preview">
              <div className="preview-header">
                <span className="preview-title">{feature.preview.title}</span>
                <ChevronRight size={16} className={selectedFeature === feature.id ? 'rotated' : ''} />
              </div>
              
              {selectedFeature === feature.id && (
                <div className="preview-content">
                  {feature.preview.score && (
                    <div className="score-display">
                      <div className="score-circle" style={{ '--score-color': feature.color }}>
                        <span className="score-value">{feature.preview.score}</span>
                        <span className="score-label">Score</span>
                      </div>
                      <div className="score-breakdown">
                        {feature.preview.breakdown?.map((item, idx) => (
                          <div key={idx} className="breakdown-item">
                            <span className="breakdown-label">{item.area}</span>
                            <div className="breakdown-bar">
                              <div 
                                className="breakdown-fill" 
                                style={{ width: `${item.score}%`, background: feature.color }}
                              />
                            </div>
                            <span className="breakdown-value">{item.score}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {feature.preview.currentStreak && (
                    <div className="streak-display">
                      <div className="streak-number">
                        <Flame size={24} />
                        <span>{feature.preview.currentStreak}</span>
                        <small>Day Streak</small>
                      </div>
                    </div>
                  )}
                  
                  {feature.preview.sessions && (
                    <div className="sessions-list">
                      {feature.preview.sessions.map((session, idx) => (
                        <div key={idx} className="session-item">
                          <Clock size={14} />
                          <span className="session-name">{session.name}</span>
                          <span className="session-duration">{session.duration}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {feature.preview.details && !feature.preview.score && !feature.preview.sessions && (
                    <ul className="preview-details">
                      {feature.preview.details.map((detail, idx) => (
                        <li key={idx}>
                          <Sparkles size={12} />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
            
            <button className="notify-btn" onClick={(e) => e.stopPropagation()}>
              <Smartphone size={16} />
              Get Notified
            </button>
          </article>
        ))}
      </section>

      <section className="features-cta">
        <div className="cta-content">
          <h2>Want These Features Faster?</h2>
          <p>Your feedback helps us prioritize development. Let us know which features matter most to you!</p>
          <button className="feedback-btn">
            <Sparkles size={18} />
            Share Your Feedback
          </button>
        </div>
      </section>
    </div>
  );
}

export default Features;
