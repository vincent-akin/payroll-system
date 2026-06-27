// src/lib/hooks/useAuth.ts
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../api/auth';
import { User } from '@/types';
import toast from 'react-hot-toast';

export const useAuth = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const login = async (email: string, password: string) => {
    try {
      console.log('Calling login API...');
      const response = await authService.login(email, password);
      console.log('Login response:', response);
      
      if (response.success && response.data) {
        const { user, accessToken, refreshToken } = response.data;
        
        // Store tokens
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        setUser(user);
        
        toast.success('Login successful!');
        
        // Wait a moment before redirecting
        setTimeout(() => {
          router.push('/dashboard');
        }, 100);
        
        return { success: true };
      } else {
        const errorMsg = response.message || 'Login failed';
        console.error('Login failed:', errorMsg);
        toast.error(errorMsg);
        return { success: false, error: errorMsg };
      }
    } catch (error: any) {
      console.error('Login error details:', error);
      
      let errorMessage = 'Login failed. Please try again.';
      
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        errorMessage = error.response.data?.message || error.response.data?.error || errorMessage;
      } else if (error.request) {
        console.error('No response received:', error.request);
        errorMessage = 'Cannot connect to server. Please check if the backend is running.';
      } else {
        console.error('Request setup error:', error.message);
        errorMessage = error.message || errorMessage;
      }
      
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
      router.push('/login');
      toast.success('Logged out successfully');
    }
  };

  const getMe = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.log('No access token found');
        setLoading(false);
        return;
      }

      console.log('Fetching user data...');
      const response = await authService.getMe();
      console.log('User data response:', response);
      
      if (response.success && response.data) {
        setUser(response.data);
      } else {
        console.error('Failed to get user data:', response.message);
        // If token is invalid, clear it
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setUser(null);
      }
    } catch (error: any) {
      console.error('Failed to fetch user:', error);
      // If there's an error (like 401), clear tokens
      if (error.response?.status === 401) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      getMe();
    } else {
      setLoading(false);
    }
  }, []);

  return {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };
};