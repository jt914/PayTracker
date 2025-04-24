import { useState, useEffect } from 'react';
import { Transaction, RecurringSummary } from '../types';
import { fetchTransactions, generateSampleData, simulateCardUpdate } from '../utils/api';

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [recurringSummary, setRecurringSummary] = useState<RecurringSummary>({ recurring: 0, nonRecurring: 0 });
  const [loading, setLoading] = useState(false);
  const [simResult, setSimResult] = useState<string[]>([]);

  const loadTransactions = async () => {
    setLoading(true);
    try {
      const transactionsData = await fetchTransactions();
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

  const handleGenerateSample = async () => {
    setLoading(true);
    await generateSampleData();
    await loadTransactions();
    setLoading(false);
  };

  const handleSimulateCardUpdate = async () => {
    setLoading(true);
    try {
      const result = await simulateCardUpdate();
      setSimResult(result);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  return {
    transactions,
    recurringSummary,
    loading,
    simResult,
    handleGenerateSample,
    handleSimulateCardUpdate,
    loadTransactions
  };
}; 