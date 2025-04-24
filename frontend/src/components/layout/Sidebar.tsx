import React from "react";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";

interface SidebarProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="w-64 h-full bg-background border-r">
      <div className="p-4">
        <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-1 gap-2">
            <TabsTrigger value="dashboard" className="justify-start">
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="analytics" className="justify-start">
              Analytics
            </TabsTrigger>
            <TabsTrigger value="transactions" className="justify-start">
              Transactions
            </TabsTrigger>
            <TabsTrigger value="tracking" className="justify-start">
              Tracking
            </TabsTrigger>
            <TabsTrigger value="notifications" className="justify-start">
              Notifications
            </TabsTrigger>
            <TabsTrigger value="settings" className="justify-start">
              Settings
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};

export default Sidebar; 