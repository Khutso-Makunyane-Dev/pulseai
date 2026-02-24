# app/auth/auth.py
import bcrypt
from datetime import datetime, timedelta
from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.database import get_db
from app.auth import models
import logging

# -------------------
# Config & Password
# -------------------
SECRET_KEY = "KHUTSO1684!"  # replace with a secure random string
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def truncate_password(password: str) -> str:
    """Truncate password to 72 bytes (bcrypt limitation)"""
    password_bytes = password.encode('utf-8')
    if len(password_bytes) > 72:
        logger.info(f"Password truncated from {len(password_bytes)} to 72 bytes")
        password_bytes = password_bytes[:72]
        return password_bytes.decode('utf-8', errors='ignore')
    return password

def hash_password(password: str) -> str:
    """Hash password using bcrypt directly (no passlib dependency)"""
    truncated = truncate_password(password)
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(truncated.encode('utf-8'), salt)
    return hashed.decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password using bcrypt directly"""
    truncated = truncate_password(plain_password)
    return bcrypt.checkpw(
        truncated.encode('utf-8'),
        hashed_password.encode('utf-8')
    )

# -------------------
# JWT Token
# -------------------
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# -------------------
# Auth Helpers
# -------------------
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    """
    Decode JWT token and return the current user from database.
    Raises 401 if token is invalid or user not found.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = db.query(models.User).filter(models.User.email == email).first()
    if user is None:
        raise credentials_exception

    return user