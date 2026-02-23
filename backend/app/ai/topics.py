# app/ai/topics.py
from collections import Counter
import re

# Common English stop words to filter out
STOP_WORDS = {
    'the', 'and', 'for', 'that', 'this', 'with', 'have', 'from', 
    'you', 'not', 'are', 'was', 'were', 'but', 'they', 'their',
    'there', 'what', 'where', 'when', 'who', 'which', 'will',
    'would', 'could', 'should', 'has', 'had', 'been', 'very',
    'much', 'many', 'some', 'such', 'than', 'then', 'than',
    'just', 'like', 'about', 'into', 'through', 'during',
    'before', 'after', 'while', 'since', 'until', 'because'
}

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
    
    # Split words and remove stop words + short words
    words = [
        w for w in text_clean.split() 
        if len(w) > 2 and w not in STOP_WORDS
    ]
    
    # Count word frequency
    word_counts = Counter(words)
    
    # Return most common words
    topics = [word for word, count in word_counts.most_common(max_topics)]
    
    return topics if topics else ["general"]  # Fallback if no topics found