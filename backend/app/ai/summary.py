# app/ai/summary.py
from transformers import pipeline
from functools import lru_cache

@lru_cache(maxsize=1)
def get_summarizer():
    """Load and cache the summarization pipeline lazily."""
    print("Loading T5 summarization model...")  # Helpful log for debugging
    return pipeline(
        "summarization",
        model="t5-small",
        tokenizer="t5-small"
    )

def summarize_text(text: str, max_length: int = 50):
    """
    Generate a summary using a lightweight model.
    Model is loaded on the first request.
    """
    # For very short texts, just return the text
    if len(text.split()) < 10:
        return text

    try:
        summarizer = get_summarizer()  # Loads only when first called
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