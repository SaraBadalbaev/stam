from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from typing import List, Literal
import uuid
from models import Task, TaskManager
from pymongo import MongoClient


app = FastAPI()

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB Atlas connection
client = MongoClient(
    "mongodb+srv://sarabadl93:Sara2000@cluster0.qsricje.mongodb.net/?appName=Cluster0"
)
db = client.task_manager
tasks_collection = db.tasks

# Initialize templates
templates = Jinja2Templates(directory="templates")

task_manager = TaskManager()


@app.post("/tasks/", response_model=Task)
async def create_task(task: Task):
    task.id = str(uuid.uuid4())
    task_manager.tasks.append(task)
    tasks_collection.insert_one(task.dict())
    return task


@app.get("/tasks/", response_model=List[Task])
async def read_tasks():
    tasks_cursor = tasks_collection.find({})
    tasks = [Task(**task) for task in list(tasks_cursor)]
    return tasks


@app.get("/tasks/{task_id}", response_model=Task)
async def read_task(task_id: str):
    task = tasks_collection.find_one({"id": task_id})
    if task:
        return Task(**task)
    else:
        raise HTTPException(status_code=404, detail="Task not found")


@app.put("/tasks/{task_id}", response_model=Task)
async def update_task(task_id: str, task: Task):
    updated_task = tasks_collection.find_one_and_update(
        {"id": task_id}, {"$set": task.dict()}, return_document=True
    )
    if updated_task:
        return Task(**updated_task)
    else:
        raise HTTPException(status_code=404, detail="Task not found")


@app.delete("/tasks/{task_id}", response_model=Task)
async def delete_task(task_id: str):
    deleted_task = tasks_collection.find_one_and_delete({"id": task_id})
    if deleted_task:
        return Task(**deleted_task)
    else:
        raise HTTPException(status_code=404, detail="Task not found")


@app.get("/tasks/priority/{priority}", response_model=List[Task])
def read_tasks_by_priority(priority: Literal["low", "medium", "high"]):
    tasks_cursor = tasks_collection.find({"priority": priority})
    tasks = [Task(**task) for task in tasks_cursor]
    return tasks


@app.get("/tasks/label/{label}", response_model=List[Task])
def read_tasks_by_label(label: str):
    tasks_cursor = tasks_collection.find({"label": label})
    tasks = [Task(**task) for task in tasks_cursor]
    return tasks


@app.patch("/tasks/{task_id}/complete", response_model=Task)
async def update_task_completion(task_id: str):
    task = tasks_collection.find_one({"id": task_id})
    if task:
        new_completed_status = not task["completed"]
        tasks_collection.update_one(
            {"id": task_id}, {"$set": {"completed": new_completed_status}}
        )
        updated_task = tasks_collection.find_one({"id": task_id})
        return Task(**updated_task)
    else:
        raise HTTPException(status_code=404, detail="Task not found")
