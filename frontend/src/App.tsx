import React, { useEffect, useState } from "react";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./components/ui/table";
import { BarChart, PieChart } from "recharts";
import axios from "axios";

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

  useEffect(() => {
    fetchTransactions();
    fetchNotifications();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/import-transactions`);
      setTransactions(res.data.transactions);
      // Calculate recurring summary
      const recurring = res.data.transactions.filter((t: Transaction) => t.recurring).length;
      const nonRecurring = res.data.transactions.length - recurring;
      setRecurringSummary({ recurring, nonRecurring });
    } catch {
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/notifications`);
      setNotifications(res.data.notifications);
    } catch {
      setNotifications([]);
    }
  };

  const handleGenerateSample = async () => {
    setLoading(true);
    await axios.post(`${import.meta.env.VITE_API_BASE_URL}/generate-sample-data`);
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
    <div className="min-h-screen bg-gray-100 p-4 font-sans">
      <header className="mb-6">
        <h1 className="text-3xl font-bold mb-2">PayTrackr</h1>
        <p className="text-gray-600 mb-4">Transaction Notification & Categorization Tool</p>
        <div className="flex gap-2">
          <Button onClick={handleGenerateSample} disabled={loading}>Generate Sample Data</Button>
          <Button onClick={handleSimulateCardUpdate} disabled={loading}>Simulate Card Update</Button>
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
      <Tabs defaultValue="dashboard">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
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
              {/* PieChart placeholder, add logic if categories exist */}
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
      </Tabs>
    </div>
  );
};

export default App;
