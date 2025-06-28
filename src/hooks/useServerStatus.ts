import { useState, useEffect } from 'react';
import { apiService } from '../services/api';

export const useServerStatus = () => {
  const [serverStatus, setServerStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  const checkServerStatus = async () => {
    try {
      await apiService.checkHealth();
      setServerStatus('online');
    } catch (error) {
      setServerStatus('offline');
      console.error('Server is offline:', error);
    }
  };

  useEffect(() => {
    checkServerStatus();
  }, []);

  return {
    serverStatus,
    checkServerStatus
  };
};