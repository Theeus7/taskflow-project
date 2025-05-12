from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.schemas.task import TaskCreate, TaskUpdate, TaskOut
from app.crud import task as crud_task
from app.db.session import get_db
from app.api.deps import get_current_user

router = APIRouter()

@router.post("/", response_model=TaskOut)
def create_task(
    task: TaskCreate,
    db: Session = Depends(get_db),
    current_user_id: Optional[int] = None
):
    """
    Criar uma nova tarefa.
    """
    return crud_task.create_task(db=db, task=task, user_id=current_user_id)

@router.get("/", response_model=List[TaskOut])
def read_tasks(
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = None,
    priority: Optional[str] = None,
    user_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    """
    Recuperar tarefas.
    """
    tasks = crud_task.get_tasks(
        db, 
        skip=skip, 
        limit=limit, 
        user_id=user_id,
        status=status,
        priority=priority
    )
    return tasks

@router.get("/{task_id}", response_model=TaskOut)
def read_task(task_id: int, db: Session = Depends(get_db)):
    """
    Recuperar uma tarefa específica pelo ID.
    """
    db_task = crud_task.get_task(db, task_id=task_id)
    if db_task is None:
        raise HTTPException(status_code=404, detail="Tarefa não encontrada")
    return db_task

@router.put("/{task_id}", response_model=TaskOut)
def update_task(
    task_id: int,
    task: TaskUpdate,
    db: Session = Depends(get_db)
):
    """
    Atualizar uma tarefa.
    """
    db_task = crud_task.update_task(db, task_id=task_id, task_update=task)
    if db_task is None:
        raise HTTPException(status_code=404, detail="Tarefa não encontrada")
    return db_task

@router.delete("/{task_id}", response_model=bool)
def delete_task(task_id: int, db: Session = Depends(get_db)):
    """
    Deletar uma tarefa.
    """
    success = crud_task.delete_task(db, task_id=task_id)
    if not success:
        raise HTTPException(status_code=404, detail="Tarefa não encontrada")
    return True