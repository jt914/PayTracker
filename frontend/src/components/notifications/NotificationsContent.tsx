import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Notification } from '../../types';

interface NotificationsContentProps {
  notifications: Notification[];
}

const NotificationsContent: React.FC<NotificationsContentProps> = ({ notifications }) => {
  return (
    <div className="bg-white rounded p-4 shadow">
      <h2 className="font-semibold mb-2">Notification Center</h2>
      <ul>
        {notifications.map((n) => (
          <li key={n.id} className="mb-2">
            <Card>
              <CardHeader>
                <CardTitle>{n.message}</CardTitle>
              </CardHeader>
              <CardContent>
                <span className="text-xs text-gray-400">{n.date}</span>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationsContent; 