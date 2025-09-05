import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'teacher' | 'parent' | 'student';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  avatar?: string;
  // Teacher specific
  classId?: string;
  subject?: string;
  // Parent specific
  children?: string[];
  // Student specific
  parentId?: string;
  grade?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data for prototype
const mockUsers: Record<UserRole, User> = {
  teacher: {
    id: 'teacher-1',
    name: 'Ms. Sarah Johnson',
    role: 'teacher',
    email: 'sarah.johnson@edubridge.com',
    avatar: '/api/placeholder/40/40',
    classId: 'class-5a',
    subject: 'English & Literature'
  },
  parent: {
    id: 'parent-1',
    name: 'Mr. Raj Sharma',
    role: 'parent',
    email: 'raj.sharma@gmail.com',
    avatar: '/api/placeholder/40/40',
    children: ['student-1']
  },
  student: {
    id: 'student-1',
    name: 'Aadhya Sharma',
    role: 'student',
    email: 'aadhya.sharma@student.edubridge.com',
    avatar: '/api/placeholder/40/40',
    parentId: 'parent-1',
    grade: '5th Grade'
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('edubridge-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string, role: UserRole) => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock authentication - in real app, validate credentials
    const mockUser = mockUsers[role];
    setUser(mockUser);
    localStorage.setItem('edubridge-user', JSON.stringify(mockUser));
    
    setLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('edubridge-user');
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}