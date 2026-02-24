# app/ai/summary.py
from transformers import pipeline

# Use a tiny, efficient summarization model
# "t5-small" is much smaller than BART
summarizer = pipeline(
    "summarization",
    model="t5-small",
    tokenizer="t5-small"
)

def summarize_text(text: str, max_length: int = 50):
    """
    Generate a summary using a lightweight model.
    
    Args:
        text (str): Input text
        max_length (int): Max length of summary in words
    
    Returns:
        str: Summary
    """
    # For very short texts, just return the text
    if len(text.split()) < 10:
        return text
    
    try:
        # T5 works better with a prefix
        summary = summarizer(
            "summarize: " + text,
            max_length=max_length,
            min_length=10,
            do_sample=False
        )
        return summary[0]['summary_text']
    except Exception as e:
        print(f"Summarization error: {e}")
        # Simple fallback
        return text[:100] + "..." if len(text) > 100 else text