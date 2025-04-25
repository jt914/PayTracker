import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Transaction } from '../../types';
import { useTheme } from '../../context/ThemeContext';

interface TransactionsContentProps {
  transactions: Transaction[];
}

const TransactionsContent: React.FC<TransactionsContentProps> = ({ transactions }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`rounded p-4 shadow ${isDark ? 'bg-card text-card-foreground' : 'bg-white'}`}>
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
  );
};

export default TransactionsContent; 