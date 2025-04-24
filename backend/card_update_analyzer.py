from typing import List, Dict, Any
from backend.transactions_processor import TransactionProcessor
import pandas as pd

class CardUpdateAnalyzer:
    def __init__(self, processor: TransactionProcessor):
        self.processor = processor

    def analyze_card_update(self) -> List[str]:
        #return all recurring merchants, since all recurring payments should be affected
        return self.processor.get_recurring()

    def estimate_next_payments(self) -> Dict[str, str]:
        
        #Estimate next payment dates based on transaction history. Returns a dict of merchants.

        df = self.processor.transactions

        if df.empty:
            return {}

        recurring_merchants = set(df[df['category'] == 'Recurring']['merchant'])
        next_payments = {}

        for merchant in recurring_merchants:
            merchant_transactions = df[df['merchant'] == merchant].sort_values('date')
            last_transaction_date = merchant_transactions['date'].max()
            #default to monthly
            if len(merchant_transactions) == 1:
                next_payments[merchant] = (last_transaction_date + pd.Timedelta(days = 30)).date().isoformat()

            else:
                # estimate interval as median difference
                merchant_transactions['date'] = pd.to_datetime(merchant_transactions['date'])
                intervals = merchant_transactions['date'].diff().dt.days.dropna()
                median_interval = int(intervals.median())

                next_payments[merchant] = (last_transaction_date + pd.Timedelta(days=median_interval)).date().isoformat()
        
        return next_payments

    def generate_impact_report(self) -> Dict[str, Any]:
        #Generate an impact analysis report including affected merchants and next payment dates.

        affected = self.analyze_card_update()
        next_payments = self.estimate_next_payments()
        report = {
            "affected_merchants": affected,
            "next_payments": {m: next_payments.get(m, None) for m in affected}
        }
        return report
