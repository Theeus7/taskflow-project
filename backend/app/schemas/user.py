from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    role: str = "user"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    username: str
    email: EmailStr
    role: str = "user"

    class Config:
        from_attributes = True  # Updated from orm_mode for Pydantic v2
