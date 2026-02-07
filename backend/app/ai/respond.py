# app/ai/respond.py
from rapidfuzz import fuzz, process
from app.ai.sentiment import analyze_sentiment
from app.ai.topics import extract_topics
from app.ai.risk import detect_risk
from app.ai.summary import summarize_text
from app.ai.feedback import generate_feedback


# General PulseAI questions with human-like responses
GENERAL_QUESTIONS = {
    "who built pulseai": "Hello {user_name}! PulseAI is your personal AI assistant for analyzing text. "
                         "It can summarize text, detect sentiment, identify key topics, and highlight any risks. "
                         "PulseAI was created to help users understand their feedback and messages more easily. "
                         "It was built by Khutso Makunyane, your friendly Software Engineer!",
    "who created pulseai": "Hello {user_name}! PulseAI was created by Khutso Makunyane. "
                           "It helps users analyze text, summarize it, detect sentiment, and highlight topics and risks.",
    "what is pulseai": "Hello {user_name}! PulseAI is your personal AI assistant that can summarize text, "
                       "analyze sentiment, detect key topics, and identify risks. It was built by Khutso Makunyane.",
    "tell me about pulseai": "Hello {user_name}! PulseAI is your AI assistant for understanding messages and feedback. "
                             "It was built by Khutso Makunyane to make text analysis easy and smart!",  # ✅ comma added
    "who's the creator of pulseai": "Hello {user_name}! PulseAI was created by Khutso Makunyane. "
                                   "It can summarize text, detect sentiment, and highlight key topics and risks.",
    "who is the creator of pulseai": "Hello {user_name}! PulseAI was created by Khutso Makunyane. "
                                     "It helps users analyze and understand text easily.",
    "what does pulseai do": "Hello {user_name}! PulseAI helps users analyze text: it summarizes, detects sentiment, "
                            "highlights topics, and identifies potential risks. Built by Khutso Makunyane.",
    "what can pulseai do": "Hello {user_name}! PulseAI can summarize text, detect sentiment, identify key topics, "
                            "and highlight risks. Developed by Khutso Makunyane.",
    "who developed pulseai": "Hello {user_name}! PulseAI was developed by Khutso Makunyane. "
                             "It’s your smart AI assistant for text analysis.",
}


# Minimum similarity percentage to consider it a match
FUZZY_THRESHOLD = 75

def get_response(user_name: str, text: str):
    """
    Generate AI response for user text.
    - If text is a general question (even with typos), respond like a human.
    - Otherwise, do full AI analysis and generate friendly feedback.
    """
    text_lower = text.lower().strip()

    # Fuzzy match user input to general questions
    best_match, score, _ = process.extractOne(
        text_lower,
        GENERAL_QUESTIONS.keys(),
        scorer=fuzz.token_sort_ratio
    )


    if score >= FUZZY_THRESHOLD:
        return {
            "type": "human_response",
            "response": GENERAL_QUESTIONS[best_match].format(user_name=user_name)
        }

    # Full AI analysis
    sentiment_result = analyze_sentiment(text)
    topics = extract_topics(text)
    risk_flag = detect_risk(text, sentiment_result["sentiment"])
    summary = summarize_text(text)

    feedback_message = generate_feedback(
        user_name=user_name,
        sentiment=sentiment_result,
        summary=summary,
        topics=topics,
        risk=risk_flag
    )

    return {
        "type": "analysis_response",
        "sentiment": sentiment_result,
        "topics": topics,
        "risk": risk_flag,
        "summary": summary,
        "feedback": feedback_message
    }
