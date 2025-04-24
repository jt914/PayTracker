from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Transaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.String(32), nullable=False)
    merchant = db.Column(db.String(128), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    category = db.Column(db.String(64), nullable=True)

class Notification(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    merchants = db.Column(db.String(256), nullable=False)  # Comma-separated
    timestamp = db.Column(db.DateTime, default=datetime.now)
