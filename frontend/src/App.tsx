import React, { useEffect, useState } from "react";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Tabs, TabsContent } from "./components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./components/ui/table";
import { BarChart, PieChart } from "recharts";
import axios from "axios";
import Sidebar from "./components/Sidebar";

interface Transaction {
  id: string;
  date: string;
  merchant: string;
  amount: number;
  category: string;
  recurring: boolean;
}

interface Notification {
  id: string;
  message: string;
  date: string;
}

interface RecurringSummary {
  recurring: number;
  nonRecurring: number;
}

const App: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [recurringSummary, setRecurringSummary] = useState<RecurringSummary>({ recurring: 0, nonRecurring: 0 });
  const [loading, setLoading] = useState(false);
  const [simResult, setSimResult] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    fetchTransactions();
    fetchNotifications();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/transactions`);
      const transactionsData = res.data || [];
      setTransactions(transactionsData);
      const recurring = transactionsData.filter((t: Transaction) => t.recurring).length;
      const nonRecurring = transactionsData.length - recurring;
      setRecurringSummary({ recurring, nonRecurring });
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setTransactions([]);
      setRecurringSummary({ recurring: 0, nonRecurring: 0 });
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/notifications`);
      setNotifications(res.data.notifications || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setNotifications([]);
    }
  };

  const handleGenerateSample = async () => {
    setLoading(true);
    await axios.get(`${import.meta.env.VITE_API_BASE_URL}/generate-sample-data`);
    await fetchTransactions();
    setLoading(false);
  };

  const handleSimulateCardUpdate = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/card-update`);
      setSimResult(res.data.affected_merchants || []);
      await fetchNotifications();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="flex-1 overflow-auto">
        <header className="p-4 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">PayTrackr</h1>
              <p className="text-muted-foreground">Transaction Notification & Categorization Tool</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleGenerateSample} disabled={loading}>Generate Sample Data</Button>
              <Button onClick={handleSimulateCardUpdate} disabled={loading}>Simulate Card Update</Button>
            </div>
          </div>
          {simResult.length > 0 && (
            <div className="mt-3 p-3 bg-yellow-100 rounded">
              <strong>Merchants needing card update:</strong>
              <ul className="list-disc ml-6">
                {simResult.map((m) => (
                  <li key={m}>{m}</li>
                ))}
              </ul>
            </div>
          )}
        </header>

        <main className="p-4">
          <Tabs value={activeTab} className="w-full">
            <TabsContent value="dashboard">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Total Transactions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <span className="text-2xl font-semibold">{transactions.length}</span>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Recurring Payments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <span className="text-2xl font-semibold">{recurringSummary.recurring}</span>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Non-Recurring Payments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <span className="text-2xl font-semibold">{recurringSummary.nonRecurring}</span>
                  </CardContent>
                </Card>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded p-4 shadow">
                  <h2 className="font-semibold mb-2">Spending Breakdown</h2>
                  <PieChart width={320} height={200}>
                    {/* Pie chart logic here */}
                  </PieChart>
                </div>
                <div className="bg-white rounded p-4 shadow">
                  <h2 className="font-semibold mb-2">Recurring vs Non-Recurring</h2>
                  <BarChart width={320} height={200} data={[
                    { name: "Recurring", value: recurringSummary.recurring },
                    { name: "Non-Recurring", value: recurringSummary.nonRecurring },
                  ]}>
                    {/* Bar chart logic here */}
                  </BarChart>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="analytics">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Spending Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <BarChart width={400} height={300} data={transactions}>
                      {/* Add spending trends visualization */}
                    </BarChart>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Category Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <PieChart width={400} height={300} data={transactions}>
                      {/* Add category breakdown visualization */}
                    </PieChart>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="transactions">
              <div className="bg-white rounded p-4 shadow">
                <h2 className="font-semibold mb-2">Transaction History</h2>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Merchant</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Recurring</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((t) => (
                      <TableRow key={t.id}>
                        <TableCell>{t.date}</TableCell>
                        <TableCell>{t.merchant}</TableCell>
                        <TableCell>${t.amount.toFixed(2)}</TableCell>
                        <TableCell>{t.category}</TableCell>
                        <TableCell>{t.recurring ? "Yes" : "No"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="tracking">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recurring Payments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Merchant</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Next Payment</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {transactions
                          .filter(t => t.recurring)
                          .map((t) => (
                            <TableRow key={t.id}>
                              <TableCell>{t.merchant}</TableCell>
                              <TableCell>${t.amount.toFixed(2)}</TableCell>
                              <TableCell>Next month</TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Subscription Management</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Button variant="outline" className="w-full">Add New Subscription</Button>
                      <Button variant="outline" className="w-full">Manage Categories</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="notifications">
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
            </TabsContent>

            <TabsContent value="settings">
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
                        <Button variant="outline">Enable</Button>
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
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default App;
