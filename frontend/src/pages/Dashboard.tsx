import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';

interface Transaction {
  id: string;
  date: string;
  merchant: string;
  amount: number;
  category: string;
  recurring: boolean;
}

interface RecurringSummary {
  recurring: number;
  nonRecurring: number;
}

export default function Dashboard() {
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
    <div className="space-y-6 p-8">
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
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={transactions}
                    dataKey="amount"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    label
                  />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recurring vs Non-Recurring</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { name: "Recurring", value: recurringSummary.recurring },
                    { name: "Non-Recurring", value: recurringSummary.nonRecurring },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 