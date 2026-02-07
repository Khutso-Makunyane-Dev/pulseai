# app/ai/summary.py

def summarize_text(text: str, max_length: int = 50):
    """
    Return a short summary of the text.
    
    Args:
        text (str): Input feedback
        max_length (int): Max number of characters in summary
    
    Returns:
        str: Summary
    """
    # Placeholder: first max_length characters
    if len(text) <= max_length:
        return text
    return text[:max_length].rstrip() + "..."
