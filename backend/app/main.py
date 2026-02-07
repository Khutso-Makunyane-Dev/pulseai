# app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.auth import models
from app.database import engine
from app.routes import auth_routes, analysis_routes

# Create all database tables
models.Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(
    title="PulseAI Sentiment Analysis",
    description="Analyze text sentiment, topics, risk, and summary using AI",
    version="1.0"
)

# ✅ CORS MIDDLEWARE
# This allows your Vite frontend to call FastAPI without CORS issues
origins = [
    "http://localhost:5173",  # Vite dev server
    "http://127.0.0.1:5173",
    "http://localhost:8000",   # optional if testing backend directly
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,        # which origins are allowed
    allow_credentials=True,       # allows cookies, authorization headers
    allow_methods=["*"],          # GET, POST, PUT, DELETE, OPTIONS
    allow_headers=["*"],          # allow all headers
)

# Include routers
app.include_router(auth_routes.router)
app.include_router(analysis_routes.router)
