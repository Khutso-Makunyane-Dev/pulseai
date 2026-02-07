# app/ai/feedback.py

def generate_feedback(user_name: str, sentiment: dict, summary: str, topics: list[str], risk: bool):
    """
    Generate a friendly AI-style feedback message.
    
    Args:
        user_name (str): Name of the user
        sentiment (dict): {"sentiment": "POSITIVE"/"NEGATIVE", "confidence": float}
        summary (str): Short summary of the text
        topics (list[str]): List of key topics
        risk (bool): Whether risky words/negative sentiment were detected
    
    Returns:
        str: Friendly feedback message
    """
    
    sentiment_text = f"{sentiment['sentiment']} ({sentiment['confidence']*100:.1f}% confidence)"
    topics_text = ", ".join(topics) if topics else "no specific topics"
    risk_text = "⚠️ I detected some risky content, be cautious!" if risk else "✅ Everything looks safe."
    
    message = (
        f"Hello {user_name}! Here's your analysis results:\n\n"
        f"Sentiment: {sentiment_text}\n"
        f"Summary: {summary}\n"
        f"Key topics: {topics_text}\n"
        f"{risk_text}\n\n"
        f"Based on this, I think you can use this feedback to improve or reflect accordingly!"
    )
    
    return message
