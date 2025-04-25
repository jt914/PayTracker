import { useState, useEffect } from 'react';
import { Notification } from '../types';
import { fetchNotifications, generateNotifications } from '../utils/api';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  const loadNotifications = async () => {
    try {
      const notificationsData = await fetchNotifications();
      setNotifications(notificationsData);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setNotifications([]);
    }
  };

  const handleGenerateNotifications = async () => {
    setLoading(true);
    try {
      await generateNotifications();
      await loadNotifications();
    } catch (error) {
      console.error("Error generating notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  return {
    notifications,
    loading,
    handleGenerateNotifications,
    loadNotifications
  };
}; 