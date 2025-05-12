from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date
from app.db.models.task import Task
from app.schemas.task import TaskCreate, TaskUpdate

def get_task(db: Session, task_id: int):
    return db.query(Task).filter(Task.id == task_id).first()

def get_tasks(
    db: Session, 
    skip: int = 0, 
    limit: int = 100, 
    user_id: Optional[int] = None,
    status: Optional[str] = None,
    priority: Optional[str] = None
) -> List[Task]:
    query = db.query(Task)
    
    if user_id is not None:
        query = query.filter(Task.user_id == user_id)
    
    if status is not None:
        query = query.filter(Task.status == status)
        
    if priority is not None:
        query = query.filter(Task.priority == priority)
        
    return query.offset(skip).limit(limit).all()

def create_task(db: Session, task: TaskCreate, user_id: Optional[int] = None):
    db_task = Task(
        title=task.title,
        description=task.description,
        status=task.status,
        priority=task.priority,
        due_date=task.due_date,
        user_id=user_id or task.user_id
    )
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

def update_task(db: Session, task_id: int, task_update: TaskUpdate):
    db_task = get_task(db, task_id)
    if db_task is None:
        return None
        
    # Usando model_dump em vez de dict para compatibilidade com Pydantic v2
    try:
        # Para Pydantic v2
        update_data = task_update.model_dump(exclude_unset=True)
    except AttributeError:
        # Fallback para Pydantic v1
        update_data = task_update.dict(exclude_unset=True)
    
    for key, value in update_data.items():
        setattr(db_task, key, value)
        
    db.commit()
    db.refresh(db_task)
    return db_task

def delete_task(db: Session, task_id: int):
    db_task = get_task(db, task_id)
    if db_task is None:
        return False
        
    db.delete(db_task)
    db.commit()
    return True