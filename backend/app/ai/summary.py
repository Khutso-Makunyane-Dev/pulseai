# app/ai/summary.py
from transformers import pipeline

# Load summarization model once
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

def summarize_text(text: str, max_length: int = 50):
    """
    Generate an intelligent summary of the text.
    
    Args:
        text (str): Input feedback
        max_length (int): Max length of summary in words
    
    Returns:
        str: Summary
    """
    # For very short texts, just return the text
    if len(text.split()) < 10:
        return text
    
    try:
        # Generate summary using the model
        summary = summarizer(text, max_length=max_length, min_length=10, do_sample=False)
        return summary[0]['summary_text']
    except:
        # Fallback to simple truncation if model fails
        if len(text) <= max_length * 2:
            return text
        return text[:max_length * 2].rsplit(' ', 1)[0] + "..."