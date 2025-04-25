import React from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

const SettingsContent: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Email Notifications</span>
              <Button variant="outline">Enable</Button>
            </div>
            <div className="flex items-center justify-between">
              <span>Dark Mode</span>
              <Button variant="outline" size="icon" onClick={toggleTheme}>
                {theme === 'dark' ? (
                  <Moon className="h-4 w-4" />
                ) : (
                  <Sun className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button variant="outline" className="w-full">Export Data</Button>
            <Button variant="outline" className="w-full">Import Data</Button>
            <Button variant="destructive" className="w-full">Clear All Data</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsContent; 