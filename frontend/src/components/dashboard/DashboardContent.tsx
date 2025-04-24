import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { BarChart, PieChart } from 'recharts';
import { RecurringSummary } from '../../types';

interface DashboardContentProps {
  recurringSummary: RecurringSummary;
  transactions: any[]; // You might want to create a more specific type for transactions
}

const DashboardContent: React.FC<DashboardContentProps> = ({
  recurringSummary,
  transactions,
}) => {
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
    </>
  );
};

export default DashboardContent; 