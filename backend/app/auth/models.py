from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base   # ✅ FIXED IMPORT


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)

    sentiment_history = relationship(
    "SentimentHistory",
    back_populates="user",
    cascade="all, delete-orphan"
    )

    messages = relationship(
        "Message",
        back_populates="user",
        cascade="all, delete-orphan"
    )

    chats = relationship(
    "Chat",
    back_populates="user",
    cascade="all, delete-orphan"
    )




class SentimentHistory(Base):
    __tablename__ = "sentiment_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    text = Column(String, nullable=False)
    sentiment = Column(String, nullable=False)
    confidence = Column(Float, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="sentiment_history")

class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    chat_id = Column(Integer, ForeignKey("chats.id"), nullable=False)  # ✅ REQUIRED

    role = Column(String, nullable=False)
    # "user" | "ai"

    content = Column(String, nullable=False)

    risk = Column(Integer, default=0)
    # 0 = no risk, 1 = risk detected

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    user = relationship("User", back_populates="messages")
    chat = relationship("Chat", back_populates="messages")



class Chat(Base):
    __tablename__ = "chats"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    title = Column(String, default="New Chat")
    is_archived = Column(Integer, default=0)  
    # 0 = active, 1 = archived

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="chats")
    messages = relationship(
        "Message",
        back_populates="chat",
        cascade="all, delete-orphan"
    )

