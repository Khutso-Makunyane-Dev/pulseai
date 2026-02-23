# app/routes/analysis_routes.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import json
from sqlalchemy import func, extract
from datetime import datetime, timedelta

from app.database import get_db
from app.auth.auth import get_current_user
from app.auth.models import User, SentimentHistory
from app.auth.models import Chat, Message  # ✅ Import chat/message models
from app.ai.respond import get_response

router = APIRouter(
    prefix="/analysis",
    tags=["Analysis"]
)

# --- Existing AI Analysis Routes ---

@router.post("/", summary="Analyze text and generate AI response")
def analyze_feedback(
    request: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    text = request.get("text")
    chat_id = request.get("chat_id")  # 👈 Add this to receive chat_id from frontend
    
    if not text:
        raise HTTPException(status_code=400, detail="Text is required")

    ai_result = get_response(user_name=current_user.username, text=text)

    # Save user message to chat if chat_id is provided
    if chat_id:
        # Verify chat belongs to user
        chat = db.query(Chat).filter(
            Chat.id == chat_id, 
            Chat.user_id == current_user.id
        ).first()
        
        if chat:
            # Save user message (ALWAYS save this)
            user_message = Message(
                chat_id=chat.id,
                user_id=current_user.id,
                role="user",
                content=text,
                risk=0
            )
            db.add(user_message)

            # Save AI response based on type (ALWAYS save this)
            if ai_result["type"] == "analysis_response":
                # Analysis response - save as JSON with all data
                ai_content = {
                    "text": ai_result.get("feedback", ""),
                    "summary": ai_result.get("summary", ""),
                    "sentiment": ai_result.get("sentiment", {}),
                    "topics": ai_result.get("topics", []),
                    "feedback": ai_result.get("feedback", ""),
                    "risk": ai_result.get("risk", False)
                }
                
                ai_message = Message(
                    chat_id=chat.id,
                    user_id=current_user.id,
                    role="ai",
                    content=json.dumps(ai_content),  # Store as JSON string
                    risk=1 if ai_result.get("risk") else 0
                )
                
            else:  # human_response (casual conversation)
                # Casual response - save as plain text
                ai_message = Message(
                    chat_id=chat.id,
                    user_id=current_user.id,
                    role="ai",
                    content=ai_result.get("response", ""),  # Just the text response
                    risk=0  # Casual messages have no risk
                )
            
            db.add(ai_message)
            db.commit()

    # Save to sentiment history ONLY for analysis responses
    if ai_result["type"] == "analysis_response":
        sentiment_result = ai_result["sentiment"]

        history = SentimentHistory(
            user_id=current_user.id,
            text=text,
            sentiment=sentiment_result["sentiment"],
            confidence=sentiment_result["confidence"]
        )
        db.add(history)
        db.commit()
        db.refresh(history)

        ai_result.update({
            "id": history.id,
            "created_at": history.created_at.isoformat()
        })

    return ai_result

@router.get("/history", summary="Get all analysis history for the user")
def get_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    history = (
        db.query(SentimentHistory)
        .filter(SentimentHistory.user_id == current_user.id)
        .order_by(SentimentHistory.created_at.desc())
        .all()
    )

    return [
        {
            "id": h.id,
            "text": h.text,
            "sentiment": h.sentiment,
            "confidence": h.confidence,
            "created_at": h.created_at.isoformat()
        }
        for h in history
    ]


# --- New Chat & Messages Routes ---

@router.post("/chats", summary="Create a new chat")
def create_chat(
    request: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    title = request.get("title", "New Chat")
    chat = Chat(user_id=current_user.id, title=title)
    db.add(chat)
    db.commit()
    db.refresh(chat)
    return {"id": chat.id, "title": chat.title, "created_at": chat.created_at.isoformat()}


@router.get("/chats", summary="Get all chats for current user")
def get_chats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    chats = db.query(Chat).filter(Chat.user_id == current_user.id).order_by(Chat.created_at.desc()).all()
    return [
        {"id": c.id, "title": c.title, "is_archived": c.is_archived, "created_at": c.created_at.isoformat()}
        for c in chats
    ]


@router.get("/chats/{chat_id}/messages", summary="Get all messages in a chat")
def get_chat_messages(
    chat_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    chat = db.query(Chat).filter(Chat.id == chat_id, Chat.user_id == current_user.id).first()
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")

    messages = []
    for m in chat.messages:
        content = m.content
        # Try to parse JSON content for AI messages
        if m.role == "ai":
            try:
                content = json.loads(m.content)
            except:
                pass
        
        messages.append({
            "id": m.id,
            "role": m.role,
            "content": content,
            "risk": m.risk,
            "created_at": m.created_at.isoformat()
        })
    
    return messages

@router.post("/chats/{chat_id}/messages", summary="Send/save a message in a chat")
def send_message(
    chat_id: int,
    request: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    chat = db.query(Chat).filter(Chat.id == chat_id, Chat.user_id == current_user.id).first()
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")

    role = request.get("role")
    content = request.get("content")
    risk = request.get("risk", 0)

    if role not in ("user", "ai") or not content:
        raise HTTPException(status_code=400, detail="Invalid role or content")

    # If content is a dict (for AI messages), store as JSON
    if role == "ai" and isinstance(content, dict):
        import json
        content = json.dumps(content)

    message = Message(
        chat_id=chat.id, 
        user_id=current_user.id, 
        role=role, 
        content=content, 
        risk=risk
    )
    db.add(message)
    db.commit()
    db.refresh(message)

    # Parse content back to dict if it's JSON
    response_content = content
    if role == "ai":
        try:
            response_content = json.loads(content)
        except:
            pass

    return {
        "id": message.id,
        "role": message.role,
        "content": response_content,
        "risk": message.risk,
        "created_at": message.created_at.isoformat()
    }

@router.delete("/chats/{chat_id}", summary="Delete / clear a chat")
def delete_chat(
    chat_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    chat = db.query(Chat).filter(Chat.id == chat_id, Chat.user_id == current_user.id).first()
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")

    db.delete(chat)
    db.commit()

    return {"detail": "Chat deleted successfully"}

# rename chat automatic
@router.patch("/chats/{chat_id}/title", summary="Update chat title")
def update_chat_title(
    chat_id: int,
    request: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update the title of a chat"""
    chat = db.query(Chat).filter(
        Chat.id == chat_id, 
        Chat.user_id == current_user.id
    ).first()
    
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    
    new_title = request.get("title")
    if not new_title:
        raise HTTPException(status_code=400, detail="Title is required")
    
    chat.title = new_title
    db.commit()
    
    return {"id": chat.id, "title": chat.title}

@router.get("/dashboard/stats", summary="Get dashboard statistics")
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get overall statistics for the dashboard"""
    
    # Total analyses (sentiment history count) for CURRENT USER ONLY
    total_analyses = db.query(SentimentHistory).filter(
        SentimentHistory.user_id == current_user.id
    ).count()
    
    # Average sentiment confidence for CURRENT USER ONLY
    avg_sentiment = db.query(
        func.avg(SentimentHistory.confidence)
    ).filter(
        SentimentHistory.user_id == current_user.id
    ).scalar() or 0
    
    # Risk alerts (messages with risk=1) for CURRENT USER ONLY
    risk_alerts = db.query(Message).filter(
        Message.user_id == current_user.id,
        Message.risk == 1
    ).count()
    
    # Topics analyzed for CURRENT USER ONLY
    topics_count = db.query(Message).filter(
        Message.user_id == current_user.id,
        Message.role == "ai",
        Message.content.like('%topics%')
    ).count()
    
    return {
        "total_analyses": total_analyses,
        "avg_sentiment": round(avg_sentiment * 100, 1),
        "risk_alerts": risk_alerts,
        "topics_analyzed": topics_count
    }


@router.get("/dashboard/sentiment-trends", summary="Get sentiment trends over time")
def get_sentiment_trends(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get sentiment data for the last 6 months"""
    
    # Get data for last 6 months
    end_date = datetime.now()
    start_date = end_date - timedelta(days=180)
    
    # Query sentiment history grouped by month
    results = db.query(
        extract('month', SentimentHistory.created_at).label('month'),
        extract('year', SentimentHistory.created_at).label('year'),
        func.avg(SentimentHistory.confidence).label('avg_confidence'),
        func.count().label('count')
    ).filter(
        SentimentHistory.user_id == current_user.id,
        SentimentHistory.created_at >= start_date
    ).group_by('year', 'month').order_by('year', 'month').all()
    
    # Format for chart
    months = []
    sentiment_scores = []
    
    month_names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                   "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    
    for r in results:
        month_idx = int(r.month) - 1
        months.append(month_names[month_idx])
        sentiment_scores.append(round(float(r.avg_confidence) * 100, 1))
    
    return {
        "labels": months,
        "data": sentiment_scores
    }


@router.get("/dashboard/risk-distribution", summary="Get risk level distribution")
def get_risk_distribution(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get distribution of risk levels in messages"""
    
    # Count messages by risk level (0 = no risk, 1 = risk)
    no_risk = db.query(Message).filter(
        Message.user_id == current_user.id,
        Message.risk == 0
    ).count()
    
    risk = db.query(Message).filter(
        Message.user_id == current_user.id,
        Message.risk == 1
    ).count()
    
    # You can categorize further if needed
    return {
        "labels": ["Low", "Medium", "High"],
        "data": [no_risk, risk, 0]  # Adjust as needed
    }


@router.get("/dashboard/topics-frequency", summary="Get most frequent topics from messages")
def get_topics_frequency(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Extract and count real topics from user's AI messages"""
    
    # Get all AI messages for the current user
    ai_messages = db.query(Message).filter(
        Message.user_id == current_user.id,
        Message.role == "ai"
    ).all()
    
    topic_counter = {}
    
    for message in ai_messages:
        try:
            # Try to parse the content as JSON
            content = json.loads(message.content)
            
            # Extract topics if they exist
            if isinstance(content, dict) and 'topics' in content:
                topics = content['topics']
                if isinstance(topics, list):
                    for topic in topics:
                        # Clean and capitalize topic
                        topic = topic.strip().lower()
                        if topic and len(topic) > 2:  # Filter out very short topics
                            topic_counter[topic] = topic_counter.get(topic, 0) + 1
        except (json.JSONDecodeError, AttributeError, KeyError):
            # Skip messages that aren't JSON or don't have topics
            continue
    
    # Sort by frequency and get top 8 topics (for better chart display)
    sorted_topics = sorted(topic_counter.items(), key=lambda x: x[1], reverse=True)[:8]
    
    if not sorted_topics:
        # Return a friendly message when no topics found
        return {
            "labels": ["No topics yet"],
            "data": [1]
        }
    
    # Format for the chart
    labels = [topic[0].capitalize() for topic in sorted_topics]
    data = [topic[1] for topic in sorted_topics]
    
    return {
        "labels": labels,
        "data": data
    }