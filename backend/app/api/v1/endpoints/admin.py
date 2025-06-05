from fastapi import APIRouter, Depends, HTTPException, status, Path
from sqlalchemy.orm import Session
from typing import List
from app.schemas.user import UserOut, UserCreate
from app.models.user import User
from app.crud import user as crud_user
from app.db.session import get_db
from app.api.deps import get_current_user

router = APIRouter()

@router.get("/users", response_model=List[UserOut])
def get_all_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Verificar se o usuário atual é um administrador
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Acesso negado. Apenas administradores podem acessar esta funcionalidade."
        )
    
    # Buscar todos os usuários
    users = db.query(User).all()
    return users

@router.post("/create-admin", response_model=UserOut)
def create_admin_user(
    user: UserCreate,
    db: Session = Depends(get_db)
):
    # Verificar se o usuário já existe
    db_user = crud_user.get_user_by_username(db, user.username)
    if db_user:
        raise HTTPException(status_code=400, detail="Usuário já existe")
    
    # Verificar se o email já está em uso
    email_user = crud_user.get_user_by_email(db, user.email)
    if email_user:
        raise HTTPException(status_code=400, detail="Email já está em uso")
    
    # Forçar o papel como admin
    user.role = "admin"
    
    # Criar o usuário administrador
    return crud_user.create_user(db, user)

@router.put("/promote/{user_id}", response_model=UserOut)
def promote_to_admin(
    user_id: int = Path(..., title="The ID of the user to promote"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Verificar se o usuário atual é um administrador
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Acesso negado. Apenas administradores podem promover usuários."
        )
    
    # Buscar o usuário a ser promovido
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    
    # Promover o usuário para administrador
    user.role = "admin"
    db.commit()
    db.refresh(user)
    
    return user