# PayTracker

## Overview
PayTracker is a smart transaction management system designed to help users track and manage their recurring payments. It automatically identifies subscription services and notifies users when their credit card needs to be updated across multiple platforms.

## The Problem PayTracker Solves
When your credit card expires or is replaced, updating payment information across dozens of subscription services becomes a tedious, manual process. PayTracker simplifies this by:

- Automatically identifying recurring payments in your transaction history
- Predicting when each subscription will charge next
- Generating impact reports when your card changes, showing which merchants need updates
- Providing notifications to remind you which services require attention

## Key Features
- **Smart Transaction Categorization**: Automatically identifies and categorizes recurring payments
- **Card Update Impact Analysis**: Shows which merchants need your new card information when a card changes
- **Payment Prediction**: Uses transaction history to estimate when your next payment for each service will occur
- **Notification System**: Alerts you about services that need attention
- **Transaction Management**: Import, categorize, and visualize your spending patterns

## Technology Stack
- **Backend**: Python with Flask, pandas for data analysis, SQLAlchemy for ORM
- **Frontend**: React/TypeScript with Vite, shadcn/ui components, and Recharts for data visualization
- **Database**: SQL database with models for transactions and notifications

## Project Structure
- `api/`: Flask API endpoints and database models
- `backend/`: Core business logic components:
  - `transactions_processor.py`: Handles transaction import and categorization
  - `card_update_analyzer.py`: Analyzes recurring payments and predicts future charges
  - `notifs_engine.py`: Manages the notification system
- `frontend/`: React application with TypeScript, providing a modern dashboard UI

## API Endpoints

- `GET /api/transactions`: Retrieve all transactions
- `POST /api/import-transactions`: Import transactions (CSV or JSON)
- `POST /api/card-update`: Simulate card update and get affected merchants
- `GET /api/notifications`: Get notification history
- `GET /api/categories`: Get transaction categories summary
- `GET /api/generate-sample-data`: Generate sample transaction data

## Setup Instructions

### Backend Setup
1. Create and activate a Python virtual environment:
```bash
python -m venv venv
source venv/bin/activate # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the backend server:
```bash
python api/api.py
```

### Frontend Setup
1. Install dependencies:
```bash
cd frontend
npm install
```

2. Run the frontend server:
```bash
npm run dev
```

## Data Models

### Transaction
- `id`: Primary Key
- `date`: Transaction date
- `merchant`: Merchant name
- `amount`: Transaction amount
- `category`: Transaction category (e.g., "Recurring", "Other")

### Notification
- `id`: Primary Key
- `merchants`: Comma-separated list of merchants affected by card update
- `timestamp`: When the notification was created

## License
MIT License

Copyright (c) 2024

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.