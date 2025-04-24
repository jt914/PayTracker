import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { BarChart, PieChart } from 'recharts';
import { Transaction } from '../../types';

interface AnalyticsContentProps {
  transactions: Transaction[];
}

const AnalyticsContent: React.FC<AnalyticsContentProps> = ({ transactions }) => {
  // Calculate spending trends data
  const spendingTrends = transactions.reduce((acc, t) => {
    const date = new Date(t.date).toLocaleDateString('en-US', { month: 'short' });
    if (!acc[date]) {
      acc[date] = 0;
    }
    acc[date] += t.amount;
    return acc;
  }, {} as Record<string, number>);

  const spendingTrendsData = Object.entries(spendingTrends).map(([name, value]) => ({
    name,
    value
  }));

  // Calculate category breakdown
  const categoryBreakdown = transactions.reduce((acc, t) => {
    if (!acc[t.category]) {
      acc[t.category] = 0;
    }
    acc[t.category] += t.amount;
    return acc;
  }, {} as Record<string, number>);

  const categoryData = Object.entries(categoryBreakdown).map(([name, value]) => ({
    name,
    value
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Spending Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <BarChart width={400} height={300} data={spendingTrendsData}>
            {/* Add Bar chart components here */}
          </BarChart>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Category Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <PieChart width={400} height={300} data={categoryData}>
            {/* Add Pie chart components here */}
          </PieChart>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsContent; 