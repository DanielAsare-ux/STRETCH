import { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Camera, 
  Play, 
  Square, 
  RotateCcw, 
  CheckCircle, 
  AlertTriangle,
  Info,
  Volume2,
  VolumeX
} from 'lucide-react';
import * as poseDetection from '@tensorflow-models/pose-detection';
import '@tensorflow/tfjs-backend-webgl';
import './FormCorrection.css';

function FormCorrection() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [detector, setDetector] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [formFeedback, setFormFeedback] = useState([]);
  const [repCount, setRepCount] = useState(0);
  const [formScore, setFormScore] = useState(100);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [phase, setPhase] = useState('up'); // 'up' or 'down' for rep counting
  const animationRef = useRef(null);

  const exercises = [
    { 
      id: 'squat', 
      name: 'Squat', 
      icon: '🦵',
      description: 'Track your squat depth and knee alignment',
      checkPoints: ['Keep knees over toes', 'Back straight', 'Go below parallel']
    },
    { 
      id: 'pushup', 
      name: 'Push-Up', 
      icon: '💪',
      description: 'Monitor elbow angle and body alignment',
      checkPoints: ['Elbows at 45°', 'Core engaged', 'Full range of motion']
    },
    { 
      id: 'plank', 
      name: 'Plank', 
      icon: '🧘',
      description: 'Check hip alignment and core activation',
      checkPoints: ['Hips level', 'Core tight', 'Neutral spine']
    },
    { 
      id: 'lunge', 
      name: 'Lunge', 
      icon: '🏃',
      description: 'Ensure proper knee and hip positioning',
      checkPoints: ['Front knee at 90°', 'Back knee near floor', 'Torso upright']
    }
  ];

  // Initialize pose detector
  useEffect(() => {
    const initDetector = async () => {
      try {
        setIsLoading(true);
        const model = poseDetection.SupportedModels.MoveNet;
        const detectorConfig = {
          modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
          enableSmoothing: true
        };
        const det = await poseDetection.createDetector(model, detectorConfig);
        setDetector(det);
        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing pose detector:', error);
        setIsLoading(false);
        setCameraError('Failed to load AI model. Please refresh the page.');
      }
    };
    initDetector();

    return () => {
      const currentAnimationRef = animationRef.current;
      if (currentAnimationRef) {
        cancelAnimationFrame(currentAnimationRef);
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: 640, 
          height: 480,
          facingMode: 'user'
        }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
        };
      }
      setCameraError(null);
    } catch (error) {
      console.error('Error accessing camera:', error);
      setCameraError('Unable to access camera. Please allow camera permissions.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    setIsRunning(false);
  };

  // Calculate angle between three points
  const calculateAngle = (a, b, c) => {
    const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
    let angle = Math.abs(radians * 180 / Math.PI);
    if (angle > 180) angle = 360 - angle;
    return angle;
  };

  // Analyze pose for exercise form
  const analyzePose = useCallback((keypoints) => {
    if (!selectedExercise || keypoints.length === 0) return;

    const feedback = [];
    let score = 100;

    // Get keypoints by name
    const getKeypoint = (name) => keypoints.find(kp => kp.name === name);
    
    const leftShoulder = getKeypoint('left_shoulder');
    const leftElbow = getKeypoint('left_elbow');
    const leftWrist = getKeypoint('left_wrist');
    const leftHip = getKeypoint('left_hip');
    const leftKnee = getKeypoint('left_knee');
    const leftAnkle = getKeypoint('left_ankle');

    if (selectedExercise.id === 'squat') {
      // Check knee angle for squat depth
      if (leftHip && leftKnee && leftAnkle && leftHip.score > 0.3 && leftKnee.score > 0.3 && leftAnkle.score > 0.3) {
        const kneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle);
        
        if (kneeAngle < 90) {
          feedback.push({ type: 'success', message: '✓ Great depth! Below parallel' });
          // Count rep when going back up
          if (phase === 'down') {
            setRepCount(prev => prev + 1);
            setPhase('up');
            if (soundEnabled) {
              // Play rep sound
              const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdH2DgYJ/fn57fHt7fH19fn9/gH+AgH9/fn9/f4CAgIB/f4CAf3+AgICAgIB/gICBgYGBgYGBgoKBgoKCgoKCgoKCgoKCg4ODg4ODg4ODg4ODg4KCgoKCgoKCgoKCgoKCgoKCgoKCgYGBgYGBgYCAgIB/f39/fn5+fX19fHx8e3t7enp6eXl5eHh4d3d3dnZ2dXV1dHR0c3NzcnJycXFxcHBwb29vbm5ubW1tbGxsa2tram');
              audio.volume = 0.3;
              audio.play().catch(() => {});
            }
          }
        } else if (kneeAngle < 120) {
          feedback.push({ type: 'warning', message: '⚠ Go deeper for full range' });
          score -= 15;
          setPhase('down');
        } else {
          feedback.push({ type: 'info', message: 'ℹ Bend your knees more' });
          score -= 25;
          setPhase('up');
        }

        // Check if knees are going past toes (simplified check)
        if (leftKnee.x > leftAnkle.x + 50) {
          feedback.push({ type: 'warning', message: '⚠ Keep knees behind toes' });
          score -= 10;
        }
      }

      // Check back alignment
      if (leftShoulder && leftHip && leftShoulder.score > 0.3 && leftHip.score > 0.3) {
        const backAngle = Math.abs(leftShoulder.x - leftHip.x);
        if (backAngle > 80) {
          feedback.push({ type: 'warning', message: '⚠ Keep your back straighter' });
          score -= 15;
        } else {
          feedback.push({ type: 'success', message: '✓ Good back position' });
        }
      }
    }

    if (selectedExercise.id === 'pushup') {
      // Check elbow angle
      if (leftShoulder && leftElbow && leftWrist && 
          leftShoulder.score > 0.3 && leftElbow.score > 0.3 && leftWrist.score > 0.3) {
        const elbowAngle = calculateAngle(leftShoulder, leftElbow, leftWrist);
        
        if (elbowAngle < 100) {
          feedback.push({ type: 'success', message: '✓ Great depth!' });
          if (phase === 'down') {
            setRepCount(prev => prev + 1);
            setPhase('up');
          }
        } else if (elbowAngle < 140) {
          feedback.push({ type: 'warning', message: '⚠ Go lower' });
          score -= 15;
          setPhase('down');
        } else {
          feedback.push({ type: 'info', message: 'ℹ Bend elbows more' });
          setPhase('up');
        }
      }

      // Check body alignment (hip sag)
      if (leftShoulder && leftHip && leftAnkle &&
          leftShoulder.score > 0.3 && leftHip.score > 0.3 && leftAnkle.score > 0.3) {
        const bodyAngle = calculateAngle(leftShoulder, leftHip, leftAnkle);
        if (bodyAngle < 160) {
          feedback.push({ type: 'warning', message: '⚠ Keep hips level - don\'t sag' });
          score -= 20;
        } else {
          feedback.push({ type: 'success', message: '✓ Body alignment good' });
        }
      }
    }

    if (selectedExercise.id === 'plank') {
      // Check body alignment
      if (leftShoulder && leftHip && leftAnkle &&
          leftShoulder.score > 0.3 && leftHip.score > 0.3 && leftAnkle.score > 0.3) {
        const bodyAngle = calculateAngle(leftShoulder, leftHip, leftAnkle);
        
        if (bodyAngle > 165 && bodyAngle < 195) {
          feedback.push({ type: 'success', message: '✓ Perfect plank position!' });
        } else if (bodyAngle < 165) {
          feedback.push({ type: 'warning', message: '⚠ Hips too low - lift them up' });
          score -= 20;
        } else {
          feedback.push({ type: 'warning', message: '⚠ Hips too high - lower them' });
          score -= 15;
        }
      }

      // Check shoulder position
      if (leftShoulder && leftElbow && leftShoulder.score > 0.3 && leftElbow.score > 0.3) {
        if (Math.abs(leftShoulder.x - leftElbow.x) < 30) {
          feedback.push({ type: 'success', message: '✓ Shoulders over elbows' });
        } else {
          feedback.push({ type: 'info', message: 'ℹ Align shoulders over elbows' });
          score -= 10;
        }
      }
    }

    if (selectedExercise.id === 'lunge') {
      // Check front knee angle
      if (leftHip && leftKnee && leftAnkle &&
          leftHip.score > 0.3 && leftKnee.score > 0.3 && leftAnkle.score > 0.3) {
        const kneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle);
        
        if (kneeAngle >= 85 && kneeAngle <= 95) {
          feedback.push({ type: 'success', message: '✓ Perfect 90° knee angle' });
          if (phase === 'down') {
            setRepCount(prev => prev + 1);
            setPhase('up');
          }
        } else if (kneeAngle < 85) {
          feedback.push({ type: 'warning', message: '⚠ Knee too bent' });
          score -= 10;
          setPhase('down');
        } else if (kneeAngle > 120) {
          feedback.push({ type: 'info', message: 'ℹ Go deeper into lunge' });
          setPhase('up');
        }
      }

      // Check torso position
      if (leftShoulder && leftHip && leftShoulder.score > 0.3 && leftHip.score > 0.3) {
        const torsoAngle = Math.abs(leftShoulder.x - leftHip.x);
        if (torsoAngle < 30) {
          feedback.push({ type: 'success', message: '✓ Torso upright' });
        } else {
          feedback.push({ type: 'warning', message: '⚠ Keep torso more upright' });
          score -= 15;
        }
      }
    }

    setFormScore(Math.max(0, Math.min(100, score)));
    setFormFeedback(feedback);
  }, [selectedExercise, phase, soundEnabled]);

  // Draw pose on canvas
  const drawPose = useCallback((keypoints, ctx) => {
    // Draw skeleton connections
    const connections = [
      ['left_shoulder', 'right_shoulder'],
      ['left_shoulder', 'left_elbow'],
      ['left_elbow', 'left_wrist'],
      ['right_shoulder', 'right_elbow'],
      ['right_elbow', 'right_wrist'],
      ['left_shoulder', 'left_hip'],
      ['right_shoulder', 'right_hip'],
      ['left_hip', 'right_hip'],
      ['left_hip', 'left_knee'],
      ['left_knee', 'left_ankle'],
      ['right_hip', 'right_knee'],
      ['right_knee', 'right_ankle'],
    ];

    const getKeypoint = (name) => keypoints.find(kp => kp.name === name);

    ctx.strokeStyle = '#00d4ff';
    ctx.lineWidth = 3;

    connections.forEach(([from, to]) => {
      const fromKp = getKeypoint(from);
      const toKp = getKeypoint(to);
      if (fromKp && toKp && fromKp.score > 0.3 && toKp.score > 0.3) {
        ctx.beginPath();
        ctx.moveTo(fromKp.x, fromKp.y);
        ctx.lineTo(toKp.x, toKp.y);
        ctx.stroke();
      }
    });

    // Draw keypoints
    keypoints.forEach(keypoint => {
      if (keypoint.score > 0.3) {
        ctx.beginPath();
        ctx.arc(keypoint.x, keypoint.y, 6, 0, 2 * Math.PI);
        ctx.fillStyle = '#c084fc';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });
  }, []);

  // Detection loop
  useEffect(() => {
    let animationId;
    
    const detectPose = async () => {
      if (!detector || !videoRef.current || !canvasRef.current || !isRunning) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      if (video.readyState === 4) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Draw video frame
        ctx.drawImage(video, 0, 0);

        try {
          const poses = await detector.estimatePoses(video);
          if (poses.length > 0) {
            drawPose(poses[0].keypoints, ctx);
            analyzePose(poses[0].keypoints);
          }
        } catch (error) {
          console.error('Pose detection error:', error);
        }
      }

      animationId = requestAnimationFrame(detectPose);
    };
    
    if (isRunning && detector) {
      detectPose();
    }
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [detector, isRunning, drawPose, analyzePose]);

  const handleStart = async () => {
    await startCamera();
    setIsRunning(true);
    setRepCount(0);
    setFormScore(100);
    setFormFeedback([]);
    setPhase('up');
  };

  const handleStop = () => {
    stopCamera();
    setIsRunning(false);
  };

  const handleReset = () => {
    setRepCount(0);
    setFormScore(100);
    setFormFeedback([]);
    setPhase('up');
  };

  const getScoreColor = () => {
    if (formScore >= 80) return '#00ff88';
    if (formScore >= 60) return '#ffb347';
    return '#ff4444';
  };

  return (
    <div className="form-correction">
      <header className="correction-header">
        <div className="header-content">
          <h1><Camera className="header-icon" /> Form Correction</h1>
          <p>AI-powered real-time form feedback using your camera</p>
        </div>
      </header>

      {!selectedExercise ? (
        <div className="exercise-selection">
          <h2>Select an Exercise</h2>
          <div className="exercise-grid">
            {exercises.map(exercise => (
              <button
                key={exercise.id}
                className="exercise-card"
                onClick={() => setSelectedExercise(exercise)}
                disabled={isLoading}
              >
                <span className="exercise-icon">{exercise.icon}</span>
                <h3>{exercise.name}</h3>
                <p>{exercise.description}</p>
                <div className="checkpoints">
                  {exercise.checkPoints.map((point, idx) => (
                    <span key={idx} className="checkpoint">✓ {point}</span>
                  ))}
                </div>
              </button>
            ))}
          </div>
          {isLoading && (
            <div className="loading-indicator">
              <div className="loading-spinner" />
              <span>Loading AI model...</span>
            </div>
          )}
        </div>
      ) : (
        <div className="camera-view">
          <div className="camera-header">
            <button className="back-btn" onClick={() => {
              handleStop();
              setSelectedExercise(null);
            }}>
              ← Back
            </button>
            <h2>{selectedExercise.icon} {selectedExercise.name}</h2>
            <button 
              className="sound-toggle"
              onClick={() => setSoundEnabled(!soundEnabled)}
            >
              {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </button>
          </div>

          <div className="camera-container">
            <video ref={videoRef} className="camera-video" playsInline muted />
            <canvas ref={canvasRef} className="pose-canvas" />
            
            {!isRunning && !cameraError && (
              <div className="camera-overlay">
                <Camera size={48} />
                <p>Click Start to begin form analysis</p>
              </div>
            )}

            {cameraError && (
              <div className="camera-error">
                <AlertTriangle size={48} />
                <p>{cameraError}</p>
              </div>
            )}

            <div className="stats-overlay">
              <div className="stat-box reps">
                <span className="stat-value">{repCount}</span>
                <span className="stat-label">Reps</span>
              </div>
              <div className="stat-box score" style={{ '--score-color': getScoreColor() }}>
                <span className="stat-value">{formScore}</span>
                <span className="stat-label">Form Score</span>
              </div>
            </div>
          </div>

          <div className="feedback-panel">
            <h3>Real-time Feedback</h3>
            <div className="feedback-list">
              {formFeedback.length === 0 ? (
                <div className="no-feedback">
                  <Info size={20} />
                  <span>Start exercising to receive feedback</span>
                </div>
              ) : (
                formFeedback.map((item, idx) => (
                  <div key={idx} className={`feedback-item ${item.type}`}>
                    {item.type === 'success' && <CheckCircle size={16} />}
                    {item.type === 'warning' && <AlertTriangle size={16} />}
                    {item.type === 'info' && <Info size={16} />}
                    <span>{item.message}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="camera-controls">
            {!isRunning ? (
              <button className="control-btn start" onClick={handleStart}>
                <Play size={24} />
                Start
              </button>
            ) : (
              <button className="control-btn stop" onClick={handleStop}>
                <Square size={24} />
                Stop
              </button>
            )}
            <button className="control-btn reset" onClick={handleReset}>
              <RotateCcw size={20} />
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default FormCorrection;
