const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));


let currentTasks = [];
let filteredTasks = [];


// CHECK LOGIN
if (!token) {
    window.location.href = "index.html";
}



// WELCOME MESSAGE
if (user) {
    document.getElementById("welcomeMessage").textContent =
        `Welcome, ${user.name}!`;
}



// LOGOUT
document.getElementById("logoutButton").addEventListener("click", () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "index.html";

});






// LOAD TASKS
async function loadTasks() {
    try {
        const response = await fetch(
            `${API_BASE_URL}/api/tasks`,
            {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );
        const data = await response.json();
        if (response.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "index.html";
            return;
        }
        if (!response.ok) {
            document.getElementById("taskList").innerHTML =
                `<p>${data.message}</p>`;
            return;
        }
        /*
        if (!response.ok) {
            document.getElementById("taskList").innerHTML =
                `<p>${data.message}</p>`;
            return;
        }
        */
        

        currentTasks = data.tasks;
        displayTasks(currentTasks);
    } catch (error) {
        console.error("CAUGHT ERROR:", error.name, error.message);
        console.error(error);
        document.getElementById("taskList").innerHTML =
            "<p>Unable to load tasks.</p>";
    }
}


function searchTasks() {
    const searchInput = document
        .getElementById("taskSearch")
        .value
        .trim()
        .toLowerCase();

    const filteredTasks = currentTasks.filter((task) => {
        const title = (task.title || "").toLowerCase();
        const description = (task.description || "").toLowerCase();

        return title.includes(searchInput) ||
               description.includes(searchInput);
    });

    displayTasks(filteredTasks);
}




// Display Tasks
function displayTasks(tasks) {
    filteredTasks = tasks;
    const totalTasks = currentTasks.length;
    const completedTasks = currentTasks.filter(
        (task) => task.completed
    ).length;
    const pendingTasks = totalTasks - completedTasks;
    document.getElementById("totalTasks").textContent =
        totalTasks;
    document.getElementById("completedTasks").textContent =
        completedTasks;
    document.getElementById("pendingTasks").textContent =
        pendingTasks;
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = "";
    if (tasks.length === 0) {
        taskList.innerHTML = `
            <tr>
                <td colspan="7">No tasks found.</td>
            </tr>
        `;
        return;
    }
    tasks.forEach((task) => {
        const row = document.createElement("tr");
        const priority = task.priority || "Medium";
        row.innerHTML = `
            <td>${task.title}</td>
            <td>${task.description || "-"}</td>
            <td>${task.category || "General"}</td>
            <td>
                ${
                    task.dueDate
                        ? new Date(task.dueDate).toLocaleDateString("en-GB")
                        : "-"
                }
            </td>
            <td>
                <span class="priority-${priority.toLowerCase()}">
                    ${priority}
                </span>
            </td>
            <td>
                <span class="${task.completed ? "status-completed" : "status-pending"}">
                    ${task.completed ? "Completed" : "Pending"}
                </span>
            </td>
            <td>
                <div class="table-actions">
                    <button
                        class="edit-button"
                        onclick="startEditTask('${task._id}')">
                        Edit
                    </button>
                    ${
                        task.completed
                            ? ""
                            : `
                                <button
                                    class="complete-button"
                                    onclick="completeTask('${task._id}')">
                                    Complete
                                </button>
                            `
                    }
                    <button
                        class="delete-button"
                        onclick="deleteTask('${task._id}')">
                        Delete
                    </button>
                </div>
            </td>
        `;
        taskList.appendChild(row);
    });
}





/*
// FILTER TASKS
function filterTasks(filter) {

    let tasksToDisplay;

    if (filter === "pending") {

        tasksToDisplay = currentTasks.filter(
            (task) => !task.completed
        );

    } else if (filter === "completed") {

        tasksToDisplay = currentTasks.filter(
            (task) => task.completed
        );

    } else {

        tasksToDisplay = currentTasks;
    }

    displayTasks(tasksToDisplay);

    // Update active button
    document.querySelectorAll(".filter-button").forEach(
        (button) => {
            button.classList.remove("active");
        }
    );

    document
        .querySelector(`[onclick="filterTasks('${filter}')"]`)
        .classList.add("active");
}
  
*/


function filterTasks(filter) {
    let tasksToDisplay;

    if (filter === "pending") {
        tasksToDisplay = currentTasks.filter(
            task => task.completed === false
        );
    } else if (filter === "completed") {
        tasksToDisplay = currentTasks.filter(
            task => task.completed === true
        );
    } else {
        tasksToDisplay = currentTasks;
    }

    // Render only the selected tasks
    displayTasks(tasksToDisplay);

    // Update active filter buttons
    document.querySelectorAll(".filter-button").forEach(button => {
        button.classList.remove("active");
    });

    const activeButton = document.querySelector(
        `.filter-button[onclick="filterTasks('${filter}')"]`
    );

    if (activeButton) {
        activeButton.classList.add("active");
    }

    // Update active summary card
    document.querySelectorAll(".summary-card").forEach(card => {
        card.classList.remove("active-card");
    });

    const cardSelectors = {
        all: ".total-card",
        pending: ".pending-card",
        completed: ".completed-card"
    };

    const activeCard = document.querySelector(cardSelectors[filter]);

    if (activeCard) {
        activeCard.classList.add("active-card");
    }
}






// ADD TASK
document.getElementById("taskForm").addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();

        const title = document.getElementById("title").value;
        const description =
            document.getElementById("description").value;
        const category =
            document.getElementById("category").value;
        const dueDate =
            document.getElementById("dueDate").value;
        const priority = 
            document.getElementById("priority").value; 

        try {

            const response = await fetch(
                `${API_BASE_URL}/api/tasks`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        title: title,
                        description: description,
                        category: category,
                        dueDate: dueDate || null,
                        priority: priority
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {

                document.getElementById("message").textContent =
                    data.message;

                return;
            }

            document.getElementById("message").textContent =
                "Task added successfully!";

            document.getElementById("taskForm").reset();

            loadTasks();

        } catch (error) {

            console.error(error);

            document.getElementById("message").textContent =
                "Unable to add task.";
        }
    }
);



// COMPLETE TASK
async function completeTask(taskId) {

    try {

        const response = await fetch(
            `${API_BASE_URL}/api/tasks/${taskId}/complete`,
            {
                method: "PATCH",

                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {
            alert(data.message);
            return;
        }

        alert("Task completed successfully!");

        loadTasks();

    } catch (error) {

        console.error(error);

        alert("Unable to complete task.");
    }
}




//delete task
async function deleteTask(taskId) {
    const confirmDelete = confirm(
        "Are you sure you want to delete this task?"
    );

    if (!confirmDelete) {
        return;
    }

    try {
        const response = await fetch(
            `${API_BASE_URL}/api/tasks/${taskId}`,
            {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {
            alert(data.message);
            return;
        }

        alert("Task deleted successfully!");

        loadTasks();

    } catch (error) {
        console.error(error);

        alert("Unable to delete task.");
    }
}

/*
// EDIT TASK
function startEditTask(taskId) {

    const task = currentTasks.find(
        (task) => task._id === taskId
    );

    if (!task) {
        alert("Task not found.");
        return;
    }

    document.getElementById("editTaskId").value = task._id;
    document.getElementById("editTitle").value = task.title;
    document.getElementById("editDescription").value =
        task.description || "";
    document.getElementById("editCategory").value =
        task.category || "";

    if (task.dueDate) {
        document.getElementById("editDueDate").value =
            new Date(task.dueDate)
                .toISOString()
                .split("T")[0];
    } else {
        document.getElementById("editDueDate").value = "";
    }

    document.getElementById("editTaskForm").style.display = "block";
}
*/





// EDIT TASK
function startEditTask(taskId) {

    const task = currentTasks.find(
        (task) => task._id === taskId
    );

    if (!task) {
        alert("Task not found.");
        return;
    }

    document.getElementById("editTaskId").value = task._id;
    document.getElementById("editTitle").value = task.title;
    document.getElementById("editDescription").value =
        task.description || "";
    document.getElementById("editCategory").value =
        task.category || "";
    document.getElementById("editPriority").value =
        task.priority || "Medium";

    if (task.dueDate) {
        document.getElementById("editDueDate").value =
            new Date(task.dueDate)
                .toISOString()
                .split("T")[0];
    } else {
        document.getElementById("editDueDate").value = "";
    }

    // Show the edit form
    const editForm = document.getElementById("editTaskForm");
    editForm.style.display = "block";

    // Smoothly scroll to the edit form
    editForm.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}





 // SAVE CHANGES
document.getElementById("saveChangesButton").addEventListener(
    "click",
    async function () {
        const taskId =
            document.getElementById("editTaskId").value;
        const title =
            document.getElementById("editTitle").value;
        const description =
            document.getElementById("editDescription").value;
        const category =
            document.getElementById("editCategory").value;
        const priority =
            document.getElementById("editPriority").value;
        const dueDate =
            document.getElementById("editDueDate").value;

        try {
            const response = await fetch(
                `${API_BASE_URL}/api/tasks/${taskId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        title,
                        description,
                        category,
                        dueDate: dueDate || null,
                        priority
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                document.getElementById("message").textContent =
                    data.message || "Unable to update task.";
                return;
            }

            // Update the task in the local array
            const index = currentTasks.findIndex(
                (task) => task._id === taskId
            );

            if (index !== -1) {
                currentTasks[index] = data.task;
            }

            // Refresh the table display
            displayTasks(currentTasks);

            // Close and reset the edit form
        //   document.getElementById("editTaskForm").reset();
            document.getElementById("editTaskForm").style.display = "none";

            // Show success message
            document.getElementById("message").textContent =
                "Task updated successfully!";

            // Return the user to the task table
            const taskTable =
                document.getElementById("myTasksSection");

            if (taskTable) {
                taskTable.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }

        } catch (error) {
            console.error("Update task error:", error);

            document.getElementById("message").textContent =
                "The task may have been saved, but the page encountered an error.";
        }
    }
);









// CANCEL EDIT
document.getElementById("cancelEdit").addEventListener(
    "click",
    function () {

        document.getElementById("editTaskForm").reset();

        document.getElementById("editTaskForm").style.display =
            "none";
    }
);



// Search when the button is clicked
document.getElementById("searchButton").addEventListener(
    "click",
    searchTasks
);

// Also search when Enter is pressed
document.getElementById("taskSearch").addEventListener(
    "keydown",
    function (event) {
        if (event.key === "Enter") {
            searchTasks();
        }
    }
);



