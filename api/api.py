from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
import sys

import pandas as pd
import io
import json


from backend.transactions_processor import TransactionProcessor
from backend.card_update_analyzer import CardUpdateAnalyzer
from backend.notifs_engine import NotificationEngine
from models import db, Transaction, Notification


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///paytrackr.db'
#should improve performance
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

with app.app_context():
    db.create_all()

#initialize backend components
#stateless, reloads from db on each request
transaction_processor = TransactionProcessor()
card_update_analyzer = CardUpdateAnalyzer(transaction_processor)
notification_engine = NotificationEngine()

def generate_sample_data():
    data = [
        {"date": "2025-03-01", "merchant": "Netflix", "amount": 15.99},
        {"date": "2025-03-15", "merchant": "Spotify", "amount": 9.99},
        {"date": "2025-04-01", "merchant": "Netflix", "amount": 15.99},
        {"date": "2025-04-15", "merchant": "Spotify", "amount": 9.99},
        {"date": "2025-04-20", "merchant": "Amazon", "amount": 100.00},
    ]
    df = pd.DataFrame(data)
    return df.to_json(orient="records")




@app.route('/api/import-transactions', methods=['POST'])
def import_transactions():
    if 'file' in request.files:
        if request.files['file'].filename.endswith('.csv'):
            df = pd.read_csv(request.files['file'])
        else:
            return jsonify({"error": "Unsupported file type"}), 400
    else:
        return jsonify({"error": "No file provided"}), 300

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
    return jsonify({"status": "success"})



@app.route('/api/card-update', methods=['POST'])
def card_update():

    statement = Transaction.query.statement
    # ----- Reloads transactions from DB here -----
    df = pd.read_sql(statement, db.session.bind)
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
        {"merchants": n.merchants.split(','), "timestamp": n.timestamp.isoformat()} for n in notifs
    ]
    return jsonify(notif_list)

@app.route('/api/generate-sample-data', methods=['GET'])
def api_generate_sample_data():
    data_json = generate_sample_data()
    df = pd.read_json(io.StringIO(data_json))
    df.columns = [col.lower() for col in df.columns]
    transaction_processor.transactions = df
    transaction_processor.categorize_transactions()
    Transaction.query.delete()
    db.session.commit()
    for _, row in df.iterrows():
        t = Transaction(
            date=str(row['date']),
            merchant=row['merchant'],
            amount=float(row['amount']),
            category=row.get('category', None)
        )
        db.session.add(t)
    db.session.commit()
    return jsonify({"status": "sample data loaded"})

@app.route('/api/transactions', methods=['GET'])
def get_transactions():
    df = pd.read_sql(Transaction.query.statement, db.session.bind)
    return df.to_json(orient="records")

@app.route('/api/categories', methods=['GET'])
def get_categories():
    df = pd.read_sql(Transaction.query.statement, db.session.bind)
    if 'category' in df.columns:
        summary = df.groupby('category')['amount'].sum().to_dict()
        return jsonify(summary)
    return jsonify({})

if __name__ == '__main__':
    app.run(debug=True)
