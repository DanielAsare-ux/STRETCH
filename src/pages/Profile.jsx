import { useState } from 'react';
import { User, Settings, Bell, Moon, LogOut, Edit3, Target, Award, Calendar, ChevronRight, Save } from 'lucide-react';
import './Profile.css';

function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: true,
    reminders: true,
    weeklyReport: true
  });

  const user = {
    name: 'Alex Johnson',
    email: 'alex.johnson@email.com',
    avatar: '🏋️',
    memberSince: 'January 2024',
    level: 'Pro',
    points: 2450
  };

  const goals = [
    { id: 1, name: 'Target Weight', value: '70 kg', progress: 75, icon: <Target size={20} /> },
    { id: 2, name: 'Weekly Workouts', value: '5 sessions', progress: 80, icon: <Calendar size={20} /> },
    { id: 3, name: 'Daily Steps', value: '10,000 steps', progress: 60, icon: <Award size={20} /> }
  ];

  const stats = [
    { label: 'Total Workouts', value: '127' },
    { label: 'Calories Burned', value: '45,230' },
    { label: 'Hours Active', value: '89' },
    { label: 'Achievements', value: '12' }
  ];

  const toggleSetting = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="profile-page">
      <header className="profile-header">
        <div className="header-content">
          <h1>Profile</h1>
          <p>Manage your account and preferences</p>
        </div>
      </header>

      <div className="profile-grid">
        <section className="user-card">
          <div className="user-avatar">
            <span className="avatar-emoji">{user.avatar}</span>
            <button className="edit-avatar-btn" aria-label="Edit avatar">
              <Edit3 size={14} />
            </button>
          </div>
          <div className="user-info">
            <h2>{user.name}</h2>
            <p className="user-email">{user.email}</p>
            <div className="user-badges">
              <span className="badge level">{user.level}</span>
              <span className="badge points">⭐ {user.points} pts</span>
            </div>
          </div>
          <p className="member-since">Member since {user.memberSince}</p>
          <button 
            className={`edit-profile-btn ${isEditing ? 'save' : ''}`}
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? (
              <>
                <Save size={18} />
                Save Changes
              </>
            ) : (
              <>
                <Edit3 size={18} />
                Edit Profile
              </>
            )}
          </button>
        </section>

        <section className="stats-section">
          <h2>Your Stats</h2>
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-item">
                <span className="stat-value">{stat.value}</span>
                <span className="stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="goals-section">
          <h2>Your Goals</h2>
          <div className="goals-list">
            {goals.map(goal => (
              <div key={goal.id} className="goal-item">
                <div className="goal-icon">{goal.icon}</div>
                <div className="goal-info">
                  <div className="goal-header">
                    <span className="goal-name">{goal.name}</span>
                    <span className="goal-value">{goal.value}</span>
                  </div>
                  <div className="goal-progress">
                    <div 
                      className="goal-progress-fill"
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                  <span className="goal-percentage">{goal.progress}% complete</span>
                </div>
                <button className="goal-edit-btn" aria-label={`Edit ${goal.name}`}>
                  <ChevronRight size={20} />
                </button>
              </div>
            ))}
          </div>
          <button className="add-goal-btn">+ Add New Goal</button>
        </section>

        <section className="settings-section">
          <h2><Settings size={22} /> Settings</h2>
          <div className="settings-list">
            <div className="setting-item">
              <div className="setting-info">
                <Bell size={20} />
                <div>
                  <span className="setting-name">Push Notifications</span>
                  <span className="setting-description">Receive workout reminders</span>
                </div>
              </div>
              <label className="toggle">
                <input
                  type="checkbox"
                  checked={settings.notifications}
                  onChange={() => toggleSetting('notifications')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <Moon size={20} />
                <div>
                  <span className="setting-name">Dark Mode</span>
                  <span className="setting-description">Use dark theme</span>
                </div>
              </div>
              <label className="toggle">
                <input
                  type="checkbox"
                  checked={settings.darkMode}
                  onChange={() => toggleSetting('darkMode')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <Calendar size={20} />
                <div>
                  <span className="setting-name">Daily Reminders</span>
                  <span className="setting-description">Get reminded to exercise</span>
                </div>
              </div>
              <label className="toggle">
                <input
                  type="checkbox"
                  checked={settings.reminders}
                  onChange={() => toggleSetting('reminders')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <Award size={20} />
                <div>
                  <span className="setting-name">Weekly Report</span>
                  <span className="setting-description">Receive weekly progress summary</span>
                </div>
              </div>
              <label className="toggle">
                <input
                  type="checkbox"
                  checked={settings.weeklyReport}
                  onChange={() => toggleSetting('weeklyReport')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </section>

        <section className="account-section">
          <h2><User size={22} /> Account</h2>
          <div className="account-options">
            <button className="account-option">
              <span>Change Password</span>
              <ChevronRight size={20} />
            </button>
            <button className="account-option">
              <span>Privacy Settings</span>
              <ChevronRight size={20} />
            </button>
            <button className="account-option">
              <span>Connected Apps</span>
              <ChevronRight size={20} />
            </button>
            <button className="account-option">
              <span>Data & Storage</span>
              <ChevronRight size={20} />
            </button>
            <button className="account-option danger">
              <LogOut size={20} />
              <span>Sign Out</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Profile;
