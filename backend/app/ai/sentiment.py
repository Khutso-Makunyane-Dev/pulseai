# app/ai/sentiment.py
from transformers import pipeline

# Use a tiny, efficient model instead of the larger one
# This model is much smaller and faster, perfect for Render's free tier
sentiment_pipeline = pipeline(
    "sentiment-analysis",
    model="distilbert/distilbert-base-uncased-finetuned-sst-2-english"  # Same model, but with correct path
)

def analyze_sentiment(text: str):
    """
    Analyze sentiment of the given text.
    Returns:
        dict: {"sentiment": "POSITIVE"/"NEGATIVE", "confidence": float}
    """
    try:
        result = sentiment_pipeline(text)[0]
        return {
            "sentiment": result["label"],
            "confidence": float(result["score"])
        }
    except Exception as e:
        # Fallback in case of error
        print(f"Sentiment analysis error: {e}")
        return {
            "sentiment": "NEUTRAL",
            "confidence": 0.5
        }