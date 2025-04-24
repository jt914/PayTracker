# Project Name
PayTracker

## Overview
PayTracker is a transaction management system built with Python (Flask) backend and Node.js/Next.js frontend. It helps users track their recurring payments and notifies them when card updates are needed.

## Project Structure
- Backend: Flask-based Python application with SQLite database
- Frontend: React/TypeScript application using Next.js

## Setup

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

## API Endpoints

### Backend API
- `GET /api/transactions` - Retrieve all transactions
- `POST /api/import-transactions` - Import transactions (CSV or JSON)
- `POST /api/card-update` - Simulate card update and get affected merchants
- `GET /api/notifications` - Get notification history
- `GET /api/categories` - Get transaction categories summary
- `GET /api/generate-sample-data` - Generate sample transaction data

## Database
The application uses SQLite with SQLAlchemy ORM. The database schema includes:

### Transaction Table
- id (Primary Key)
- date (String, required)
- merchant (String, required)
- amount (Float, required)
- category (String, optional)

### Notification Table
- id (Primary Key)
- merchants (String, required) - Comma-separated list of merchants
- timestamp (DateTime, auto-generated)

## Features
- Transaction import and categorization
- Recurring payment detection
- Card update impact analysis
- Notification system for card updates
- Transaction categorization and reporting

## Contributing
Contributions are welcome. Please follow the standard GitHub pull request process.

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