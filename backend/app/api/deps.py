from typing import Optional
from fastapi import Depends, HTTPException, status, Header
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.crud import user as crud_user
from app.models.user import User

# Função para obter o usuário atual a partir do cabeçalho de autenticação
def get_current_user(
    db: Session = Depends(get_db),
    current_user_id: Optional[str] = Header(None, alias="X-User-ID")
) -> User:
    if not current_user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Não autenticado"
        )
    
    try:
        user_id_int = int(current_user_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="ID de usuário inválido"
        )
    
    user = db.query(User).filter(User.id == user_id_int).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuário não encontrado"
        )
    
    return user