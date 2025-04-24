import { useState, useEffect } from 'react';
import { Notification } from '../types';
import { fetchNotifications } from '../utils/api';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const loadNotifications = async () => {
    try {
      const notificationsData = await fetchNotifications();
      setNotifications(notificationsData);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setNotifications([]);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  return {
    notifications,
    loadNotifications
  };
}; 