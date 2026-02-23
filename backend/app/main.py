# app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

from app.auth import models
from app.database import engine
from app.routes import auth_routes, analysis_routes

# Load environment variables
load_dotenv()

# Create all database tables
models.Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(
    title="PulseAI Sentiment Analysis",
    description="Analyze text sentiment, topics, risk, and summary using AI",
    version="1.0"
)

# Get environment
ENVIRONMENT = os.getenv("ENVIRONMENT", "development")

# CORS configuration
if ENVIRONMENT == "production":
    # In production, only allow your frontend domains
    origins = [
        "https://your-frontend.vercel.app",  # You'll update this after frontend deploy
        # Add your custom domain here if you have one
    ]
else:
    # In development, allow localhost
    origins = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:8000",
    ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_routes.router)
app.include_router(analysis_routes.router)

@app.get("/")
def root():
    """Root endpoint to verify API is running"""
    return {
        "message": "Welcome to PulseAI API",
        "environment": ENVIRONMENT,
        "docs": "/docs",
        "status": "healthy"
    }

@app.get("/health")
def health_check():
    """Health check endpoint for Render"""
    return {"status": "healthy", "environment": ENVIRONMENT}