document.addEventListener("DOMContentLoaded", function () {
    const createTaskBtn = document.getElementById("create-task-btn");
    const createTaskForm = document.getElementById("create-task-form");
    const filterByLabelBtn = document.getElementById("filter-by-label-btn");
    const filterByPriorityBtn = document.getElementById("filter-by-priority-btn");
    const showAllBtn = document.getElementById("show-all-btn");
    const taskList = document.getElementById("task-list");

    fetchTasks();

    createTaskBtn.addEventListener("click", function () {
        createTaskForm.classList.toggle("show");
    });

    createTaskForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const formData = new FormData(createTaskForm);
        const taskData = {
            id: generateUniqueId(), // Generate a new unique ID
            title: formData.get('title'),
            description: formData.get('description'),
            priority: formData.get('priority'),
            label: formData.get('label'),
            completed: false // Assuming new tasks are initially not completed
        };

        fetch('http://localhost:8000/tasks/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(taskData),
        })
            .then(response => {
                if (response.ok) {
                    alert('Task created successfully!');
                    fetchTasks(); // Refresh task list
                    createTaskForm.reset();
                    createTaskForm.classList.remove('show');
                } else {
                    alert('Failed to create task. Please try again.');
                }
            })
            .catch(error => console.error('Error creating task:', error));
    });

    function generateUniqueId() {
        // Generate a unique ID (you can use any method you prefer)
        return Math.random().toString(36).substr(2, 9);
    }

    filterByLabelBtn.addEventListener("click", async function () {
        const label = prompt("Enter label to filter by:");
        if (label) {
            const response = await fetch(`http://localhost:8000/tasks/label/${label}`);
            if (response.ok) {
                const tasks = await response.json();
                displayTasks(tasks);
            } else {
                alert("Failed to fetch tasks. Please try again.");
            }
        }
    });

    filterByPriorityBtn.addEventListener("click", async function () {
        const priority = prompt("Enter priority to filter by (low, medium, high):");
        if (priority && ['low', 'medium', 'high'].includes(priority.toLowerCase())) {
            const response = await fetch(`http://localhost:8000/tasks/priority/${priority.toLowerCase()}`);
            if (response.ok) {
                const tasks = await response.json();
                displayTasks(tasks);
            } else {
                alert("Failed to fetch tasks. Please try again.");
            }
        } else {
            alert("Invalid priority entered. Please enter 'low', 'medium', or 'high'.");
        }
    });

    showAllBtn.addEventListener("click", async function () {
        fetchTasks(); // Fetch all tasks
    });

    // Fetch and display tasks on page load
    fetchTasks();

    // Function to display tasks in the UI
    function displayTasks(tasks) {
        taskList.innerHTML = "";
        tasks.forEach(task => {
            const listItem = document.createElement("li");
            listItem.dataset.taskId = task.id; // Set the task ID as a data attribute
            listItem.innerHTML = `
                <div class="task-details">
                    <div class="task-title">${task.title}</div>
                    <div class="task-description">Description: ${task.description}</div>
                    <div class="task-info">
                        <div class="task-label">Label: ${task.label}</div>
                        <div class="task-priority">Priority: ${task.priority}</div>
                        <div class="task-completed">Completed: ${task.completed ? 'Yes' : 'No'}</div>
                    </div>
                </div>
                <button class="change-status-button" data-task-id="${task.id}">Change status</button>
                <button class="delete-button" data-task-id="${task.id}">Delete</button>
            `;
            taskList.appendChild(listItem);
        });

        // Add event listeners to delete buttons
        const deleteButtons = document.querySelectorAll(".delete-button");
        deleteButtons.forEach(button => {
            button.addEventListener("click", function () {
                const taskId = this.dataset.taskId;
                deleteTask(taskId);
            });
        });

        // Add event listeners to toggle completion buttons
        const statusButtons = document.querySelectorAll(".change-status-button");
        statusButtons.forEach(button => {
            button.addEventListener("click", function () {
                const taskId = this.dataset.taskId;
                toggleTaskCompletion(taskId);
            });
        });
    }

    // Function to fetch tasks from the backend
    async function fetchTasks() {
        try {
            const response = await fetch("http://localhost:8000/tasks/");
            if (response.ok) {
                const tasks = await response.json();
                displayTasks(tasks);
            } else {
                alert("Failed to fetch tasks. Please try again.");
            }
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    }

    // Function to toggle task completion
    async function toggleTaskCompletion(taskId) {
        try {
            const response = await fetch(`http://localhost:8000/tasks/${taskId}/complete`, {
                method: 'PATCH',
            });

            if (response.ok) {
                const updatedTask = await response.json();
                alert(`Task completion status updated.`);
                fetchTasks(); // Refresh task list
            } else {
                alert(`Failed to update task completion status.`);
            }
        } catch (error) {
            console.error('Error updating task:', error);
        }
    }

    // Function to delete a task
    function deleteTask(taskId) {
        if (confirm(`Are you sure you want to delete task with ID ${taskId}?`)) {
            fetch(`http://localhost:8000/tasks/${taskId}`, {
                method: 'DELETE',
            })
                .then(response => {
                    if (response.ok) {
                        alert(`Task with ID ${taskId} deleted successfully.`);
                        fetchTasks(); // Refresh task list
                    } else {
                        alert(`Failed to delete task with ID ${taskId}. Please try again.`);
                    }
                })
                .catch(error => console.error('Error deleting task:', error));
        }
    }
    fetchTasks();
});