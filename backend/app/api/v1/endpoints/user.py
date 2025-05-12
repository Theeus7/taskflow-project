from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.schemas.user import UserCreate, UserLogin, UserOut
from app.crud import user as crud_user
from app.db.session import get_db

router = APIRouter()

@router.post("/register", response_model=UserOut)
def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = crud_user.get_user_by_username(db, user.username)
    if db_user:
        raise HTTPException(status_code=400, detail="Usuário já existe")
    
    # Verificar se o email já está em uso
    email_user = crud_user.get_user_by_email(db, user.email)
    if email_user:
        raise HTTPException(status_code=400, detail="Email já está em uso")
        
    return crud_user.create_user(db, user)

@router.post("/login", response_model=UserOut)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    user = crud_user.authenticate_user(db, credentials.email, credentials.password)
    if not user:
        raise HTTPException(status_code=401, detail="Credenciais inválidas")
    return user
