import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { MainLayout } from "./components/layout/MainLayout";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./components/ui/table";
import { BarChart, PieChart } from "recharts";
import { Toaster } from "./components/ui/toaster";
import axios from "axios";
import { CommandPalette } from "./components/CommandPalette";

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

function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [recurringSummary, setRecurringSummary] = useState<RecurringSummary>({ recurring: 0, nonRecurring: 0 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTransactions();
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button onClick={fetchTransactions} disabled={loading}>
          Refresh Data
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
        <Card>
          <CardHeader>
            <CardTitle>Spending Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <PieChart width={320} height={200}>
              {/* Pie chart logic here */}
            </PieChart>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recurring vs Non-Recurring</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart width={320} height={200} data={[
              { name: "Recurring", value: recurringSummary.recurring },
              { name: "Non-Recurring", value: recurringSummary.nonRecurring },
            ]}>
              {/* Bar chart logic here */}
            </BarChart>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/transactions`);
      setTransactions(res.data || []);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Transactions</h1>
        <Button onClick={fetchTransactions} disabled={loading}>
          Refresh
        </Button>
      </div>
      <Card>
        <CardContent className="p-0">
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
        </CardContent>
      </Card>
    </div>
  );
}

function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/notifications`);
      setNotifications(res.data.notifications || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Notifications</h1>
        <Button onClick={fetchNotifications} disabled={loading}>
          Refresh
        </Button>
      </div>
      <div className="space-y-4">
        {notifications.map((n) => (
          <Card key={n.id}>
            <CardHeader>
              <CardTitle>{n.message}</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-sm text-muted-foreground">{n.date}</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function Analytics() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Analytics</h1>
      <p className="text-muted-foreground">Coming soon...</p>
    </div>
  );
}

const App: React.FC = () => {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </MainLayout>
      <CommandPalette />
      <Toaster />
    </Router>
  );
};

export default App;
