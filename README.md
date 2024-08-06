# Tasks Manager App #

The Tasks Manager App is a task management system developed using FastAPI for the backend and JavaScript for the frontend. This application enables users to create, read, update status and delete tasks efficiently. Tasks can be filtered by labels and priority levels, which include high, medium, and low. The backend, built with Python and FastAPI, integrates with MongoDB for data storage, ensuring robust and scalable handling of task data. The frontend, developed using JavaScript, offers a user-friendly interface for seamless task management.

## Features

1. **Create Task:** Users can create a new task by providing a title, description, label, priority, and status.
2. **Display Tasks:** Existing tasks are displayed, showing their title, description, priority, lebel and status.
3. **Delete Task:** Users can delete a task.
4. **Filter By Priority:** Users can filter tasks according to their priority (high, medium, low).
5. **Filter By Lebal:** Users can filter tasks according to their label
6. **Update status:** Users can update the status of an existing task.


## Technology Stack:

**FastAPI**: A modern, fast web framework for building APIs with Python.

**MongoDB**: A popular NoSQL database that stores data in flexible, JSON-like documents, designed for scalability, high availability, and complex querying capabilities, widely used in modern application development.

## Prerequisites

* Docker
* Docker Compose

## Installation 

1. Clone this repository to your local machine:
```
git clone https://github.com/EASS-HIT-PART-A-2024-CLASS-V/task-manager.git
```
2. Navigate to the project directory:
```
cd task-manager
```
3. Navigate to the frontend directory:
```
cd frontend
```
4. Build the Docker images for front:
```
docker build -t my-task-manager-frontend .
```
5. Navigate to the backend directory:
```
cd ..  
cd backend
```
6. Build the Docker images for backend:
```
docker build -t my-task-manager-backend .
```
7. Run the containers using docker-compose:
```
cd .. 
docker-compose up 
```
The backend of the application is now running at: http://localhost:8000
The frontend of the application is now running at: http://localhost:3000

## Tests

Running the tests:
```
cd backend
pytest -p no:warnings tests.py
```

## Video

https://github.com/user-attachments/assets/8717673b-4678-48fc-bf87-086d3dee5320