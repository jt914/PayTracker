export interface Transaction {
  id: string;
  date: string;
  merchant: string;
  amount: number;
  category: string;
  recurring: boolean;
}

export interface Notification {
  id: string;
  message: string;
  date: string;
}

export interface RecurringSummary {
  recurring: number;
  nonRecurring: number;
} 