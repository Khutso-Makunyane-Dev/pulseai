# app/ai/respond.py
from rapidfuzz import fuzz, process
from app.ai.sentiment import analyze_sentiment
from app.ai.topics import extract_topics
from app.ai.risk import detect_risk
from app.ai.summary import summarize_text
from app.ai.feedback import generate_feedback
import re

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
                             "It was built by Khutso Makunyane to make text analysis easy and smart!",
    "who's the creator of pulseai": "Hello {user_name}! PulseAI was created by Khutso Makunyane. "
                                   "It can summarize text, detect sentiment, and highlight key topics and risks.",
    "who is the creator of pulseai": "Hello {user_name}! PulseAI was created by Khutso Makunyane. "
                                     "It helps users analyze and understand text easily.",
    "what does pulseai do": "Hello {user_name}! PulseAI helps users analyze text: it summarizes, detects sentiment, "
                            "highlights topics, and identifies potential risks. Built by Khutso Makunyane.",
    "what can pulseai do": "Hello {user_name}! PulseAI can summarize text, detect sentiment, identify key topics, "
                            "and highlight risks. Developed by Khutso Makunyane.",
    "who developed pulseai": "Hello {user_name}! PulseAI was developed by Khutso Makunyane. "
                             "It's your smart AI assistant for text analysis.",
}

# Casual conversation patterns - when to just chat like a human
CASUAL_PATTERNS = [
    r"hello|hi|hey|greetings|good morning|good afternoon|good evening|howdy",
    r"how are you|how'?s it going|what'?s up|sup|how do you do|you good",
    r"thanks|thank you|appreciate it|thx|ty",
    r"bye|goodbye|see you|talk to you later|cya|laters",
    r"what'?s your name|who are you|introduce yourself",
    r"what can you do|help me|capabilities|features|what do you do",
    r"i (?:just )?want to chat|let'?s talk|just talking|chilling",
    r"tell me a joke|joke|funny|make me laugh|say something funny",
    r"i love you|i like you|you'?re awesome|you are great|you'?re cool",
    r"what do you think about|your opinion on|thoughts on",
    r"how'?s your day|how was your day|you doing okay",
    r"nice|awesome|cool|great|amazing|fantastic",
]

# Topics that require analysis (risk-related)
RISK_TOPICS = [
    "kill", "hurt", "danger", "scam", "lawsuit", "angry", "hate",
    "refund", "broken", "bad", "delay", "threat", "violence",
    "attack", "weapon", "destroy", "damage", "emergency", "help me",
    "suicide", "die", "death", "hurt myself", "end it", "abuse",
]

# Casual responses for when users just want to chat
def get_casual_response(text: str, user_name: str) -> str:
    """Generate a friendly, human-like response for casual conversation"""
    text_lower = text.lower().strip()
    
    # Greetings
    if re.search(r"hello|hi|hey|greetings|howdy", text_lower):
        return f"Hey {user_name}! 👋 Great to see you! How can I make your day better today?"
    
    # How are you / How's it going
    if re.search(r"how are you|how'?s it going|what'?s up|how do you do|you good", text_lower):
        return f"I'm doing really well {user_name}! 😊 Thanks for asking. I'm here, I'm charged up, and ready to chat about anything - whether you need text analysis or just some friendly conversation. What's new with you?"
    
    # Name questions
    if re.search(r"what'?s your name|who are you|introduce yourself", text_lower):
        return f"I'm PulseAI, your friendly AI assistant! 🤖 Created by Khutso Makunyane to help with text analysis, but honestly? I love just chatting with awesome people like you. Think of me as your smart, supportive friend who also happens to be great at analyzing text! 😊"
    
    # Creator questions
    if re.search(r"who (created|built|made) you", text_lower):
        return f"I was brought to life by Khutso Makunyane, a talented software engineer! 🚀 He built me to help people understand text better - analyzing sentiment, detecting risks, finding topics. But he also made sure I'm friendly and fun to talk to! What would you like to know about my creator?"
    
    # What can you do
    if re.search(r"what can you do|capabilities|features|help me|what do you do", text_lower):
        return f"Great question {user_name}! 🌟 I'm a bit of a multitasker:\n\n💬 **Chat casually** - Like we're doing right now!\n📊 **Analyze sentiment** - Tell if text is positive or negative\n⚠️ **Detect risks** - Flag potentially harmful content\n🏷️ **Extract topics** - Find what text is really about\n📝 **Summarize** - Condense long messages\n\nSo basically, I'm your chatty friend who's also a text analysis expert! What would you like to try first?"
    
    # Thanks
    if re.search(r"thanks|thank you|thx|ty|appreciate it", text_lower):
        return f"You're so welcome {user_name}! 💜 It's genuinely my pleasure to chat with you. Anything else you need? I'm all ears!"
    
    # Jokes
    if re.search(r"joke|funny|make me laugh|say something funny", text_lower):
        jokes = [
            f"Hey {user_name}, why don't scientists trust atoms? Because they make up everything! 😄",
            f"What do you call a fake noodle? An impasta! 🍝",
            f"Why did the scarecrow win an award? He was outstanding in his field! 🌾",
            f"What do you call a bear with no teeth? A gummy bear! 🐻",
            f"Why don't eggs tell jokes? They'd crack each other up! 🥚",
            f"What do you call a sleeping bull? A bulldozer! 🐂",
            f"Why can't you give Elsa a balloon? Because she will let it go! ❄️",
            f"What do you call a fish wearing a bowtie? Sofishticated! 🐟",
        ]
        import random
        return random.choice(jokes)
    
    # Compliments
    if re.search(r"i love you|i like you|you'?re awesome|you are great|you'?re cool", text_lower):
        return f"Aww, that's so sweet {user_name}! 💕 You just made my day! I think YOU'RE the awesome one here. What shall we chat about next?"
    
    # Goodbye
    if re.search(r"bye|goodbye|see you|talk to you later|cya|laters", text_lower):
        return f"Bye bye {user_name}! 👋 It was genuinely great chatting with you. Come back anytime - I'm always here when you need analysis or just someone to talk to! Take care! 💜"
    
    # How's your day
    if re.search(r"how'?s your day|how was your day|you doing okay", text_lower):
        return f"My day just got better now that you're here {user_name}! ☀️ I've been chilling in the cloud, ready to help. How's your day going?"
    
    # Simple positive responses
    if re.search(r"nice|awesome|cool|great|amazing|fantastic", text_lower):
        return f"Right?! 😊 You're pretty awesome yourself {user_name}! What else is on your mind?"
    
    # Default casual response for anything else
    return f"Hmm, interesting {user_name}! 🤔 I'm here to help with text analysis OR just chat about whatever's on your mind. What would you prefer? If you want me to analyze something, just send me some text and I'll check the sentiment, risks, and topics!"


def is_casual_conversation(text: str) -> bool:
    """Determine if this is just casual conversation vs needing analysis"""
    text_lower = text.lower().strip()
    
    # Very short messages are usually casual (unless they contain risky words)
    words = text_lower.split()
    if len(words) <= 3:
        # Check if it contains risky words
        if not any(risk in text_lower for risk in RISK_TOPICS):
            return True
    
    # Check if it's a greeting or casual pattern
    for pattern in CASUAL_PATTERNS:
        if re.search(pattern, text_lower):
            return True
    
    # Check for question marks - could be casual questions
    if '?' in text and len(words) <= 8:
        # But make sure it's not asking for analysis
        analysis_keywords = ["analyze", "sentiment", "risk", "topic", "summary"]
        if not any(keyword in text_lower for keyword in analysis_keywords):
            return True
    
    return False


def needs_analysis(text: str) -> bool:
    """Determine if this text needs full AI analysis"""
    text_lower = text.lower()
    words = text_lower.split()
    
    # Check for risky keywords (these ALWAYS need analysis)
    if any(risk in text_lower for risk in RISK_TOPICS):
        return True
    
    # Check for longer text that might need analysis
    if len(words) > 20:  # Longer texts probably need analysis
        return True
    
    # Check for analysis-related keywords
    analysis_keywords = [
        "analyze", "analysis", "sentiment", "risk", "topic", "topics",
        "summary", "summarize", "what does this mean", "check this",
        "review this", "look at this", "tell me about this text",
        "is this safe", "is this risky", "how does this sound",
    ]
    if any(keyword in text_lower for keyword in analysis_keywords):
        return True
    
    # Check if text has multiple sentences (likely needs analysis)
    if text.count('.') > 2 or text.count('!') > 1 or text.count('?') > 2:
        return True
    
    return False


def get_response(user_name: str, text: str):
    """
    Smart response generator - knows when to chat vs when to analyze
    """
    text_lower = text.lower().strip()

    # First, check if it's a general question about PulseAI
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

    # Check if this is casual conversation AND doesn't need analysis
    if is_casual_conversation(text) and not needs_analysis(text):
        casual_response = get_casual_response(text, user_name)
        return {
            "type": "human_response",
            "response": casual_response
        }
    
    # Check if text needs analysis
    if needs_analysis(text):
        # Full AI analysis
        sentiment_result = analyze_sentiment(text)
        topics = extract_topics(text)
        risk_flag = detect_risk(text, sentiment_result["sentiment"])
        summary = summarize_text(text)
        
        # Generate friendly feedback that includes analysis
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
    
    # Default: casual conversation for everything else
    casual_response = get_casual_response(text, user_name)
    return {
        "type": "human_response",
        "response": casual_response
    }


# Minimum similarity percentage to consider it a match
FUZZY_THRESHOLD = 75