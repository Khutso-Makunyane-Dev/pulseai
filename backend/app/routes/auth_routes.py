# app/routes/auth_routes.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.auth import models, schemas, auth
from app.database import get_db

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

# -------------------
# Sign up route
# -------------------
# app/routes/auth_routes.py - update the signup function

@router.post("/signup", response_model=schemas.Token)
def signup(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # Check if user exists
    if db.query(models.User).filter(
        (models.User.username == user.username) | (models.User.email == user.email)
    ).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username or email already registered"
        )
    
    # Validate password length (bcrypt limitation)
    password_bytes = user.password.encode('utf-8')
    if len(password_bytes) > 72:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password too long. Maximum length is 72 bytes (about 72 characters). Please use a shorter password."
        )
    
    # Hash password using updated auth.py
    hashed_pw = auth.hash_password(user.password)
    
    # Create new user
    db_user = models.User(username=user.username, email=user.email, hashed_password=hashed_pw)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    # Generate token using email
    token = auth.create_access_token({"sub": db_user.email})
    return {
        "access_token": token,
        "token_type": "bearer"
    }
# -------------------
# Login route
# -------------------
@router.post("/login", response_model=schemas.Token)
def login(form_data: schemas.UserLogin, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == form_data.email).first()

    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    token = auth.create_access_token({"sub": user.email})
    return {
        "access_token": token,
        "token_type": "bearer"
    }

# -------------------
# Current logged-in user
# -------------------
@router.get("/me", response_model=schemas.UserResponse)  # ✅ Changed to UserResponse
def get_me(current_user: models.User = Depends(auth.get_current_user)):
    """
    Returns the currently authenticated user info.
    """
    return current_user  # ✅ FastAPI will convert ORM model to schema