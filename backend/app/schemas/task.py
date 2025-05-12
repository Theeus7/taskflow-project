from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime

class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    status: str = "pendente"  # pendente, em_andamento, concluida
    priority: str = "media"   # baixa, media, alta
    due_date: Optional[date] = None
    user_id: Optional[int] = None

class TaskCreate(TaskBase):
    pass

class TaskUpdate(TaskBase):
    title: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None

class TaskOut(TaskBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True