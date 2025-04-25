from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
import sys

import pandas as pd
import io
import json
import random
from datetime import datetime, timedelta

import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from backend.transactions_processor import TransactionProcessor
from backend.card_update_analyzer import CardUpdateAnalyzer
from backend.notifs_engine import NotificationEngine
from models import db, Transaction, Notification


app = Flask(__name__)


from flask_cors import CORS
CORS(app, origins=[
    r"https://pay-tracker-.*-jt914s-projects\.vercel\.app",  # Regex for Vercel previews
    "https://pay-tracker.vercel.app",  # Production URL
    "http://localhost:5173",
], supports_credentials=True)

#initialize backend components
#stateless, reloads from db on each request
transaction_processor = TransactionProcessor()
card_update_analyzer = CardUpdateAnalyzer(transaction_processor)
notification_engine = NotificationEngine()

# Read DATABASE_URL from environment variable provided by Render
database_url = os.environ.get('DATABASE_URL')

# Ensure the database_url is actually set before proceeding
if not database_url:
    raise ValueError("No DATABASE_URL set for Flask application")

# Replace 'postgres://' with 'postgresql://' if necessary
if database_url.startswith("postgres://"):
    database_url = database_url.replace("postgres://", "postgresql://", 1)

# Set the configuration *after* potential modifications
app.config['SQLALCHEMY_DATABASE_URI'] = database_url
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize db after setting the URI
db.init_app(app)

with app.app_context():
    db.create_all()

def generate_sample_data():
    # Define pools of realistic data
    merchants = {
        'Subscriptions': ['Netflix', 'Spotify', 'Hulu', 'Amazon Prime', 'Disney+', 'Apple Music'],
        'Shopping': ['Amazon', 'Target', 'Walmart', 'Best Buy', 'Costco', 'Whole Foods'],
        'Dining': ['Starbucks', 'Chipotle', 'Subway', 'Local Restaurant', 'McDonalds', 'Pizza Hut'],
        'Utilities': ['Electric Company', 'Water Utility', 'Gas Company', 'Internet Provider'],
        'Transportation': ['Gas Station', 'Uber', 'Lyft', 'Public Transit']
    }
    
    # Amount ranges for different categories
    amount_ranges = {
        'Subscriptions': (9.99, 19.99),
        'Shopping': (25.00, 299.99),
        'Dining': (5.99, 75.00),
        'Utilities': (50.00, 200.00),
        'Transportation': (15.00, 60.00)
    }
    
    # Generate 5-8 random transactions
    num_transactions = random.randint(5, 8)
    transactions = []
    
    # Generate random dates within last 30 days
    end_date = datetime.now()
    start_date = end_date - timedelta(days=30)
    
    for _ in range(num_transactions):
        # Pick random category and merchant
        category = random.choice(list(merchants.keys()))
        merchant = random.choice(merchants[category])
        
        # Generate random amount within category range
        min_amount, max_amount = amount_ranges[category]
        amount = round(random.uniform(min_amount, max_amount), 2)
        
        # Generate random date
        random_date = start_date + timedelta(
            days=random.randint(0, 30),
            hours=random.randint(0, 23),
            minutes=random.randint(0, 59)
        )
        
        transactions.append({
            "date": random_date.strftime("%Y-%m-%d"),
            "merchant": merchant,
            "amount": amount,
            "category": category
        })
    
    # Sort transactions by date
    transactions.sort(key=lambda x: x["date"])
    
    return transactions




@app.route('/api/import-transactions', methods=['POST'])
def import_transactions():
    if 'file' in request.files:
        if request.files['file'].filename.endswith('.csv'):
            df = pd.read_csv(request.files['file'])
        else:
            return jsonify({"error": "No file provided"}), 300

    else:
        try:
            data = request.get_json(force=True)
            df = pd.DataFrame(data)
        except Exception:
            return jsonify({"error": "Invalid JSON"}), 400

    #organize and process using transaction processor
    transaction_processor.transactions = df
    transaction_processor.standardize_columns()
    transaction_processor.categorize_transactions()
    

    # ----- Adds new transactions to DB here -----
    
    Transaction.query.delete()  # clear old stuff
    db.session.commit()
    
    #add new transactions
    for _, row in df.iterrows():
        t = Transaction(
            date=str(row['date']),
            merchant=row['merchant'],
            amount=float(row['amount']),
            category=row.get('category', None)
        )
        db.session.add(t)
    #wait to commit
    db.session.commit()
    
    # Return transactions in the format expected by the frontend
    df = pd.read_sql(Transaction.query.statement, db.engine)
    transactions_json = json.loads(df.to_json(orient="records"))
    return jsonify({"status": "success", "transactions": transactions_json})



@app.route('/api/card-update', methods=['POST'])
def card_update():

    statement = Transaction.query.statement
    # ----- Reloads transactions from DB here -----
    df = pd.read_sql(statement, db.engine)
    transaction_processor.transactions = df
    transaction_processor.standardize_columns()
    transaction_processor.categorize_transactions()
    
    # generate impact report    
    impact_report = card_update_analyzer.generate_impact_report()
    # Save notification
    notif = Notification(
        merchants=','.join(impact_report['affected_merchants'])
    )
    db.session.add(notif)
    db.session.commit()
    return jsonify(impact_report)

@app.route('/api/notifications', methods=['GET'])
def get_notifications():
    notifs = Notification.query.order_by(Notification.timestamp.desc()).all()
    notif_list = [
        {
            "id": str(n.id),
            "message": f"Update card for merchants: {', '.join(n.merchants.split(','))}",
            "date": n.timestamp.isoformat()
        } for n in notifs
    ]
    return jsonify({"notifications": notif_list})

@app.route('/api/generate-sample-data', methods=['GET'])
def api_generate_sample_data():
    # Generate new random transactions
    transactions = generate_sample_data()
    
    # Add new transactions to database without clearing existing ones
    for transaction in transactions:
        t = Transaction(
            date=transaction['date'],
            merchant=transaction['merchant'],
            amount=float(transaction['amount']),
            category=transaction['category']
        )
        db.session.add(t)
    
    db.session.commit()
    
    # Get all transactions including the new ones
    all_transactions = Transaction.query.order_by(Transaction.date).all()
    transactions_data = [{
        "date": t.date,
        "merchant": t.merchant,
        "amount": t.amount,
        "category": t.category
    } for t in all_transactions]
    
    # Return all transactions including the new ones
    return jsonify({"status": "success", "transactions": transactions_data})

@app.route('/api/transactions', methods=['GET'])
def get_transactions():
    df = pd.read_sql(Transaction.query.statement, db.engine)
    return df.to_json(orient="records")

@app.route('/api/categories', methods=['GET'])
def get_categories():
    df = pd.read_sql(Transaction.query.statement, db.engine)
    if 'category' in df.columns:
        summary = df.groupby('category')['amount'].sum().to_dict()
        return jsonify(summary)
    return jsonify({})

@app.route('/api/clear-data', methods=['POST'])
def clear_data():
    try:
        # Clear all transactions
        Transaction.query.delete()
        db.session.commit()
        
        # Return empty transactions list to ensure frontend state is cleared
        return jsonify({"status": "success", "transactions": []})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

def generate_random_notification():
    notification_types = [
        "Card update required for {merchant}",
        "Unusual spending detected at {merchant}",
        "Subscription price increase at {merchant}",
        "Payment failed for {merchant}",
        "New recurring payment detected at {merchant}"
    ]
    
    merchants = [
        "Netflix", "Spotify", "Amazon", "Hulu", "Disney+",
        "Apple Music", "Electric Company", "Water Utility",
        "Gas Company", "Internet Provider"
    ]
    
    # Always generate 3 notifications
    notifications = []
    current_time = datetime.now()
    
    # Generate notifications with decreasing timestamps (most recent first)
    for i in range(3):
        # Each notification is 1-3 hours apart
        hours_ago = random.randint(1, 3) * (i + 1)
        minutes_ago = random.randint(0, 59)
        
        timestamp = current_time - timedelta(
            hours=hours_ago,
            minutes=minutes_ago
        )
        
        merchant = random.choice(merchants)
        message = random.choice(notification_types).format(merchant=merchant)
        
        notifications.append({
            "message": message,
            "merchants": merchant,
            "timestamp": timestamp
        })
    
    # Sort by timestamp (most recent first)
    notifications.sort(key=lambda x: x["timestamp"], reverse=True)
    
    return notifications

@app.route('/api/generate-notifications', methods=['POST'])
def generate_notifications():
    try:
        # Clear existing notifications
        Notification.query.delete()
        db.session.commit()
        
        # Generate new notifications
        notifications = generate_random_notification()
        
        # Save to database
        for notif in notifications:
            n = Notification(
                message=notif["message"],
                merchants=notif["merchants"],
                timestamp=notif["timestamp"]
            )
            db.session.add(n)
        
        db.session.commit()
        
        # Return the new notifications
        return jsonify({"status": "success", "notifications": notifications})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 10000))
    app.run(host='0.0.0.0', port=port)
