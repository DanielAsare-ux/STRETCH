/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// Helper function to get initial auth state
const getInitialAuthState = () => {
  const saved = localStorage.getItem('stretchAuthData');
  if (saved) {
    const parsed = JSON.parse(saved);
    return {
      ...parsed,
      isAuthenticated: true
    };
  }
  return {
    user: null,
    isAuthenticated: false
  };
};

// Helper to get registered users
const getRegisteredUsers = () => {
  const saved = localStorage.getItem('stretchRegisteredUsers');
  return saved ? JSON.parse(saved) : [];
};

// Helper to save registered users
const saveRegisteredUsers = (users) => {
  localStorage.setItem('stretchRegisteredUsers', JSON.stringify(users));
};

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState(getInitialAuthState);

  // Save to localStorage whenever auth state changes
  useEffect(() => {
    if (authState.isAuthenticated && authState.user) {
      localStorage.setItem('stretchAuthData', JSON.stringify({
        user: authState.user
      }));
    }
  }, [authState]);

  const login = (email, password) => {
    const users = getRegisteredUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      const userData = {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar || '🏋️',
        memberSince: user.memberSince
      };
      setAuthState({
        user: userData,
        isAuthenticated: true
      });
      return { success: true };
    }
    return { success: false, error: 'Invalid email or password' };
  };

  const register = (name, email, password) => {
    const users = getRegisteredUsers();
    
    // Check if email already exists
    if (users.find(u => u.email === email)) {
      return { success: false, error: 'Email already registered' };
    }

    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password,
      avatar: '🏋️',
      memberSince: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    };

    users.push(newUser);
    saveRegisteredUsers(users);

    // Auto login after registration
    const userData = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      avatar: newUser.avatar,
      memberSince: newUser.memberSince
    };
    setAuthState({
      user: userData,
      isAuthenticated: true
    });

    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem('stretchAuthData');
    setAuthState({
      user: null,
      isAuthenticated: false
    });
  };

  const updateProfile = (updates) => {
    setAuthState(prev => ({
      ...prev,
      user: {
        ...prev.user,
        ...updates
      }
    }));
    
    // Also update in registered users
    const users = getRegisteredUsers();
    const userIndex = users.findIndex(u => u.id === authState.user?.id);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updates };
      saveRegisteredUsers(users);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      ...authState,
      login,
      register,
      logout,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
