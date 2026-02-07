from pydantic import BaseModel, EmailStr, Field

# -------------------
# Schema for user signup
# -------------------
class UserCreate(BaseModel):
    username: str = Field(..., min_length=3, max_length=50, example="khutso")
    email: EmailStr = Field(..., example="khutso@example.com")
    password: str = Field(..., min_length=6, example="strongpassword123")

# -------------------
# Schema for user login
# -------------------
class UserLogin(BaseModel):
    email: EmailStr = Field(..., example="khutso@example.com")
    password: str = Field(..., min_length=6, example="strongpassword123")

# -------------------
# Schema for JWT token response
# -------------------
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
