import { NavLink } from 'react-router-dom';
import { Home, Dumbbell, Apple, TrendingUp, User, Sparkles, Crown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Navigation.css';

function Navigation() {
  const { isPremium } = useAuth();

  return (
    <nav className="navigation">
      <div className="nav-brand">
        <Dumbbell className="brand-icon" />
        <span className="brand-name">STRETCH</span>
      </div>
      <ul className="nav-links">
        <li>
          <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <Home size={20} />
            <span>Home</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/workouts" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <Dumbbell size={20} />
            <span>Workouts</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/nutrition" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <Apple size={20} />
            <span>Nutrition</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/progress" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <TrendingUp size={20} />
            <span>Progress</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/profile" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <User size={20} />
            <span>Profile</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/features" className={({ isActive }) => isActive ? 'nav-link active features-link' : 'nav-link features-link'}>
            <Sparkles size={20} />
            <span>Features</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/premium" className={({ isActive }) => `nav-link premium-link ${isActive ? 'active' : ''} ${isPremium ? 'is-premium' : ''}`}>
            <Crown size={20} />
            <span>{isPremium ? 'Premium ✓' : 'Premium'}</span>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Navigation;
