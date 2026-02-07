# app/ai/topics.py
from collections import Counter
import re

def extract_topics(text: str, max_topics: int = 5):
    """
    Extract key topics/keywords from a text.
    
    Args:
        text (str): Input text
        max_topics (int): Maximum number of topics to return

    Returns:
        list[str]: Top topics/keywords
    """
    # Basic cleaning: lowercase + remove punctuation
    text_clean = re.sub(r"[^\w\s]", "", text.lower())
    
    # Split words and remove short words (like 'a', 'the')
    words = [w for w in text_clean.split() if len(w) > 2]
    
    # Count word frequency
    word_counts = Counter(words)
    
    # Return most common words
    return [word for word, count in word_counts.most_common(max_topics)]
