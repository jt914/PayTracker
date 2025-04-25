import React, { useState } from "react";
import { Tabs, TabsContent } from "./components/ui/tabs";
import Sidebar from "./components/Sidebar";
import Header from "./components/layout/Header";
import DashboardContent from "./components/dashboard/DashboardContent";
import AnalyticsContent from "./components/analytics/AnalyticsContent";
import TransactionsContent from "./components/transactions/TransactionsContent";
import TrackingContent from "./components/tracking/TrackingContent";
import NotificationsContent from "./components/notifications/NotificationsContent";
import SettingsContent from "./components/settings/SettingsContent";
import { useTransactions } from "./hooks/useTransactions";
import { useNotifications } from "./hooks/useNotifications";

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const {
    transactions,
    recurringSummary,
    loading,
    simResult,
    handleGenerateSample,
    handleSimulateCardUpdate,
    handleClearData,
  } = useTransactions();
  const { notifications } = useNotifications();

  return (
    <div className="flex h-screen bg-background">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="flex-1 overflow-auto">
        <Header
          loading={loading}
          simResult={simResult}
          onGenerateSample={handleGenerateSample}
          onSimulateCardUpdate={handleSimulateCardUpdate}
          onClearData={handleClearData}
        />

        <main className="p-4">
          <Tabs value={activeTab} className="w-full">
            <TabsContent value="dashboard">
              <DashboardContent
                recurringSummary={recurringSummary}
                transactions={transactions}
              />
            </TabsContent>

            <TabsContent value="analytics">
              <AnalyticsContent transactions={transactions} />
            </TabsContent>

            <TabsContent value="transactions">
              <TransactionsContent transactions={transactions} />
            </TabsContent>

            <TabsContent value="tracking">
              <TrackingContent transactions={transactions} />
            </TabsContent>

            <TabsContent value="notifications">
              <NotificationsContent notifications={notifications} />
            </TabsContent>

            <TabsContent value="settings">
              <SettingsContent />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default App;
