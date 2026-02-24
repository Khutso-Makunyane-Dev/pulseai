# app/ai/sentiment.py
from transformers import pipeline
from functools import lru_cache

@lru_cache(maxsize=1)
def get_sentiment_pipeline():
    """Load and cache the sentiment analysis pipeline lazily."""
    print("Loading sentiment model...") # Helpful log for debugging
    return pipeline(
        "sentiment-analysis",
        model="michellejieli/emotion_text_classifier"  # Tiny model
    )

def analyze_sentiment(text: str):
    """
    Analyze sentiment of the given text.
    Model is loaded on the first request.
    """
    try:
        pipeline = get_sentiment_pipeline()
        result = pipeline(text)[0]
        return {
            "sentiment": result["label"].upper(),
            "confidence": float(result["score"])
        }
    except Exception as e:
        print(f"Sentiment analysis error: {e}")
        return {
            "sentiment": "NEUTRAL",
            "confidence": 0.5
        }