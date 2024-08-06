from pydantic import BaseModel
from typing import Optional, Literal


class Task(BaseModel):
    id: str
    title: str
    description: Optional[str] = None
    completed: bool = False
    priority: Literal["low", "medium", "high"]
    label: Optional[str]


class TaskManager(BaseModel):
    tasks: list[Task] = []
