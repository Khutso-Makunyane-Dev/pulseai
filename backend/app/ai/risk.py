# app/ai/risk.py

RISKY_WORDS = ["refund", "scam", "lawsuit", "angry", "broken", "bad", "delay", "hate"]

def detect_risk(text: str, sentiment: str = None):
    """
    Determine if feedback is risky.
    
    Args:
        text (str): Feedback text
        sentiment (str, optional): Sentiment result (POSITIVE/NEGATIVE)
        
    Returns:
        bool: True if risky, False otherwise
    """
    text_lower = text.lower()
    
    # Risk based on keywords
    if any(word in text_lower for word in RISKY_WORDS):
        return True
    
    # Optional: consider negative sentiment as risky
    if sentiment == "NEGATIVE":
        return True
    
    return False
