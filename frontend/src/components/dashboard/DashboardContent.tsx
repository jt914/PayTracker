import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { RecurringSummary } from '../../types';
import { useTheme } from '../../context/ThemeContext';

interface DashboardContentProps {
  recurringSummary: RecurringSummary;
  transactions: any[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const DashboardContent: React.FC<DashboardContentProps> = ({
  recurringSummary,
  transactions,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Calculate spending breakdown data
  const spendingBreakdown = transactions.reduce((acc, t) => {
    if (!acc[t.category]) {
      acc[t.category] = 0;
    }
    acc[t.category] += t.amount;
    return acc;
  }, {} as Record<string, number>);

  const spendingData = Object.entries(spendingBreakdown).map(([name, value]) => ({
    name,
    value
  }));

  const chartData = [
    { name: "Recurring", value: recurringSummary.recurring },
    { name: "Non-Recurring", value: recurringSummary.nonRecurring },
  ];

  const chartStyle = {
    backgroundColor: isDark ? '#1a1a1a' : '#fff',
    color: isDark ? '#fff' : '#000',
  };

  return (
    <>
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
        <Card>
          <CardHeader>
            <CardTitle>Spending Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={spendingData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => (
                      <text
                        x={0}
                        y={0}
                        dy={8}
                        textAnchor="middle"
                        fill={isDark ? '#fff' : '#000'}
                      >
                        {`${name} ${(percent * 100).toFixed(0)}%`}
                      </text>
                    )}
                  >
                    {spendingData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: isDark ? '#1a1a1a' : '#fff',
                      border: isDark ? '1px solid #333' : '1px solid #ccc',
                      color: isDark ? '#fff' : '#000',
                    }}
                  />
                  <Legend 
                    wrapperStyle={{
                      color: isDark ? '#fff' : '#000',
                    }}
                  />
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
                  data={chartData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis 
                    dataKey="name" 
                    stroke={isDark ? '#fff' : '#000'}
                    tick={{ fill: isDark ? '#fff' : '#000' }}
                  />
                  <YAxis 
                    stroke={isDark ? '#fff' : '#000'}
                    tick={{ fill: isDark ? '#fff' : '#000' }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: isDark ? '#1a1a1a' : '#fff',
                      border: isDark ? '1px solid #333' : '1px solid #ccc',
                      color: isDark ? '#fff' : '#000',
                    }}
                  />
                  <Legend 
                    wrapperStyle={{
                      color: isDark ? '#fff' : '#000',
                    }}
                  />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default DashboardContent; 