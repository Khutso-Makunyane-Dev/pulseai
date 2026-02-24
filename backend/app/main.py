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
    origins = [
        "https://pulseai-vert.vercel.app",                          # Production
        "https://pulseai-git-main-khutsos-projects.vercel.app",     # Your current branch
        "https://pulseai-c9fno2kzw-khutsos-projects.vercel.app",    # Another preview
        "https://pulseai-*.vercel.app",                             # All previews
        "https://*.vercel.app",                                     # All Vercel domains
    ]
else:
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
    return {
        "message": "Welcome to PulseAI API",
        "environment": ENVIRONMENT,
        "docs": "/docs",
        "status": "healthy"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "environment": ENVIRONMENT}

# ✅ ADD THIS AT THE VERY END
if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=False)