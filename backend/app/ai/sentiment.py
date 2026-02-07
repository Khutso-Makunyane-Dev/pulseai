# app/ai/sentiment.py
from transformers import pipeline

# Load sentiment analysis model once (do not reload per request)
sentiment_pipeline = pipeline(
    "sentiment-analysis",
    model="distilbert-base-uncased-finetuned-sst-2-english"
)

def analyze_sentiment(text: str):
    """
    Analyze sentiment of the given text.
    Returns:
        dict: {"sentiment": "POSITIVE"/"NEGATIVE", "confidence": float}
    """
    result = sentiment_pipeline(text)[0]
    return {
        "sentiment": result["label"],
        "confidence": float(result["score"])
    }
