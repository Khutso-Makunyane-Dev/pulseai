# app/routes/analysis_routes.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

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
    if not text:
        raise HTTPException(status_code=400, detail="Text is required")

    ai_result = get_response(user_name=current_user.username, text=text)

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

    return [
        {
            "id": m.id,
            "role": m.role,
            "content": m.content,
            "risk": m.risk,
            "created_at": m.created_at.isoformat()
        }
        for m in chat.messages
    ]


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

    message = Message(chat_id=chat.id, user_id=current_user.id, role=role, content=content, risk=risk)
    db.add(message)
    db.commit()
    db.refresh(message)

    return {
        "id": message.id,
        "role": message.role,
        "content": message.content,
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
