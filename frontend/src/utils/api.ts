import axios from 'axios';
import { Transaction, Notification } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchTransactions = async () => {
  const res = await axios.get(`${API_BASE_URL}/transactions`);
  return res.data || [];
};

export const fetchNotifications = async () => {
  const res = await axios.get(`${API_BASE_URL}/notifications`);
  return res.data.notifications || [];
};

export const generateSampleData = async () => {
  await axios.get(`${API_BASE_URL}/generate-sample-data`);
};

export const simulateCardUpdate = async () => {
  const res = await axios.post(`${API_BASE_URL}/card-update`);
  return res.data.affected_merchants || [];
};

export const clearData = async () => {
  const res = await axios.post(`${API_BASE_URL}/clear-data`);
  return res.data.transactions || [];
}; 