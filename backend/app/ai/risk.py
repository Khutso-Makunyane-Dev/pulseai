# app/ai/risk.py

# Enhanced risky words list matching respond.py
RISKY_WORDS = [
    "kill", "hurt", "danger", "scam", "lawsuit", "angry", "hate",
    "refund", "broken", "bad", "delay", "threat", "violence",
    "attack", "weapon", "destroy", "damage", "emergency", "help me",
    "suicide", "die", "death", "hurt myself", "end it", "abuse",
]

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
    for word in RISKY_WORDS:
        if word in text_lower:
            return True
    
    # Consider negative sentiment as risky (unless it's harmless negativity)
    if sentiment == "NEGATIVE":
        # Check if it's truly risky or just mild negativity
        mild_negative = ["bad", "not good", "disappointed", "sad", "unhappy"]
        if not any(mild in text_lower for mild in mild_negative):
            return True
    
    return False