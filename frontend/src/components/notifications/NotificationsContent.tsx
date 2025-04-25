import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Notification } from '../../types';
import { useTheme } from '../../context/ThemeContext';

interface NotificationsContentProps {
  notifications: Notification[];
}

const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString('en-US', { 
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  const formattedTime = date.toLocaleTimeString('en-US', { 
    hour: '2-digit',
    minute: '2-digit'
  });
  return { formattedDate, formattedTime };
};

const NotificationsContent: React.FC<NotificationsContentProps> = ({ notifications }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Sort notifications by date (most recent first) and take only the last 3
  const recentNotifications = [...notifications]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  return (
    <div className={`rounded p-4 shadow ${isDark ? 'bg-card text-card-foreground' : 'bg-white'}`}>
      <h2 className="font-semibold mb-2">Notification Center</h2>
      <ul>
        {recentNotifications.map((n) => (
          <li key={n.id} className="mb-2">
            <Card>
              <CardHeader>
                <CardTitle>{n.message}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-xs ${isDark ? 'text-muted-foreground' : 'text-gray-400'}`}>
                  <span>{formatDateTime(n.date).formattedDate}</span>
                  <span className="mx-2">•</span>
                  <span>{formatDateTime(n.date).formattedTime}</span>
                </div>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationsContent; 