from typing import List

class ConversationState:
    def __init__(self):
        self.history: List[str] = []

    def add_message(self, message: str):
        self.history.append(message)
        if len(self.history) > 10:
            self.history.pop(0) 

    def get_context(self) -> List[str]:
        return self.history.copy()
