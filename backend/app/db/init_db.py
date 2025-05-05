from sqlalchemy.orm import Session
from app.db.base import Base
from app.db.session import engine
from app.db.models.user import User
from app.schemas.user import UserCreate
from app.crud.user import create_user

def init_db(db: Session) -> None:
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    # Check if we already have users
    user = db.query(User).first()
    if not user:
        # Create a test user
        user_in = UserCreate(
            username="fernando",
            email="fernando@example.com",
            password="fernando123"
        )
        create_user(db=db, user=user_in)