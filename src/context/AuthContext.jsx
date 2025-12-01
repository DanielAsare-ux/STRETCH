/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// Premium subscription details
const PREMIUM_PRICE = 50; // 50 cedis per month
const PREMIUM_FEATURES = [
  'Unlimited AI-generated workout plans',
  'Advanced form correction with video analysis',
  'Personalized nutrition recommendations',
  'Priority customer support',
  'Ad-free experience',
  'Exclusive premium workouts',
  'Detailed progress analytics',
  'Custom workout scheduling'
];

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
    isAuthenticated: false,
    isPremium: false,
    premiumExpiresAt: null
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

// Helper to check if premium is still valid
const checkPremiumStatus = (user) => {
  if (!user?.premiumExpiresAt) return false;
  return new Date(user.premiumExpiresAt) > new Date();
};

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState(getInitialAuthState);

  // Save to localStorage whenever auth state changes
  useEffect(() => {
    if (authState.isAuthenticated && authState.user) {
      localStorage.setItem('stretchAuthData', JSON.stringify({
        user: authState.user,
        isPremium: authState.isPremium,
        premiumExpiresAt: authState.premiumExpiresAt
      }));
    }
  }, [authState]);

  // Derive premium status from user data (no effect needed)
  const isPremium = authState.user ? checkPremiumStatus(authState.user) : false;

  const login = (email, password) => {
    const users = getRegisteredUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      const isPremiumValid = checkPremiumStatus(user);
      const userData = {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar || '🏋️',
        memberSince: user.memberSince,
        premiumExpiresAt: user.premiumExpiresAt
      };
      setAuthState({
        user: userData,
        isAuthenticated: true,
        isPremium: isPremiumValid,
        premiumExpiresAt: user.premiumExpiresAt
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
      isAuthenticated: true,
      isPremium: false,
      premiumExpiresAt: null
    });

    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem('stretchAuthData');
    setAuthState({
      user: null,
      isAuthenticated: false,
      isPremium: false,
      premiumExpiresAt: null
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

  // Upgrade to premium (simulated - in real app, this would be called after successful payment)
  const upgradeToPremium = (transactionId) => {
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 1); // 1 month subscription
    
    const premiumData = {
      premiumExpiresAt: expiresAt.toISOString(),
      lastTransactionId: transactionId
    };

    // Update auth state
    setAuthState(prev => ({
      ...prev,
      isPremium: true,
      premiumExpiresAt: expiresAt.toISOString(),
      user: {
        ...prev.user,
        ...premiumData
      }
    }));

    // Update in registered users
    const users = getRegisteredUsers();
    const userIndex = users.findIndex(u => u.id === authState.user?.id);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...premiumData };
      saveRegisteredUsers(users);
    }

    return { success: true, expiresAt: expiresAt.toISOString() };
  };

  return (
    <AuthContext.Provider value={{ 
      ...authState,
      isPremium,
      premiumExpiresAt: authState.user?.premiumExpiresAt,
      login,
      register,
      logout,
      updateProfile,
      upgradeToPremium,
      PREMIUM_PRICE,
      PREMIUM_FEATURES
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
