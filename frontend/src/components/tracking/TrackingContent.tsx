import React from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Transaction } from '../../types';

interface TrackingContentProps {
  transactions: Transaction[];
}

const TrackingContent: React.FC<TrackingContentProps> = ({ transactions }) => {
  const recurringTransactions = transactions.filter(t => t.recurring);

  return (
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
              {recurringTransactions.map((t) => (
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
  );
};

export default TrackingContent; 