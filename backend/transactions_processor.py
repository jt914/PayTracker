import pandas as pd
from typing import List, Dict, Any, Optional

class TransactionProcessor:

    recurring_merchants = ['netflix', 'spotify', 'hulu', 'amazon prime']

    def add_recurring_merchant(self, merchant: str):
        self.recurring_merchants.append(merchant.lower())

    
    def __init__ (self):
        self.transactions = pd.DataFrame()


    def import_transactions(self, data: Any) -> None:
        # only json
        self.transactions = pd.read_json(data)
        self.standardize_columns()
    
    def standardize_columns(self) -> None:
        # only lowercase the columns. Might add more in the future to remove whitespace
        self.transactions.columns = [col.lower() for col in self.transactions.columns]


    def categorize_transactions(self) -> None:
        #categorize some merchants as recurring. Can be expanded
        recurring_set = set(m.lower() for m in self.recurring_merchants)
        self.transactions['category'] = self.transactions['merchant'].apply(
            lambda x: 'Recurring' if any(m in str(x).lower() for m in recurring_set) else 'Other'
        )

    def get_recurring(self) -> List[str]:
        #get all the recurring merchants uniquely
        recurring_merchants = self.transactions[self.transactions['category'] == 'Recurring']['merchant'].unique().tolist()
        return recurring_merchants
