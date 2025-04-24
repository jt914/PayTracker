import React, { useState } from "react";
import { Button } from "./ui/button";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { Menu } from "lucide-react";
import { cn } from "../lib/utils";

interface SidebarProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={cn(
      "relative h-screen border-r bg-background transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-2"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <Menu className="h-4 w-4" />
      </Button>

      <div className="flex flex-col h-full pt-16">
        <Tabs
          value={activeTab}
          onValueChange={onTabChange}
          orientation="vertical"
          className={cn(
            "w-full",
            isCollapsed ? "px-2" : "px-4"
          )}
        >
          <TabsList className="flex flex-col h-full w-full">
            <TabsTrigger
              value="dashboard"
              className={cn(
                "w-full justify-start gap-2",
                isCollapsed && "justify-center"
              )}
            >
              <span className={cn(isCollapsed ? "hidden" : "block")}>Dashboard</span>
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className={cn(
                "w-full justify-start gap-2",
                isCollapsed && "justify-center"
              )}
            >
              <span className={cn(isCollapsed ? "hidden" : "block")}>Analytics</span>
            </TabsTrigger>
            <TabsTrigger
              value="transactions"
              className={cn(
                "w-full justify-start gap-2",
                isCollapsed && "justify-center"
              )}
            >
              <span className={cn(isCollapsed ? "hidden" : "block")}>Transactions</span>
            </TabsTrigger>
            <TabsTrigger
              value="tracking"
              className={cn(
                "w-full justify-start gap-2",
                isCollapsed && "justify-center"
              )}
            >
              <span className={cn(isCollapsed ? "hidden" : "block")}>Tracking</span>
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className={cn(
                "w-full justify-start gap-2",
                isCollapsed && "justify-center"
              )}
            >
              <span className={cn(isCollapsed ? "hidden" : "block")}>Notifications</span>
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className={cn(
                "w-full justify-start gap-2",
                isCollapsed && "justify-center"
              )}
            >
              <span className={cn(isCollapsed ? "hidden" : "block")}>Settings</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};

export default Sidebar; 