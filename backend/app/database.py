# app/database.py
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from typing import Generator

# Database URL (SQLite for MVP)
SQLALCHEMY_DATABASE_URL = "sqlite:///./pulseai.db"

# Create SQLAlchemy engine
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False}  # SQLite specific
)

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()

# Dependency for FastAPI routes
def get_db() -> Generator[Session, None, None]:
    """
    Provides a database session for each request.
    Use with Depends(get_db) in your FastAPI routes.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
