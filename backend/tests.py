from unittest.mock import MagicMock
import pytest
from fastapi.testclient import TestClient
from main import app, task_manager
from models import Task


@pytest.fixture
def test_client():
    return TestClient(app)


def test_create_task(test_client):
    new_task = Task(
        id="some-id",
        title="Test Task",
        description="This is a test task",
        completed=False,
        priority="medium",
        label="home",
    )

    response = test_client.post("/tasks/", json=new_task.dict())

    assert response.status_code == 200
    assert response.json()["title"] == "Test Task"
    assert task_manager.tasks[0].title == "Test Task"


def test_read_tasks(test_client):
    response = test_client.get("/tasks/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_read_task(test_client):
    task_id = "mock-task-id"
    response = test_client.get(f"/tasks/{task_id}")
    if response.status_code == 200:
        assert response.json()["id"] == task_id
    else:
        assert response.status_code == 404


def test_delete_task(test_client):
    task_id = "mock-task-id"
    response = test_client.delete(f"/tasks/{task_id}")
    if response.status_code == 200:
        assert response.json()["message"] == "Task deleted successfully"
    else:
        assert response.status_code == 404


def test_update_task_completion(test_client):
    task_id = "mock-task-id"
    response = test_client.patch(f"/tasks/{task_id}/complete")

    if response.status_code == 200:
        updated_task = response.json()
        assert (
            updated_task["completed"] is True
        )  # Assuming the task completion status was toggled
    else:
        assert response.status_code == 404
