# app/ai/title.py
import re
from app.ai.summary import summarize_text

def generate_chat_title(text: str, use_ai: bool = False) -> str:
    """
    Generate a chat title from the first message.
    
    Args:
        text (str): The user's message
        use_ai (bool): Whether to use AI for better title generation
    
    Returns:
        str: Generated title
    """
    if use_ai:
        # Use AI to generate a concise title
        summary = summarize_text(text, max_sentences=1)
        # Clean up the summary to make it title-like
        summary = summary.strip('"').strip("'")
        if len(summary) > 50:
            summary = summary[:47] + "..."
        return summary
    
    # Fallback to simple method
    text = text.strip()
    text = re.sub(r'[^\w\s]', '', text)
    words = text.split()
    
    if not words:
        return "New Chat"
    
    title = ' '.join(words[:5]).capitalize()
    
    if len(words) > 5:
        title += "..."
    if len(title) > 50:
        title = title[:47] + "..."
    
    return title