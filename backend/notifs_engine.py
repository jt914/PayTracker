from typing import List, Dict, Any

class NotificationEngine:
    
    def __init__(self):
        self.notifications = []

    def create_alert(self, merchants: List[str]) -> None:
        #create an alert for merchants needing updated card info
        alert = {"merchants": merchants}
        self.notifications.append(alert)

    def get_notification_history(self) -> List[Dict[str, Any]]:
        #get notification history
        return self.notifications
