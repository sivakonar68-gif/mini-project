/* =====================================================
   AI STUDY PLANNER
   Real-time + LocalStorage + Interactive Tasks
===================================================== */


/* ================= STORAGE ================= */

const STORAGE_KEY = "aiStudyPlannerTasks";

let tasks =
    JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

let editingId = null;


/* ================= ELEMENTS ================= */

const taskForm = document.getElementById("taskForm");

const subject = document.getElementById("subject");
const topic = document.getElementById("topic");
const taskDate = document.getElementById("taskDate");
const taskTime = document.getElementById("taskTime");
const duration = document.getElementById("duration");
const priority = document.getElementById("priority");
const notes = document.getElementById("notes");

const taskList = document.getElementById("taskList");
const emptyState = document.getElementById("emptyState");

const searchTask = document.getElementById("searchTask");
const filterSubject = document.getElementById("filterSubject");
const filterStatus = document.getElementById("filterStatus");

const editModal = document.getElementById("editModal");
const editForm = document.getElementById("editForm");


/* ================= DATE ================= */

function getToday() {

    const now = new Date();

    const year = now.getFullYear();

    const month =
        String(now.getMonth() + 1).padStart(2, "0");

    const day =
        String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


taskDate.value = getToday();


/* ================= LIVE DATE ================= */

function updateDate() {

    const now = new Date();

    const options = {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    };

    document.getElementById("currentDate").textContent =
        now.toLocaleDateString("en-IN", options);
}

updateDate();


/* ================= LIVE CLOCK ================= */

function updateClock() {

    const now = new Date();

    let hours = now.getHours();

    const minutes =
        String(now.getMinutes()).padStart(2, "0");

    const seconds =
        String(now.getSeconds()).padStart(2, "0");

    const period = hours >= 12 ? "PM" : "AM";

    hours = hours % 12 || 12;

    document.getElementById("liveClock").textContent =
        `${String(hours).padStart(2, "0")}:${minutes}:${seconds} ${period}`;
}

updateClock();

setInterval(updateClock, 1000);


/* ================= SAVE ================= */

function saveTasks() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(tasks)
    );
}


/* ================= ADD TASK ================= */

taskForm.addEventListener("submit", function(e) {

    e.preventDefault();

    const newTask = {

        id: Date.now(),

        subject: subject.value,

        topic: topic.value.trim(),

        date: taskDate.value,

        time: taskTime.value,

        duration: Number(duration.value),

        priority: priority.value,

        notes: notes.value.trim(),

        completed: false,

        createdAt: new Date().toISOString()

    };


    tasks.push(newTask);

    saveTasks();

    taskForm.reset();

    taskDate.value = getToday();

    renderTasks();

    updateDashboardStats();

});


/* ================= RENDER ================= */

function renderTasks() {

    const search =
        searchTask.value.toLowerCase().trim();

    const selectedSubject =
        filterSubject.value;

    const selectedStatus =
        filterStatus.value;


    let filteredTasks = tasks.filter(task => {

        const matchesSearch =
            task.topic.toLowerCase().includes(search) ||
            task.subject.toLowerCase().includes(search);


        const matchesSubject =
            selectedSubject === "all" ||
            task.subject === selectedSubject;


        const matchesStatus =
            selectedStatus === "all" ||

            (selectedStatus === "completed" &&
             task.completed) ||

            (selectedStatus === "pending" &&
             !task.completed);


        return (
            matchesSearch &&
            matchesSubject &&
            matchesStatus
        );

    });


    /* Sort by date + time */

    filteredTasks.sort((a, b) => {

        const dateA =
            new Date(`${a.date}T${a.time}`);

        const dateB =
            new Date(`${b.date}T${b.time}`);

        return dateA - dateB;

    });


    taskList.innerHTML = "";


    if (filteredTasks.length === 0) {

        emptyState.style.display = "block";

    } else {

        emptyState.style.display = "none";

    }


    filteredTasks.forEach(task => {

        const taskElement =
            createTaskElement(task);

        taskList.appendChild(taskElement);

    });


    updateDashboardStats();
}


/* ================= TASK ELEMENT ================= */

function createTaskElement(task) {

    const article =
        document.createElement("article");

    article.className =
        `task ${task.completed ? "completed" : ""}`;


    const dateObject =
        new Date(`${task.date}T${task.time}`);


    const formattedDate =
        dateObject.toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "short"
            }
        );


    let durationText;

    if (task.duration >= 60) {

        const hours =
            Math.floor(task.duration / 60);

        const minutes =
            task.duration % 60;

        durationText =
            `${hours}h${minutes ? ` ${minutes}m` : ""}`;

    } else {

        durationText =
            `${task.duration} min`;

    }


    article.innerHTML = `

        <input
            type="checkbox"
            class="task-check"
            ${task.completed ? "checked" : ""}
            aria-label="Complete task"
        >


        <div class="task-main">

            <h3>${escapeHTML(task.topic)}</h3>

            <div class="task-meta">

                <span>
                    <i class="fa-solid fa-book"></i>
                    ${escapeHTML(task.subject)}
                </span>

                <span>
                    <i class="fa-regular fa-calendar"></i>
                    ${formattedDate}
                </span>

                <span>
                    <i class="fa-regular fa-clock"></i>
                    ${formatTime(task.time)}
                </span>

                <span>
                    <i class="fa-solid fa-hourglass-half"></i>
                    ${durationText}
                </span>

                <span class="badge ${task.priority.toLowerCase()}">
                    ${task.priority}
                </span>

            </div>

            ${
                task.notes
                ?
                `<p style="
                    margin-top:10px;
                    color:#8495ad;
                    font-size:12px;
                ">
                    ${escapeHTML(task.notes)}
                </p>`
                :
                ""
            }

        </div>


        <div class="task-actions">

            <button
                class="edit"
                title="Edit task"
            >
                <i class="fa-solid fa-pen"></i>
            </button>

            <button
                class="delete"
                title="Delete task"
            >
                <i class="fa-solid fa-trash"></i>
            </button>

        </div>

    `;


    /* Complete */

    article
        .querySelector(".task-check")
        .addEventListener("change", () => {

            toggleTask(task.id);

        });


    /* Edit */

    article
        .querySelector(".edit")
        .addEventListener("click", () => {

            openEditModal(task.id);

        });


    /* Delete */

    article
        .querySelector(".delete")
        .addEventListener("click", () => {

            deleteTask(task.id);

        });


    return article;
}


/* ================= COMPLETE ================= */

function toggleTask(id) {

    const task =
        tasks.find(t => t.id === id);

    if (!task) return;

    task.completed =
        !task.completed;


    if (task.completed) {

        recordStudySession(task);

    }


    saveTasks();

    renderTasks();

}


/* ================= STUDY SESSION ================= */

function recordStudySession(task) {

    const sessions =
        JSON.parse(
            localStorage.getItem("studySessions")
        ) || [];


    sessions.push({

        subject: task.subject,

        topic: task.topic,

        minutes: task.duration,

        date: new Date().toISOString()

    });


    localStorage.setItem(
        "studySessions",
        JSON.stringify(sessions)
    );
}


/* ================= DELETE ================= */

function deleteTask(id) {

    const confirmed =
        confirm("Delete this study task?");

    if (!confirmed) return;


    tasks =
        tasks.filter(task => task.id !== id);


    saveTasks();

    renderTasks();

}


/* ================= EDIT ================= */

function openEditModal(id) {

    const task =
        tasks.find(t => t.id === id);

    if (!task) return;


    editingId = id;


    document.getElementById("editSubject").value =
        task.subject;

    document.getElementById("editTopic").value =
        task.topic;

    document.getElementById("editDate").value =
        task.date;

    document.getElementById("editTime").value =
        task.time;

    document.getElementById("editDuration").value =
        task.duration;

    document.getElementById("editPriority").value =
        task.priority;

    document.getElementById("editNotes").value =
        task.notes;


    editModal.classList.add("show");
}


/* ================= SAVE EDIT ================= */

editForm.addEventListener("submit", function(e) {

    e.preventDefault();


    const task =
        tasks.find(t => t.id === editingId);

    if (!task) return;


    task.subject =
        document.getElementById("editSubject").value;

    task.topic =
        document.getElementById("editTopic").value.trim();

    task.date =
        document.getElementById("editDate").value;

    task.time =
        document.getElementById("editTime").value;

    task.duration =
        Number(
            document.getElementById("editDuration").value
        );

    task.priority =
        document.getElementById("editPriority").value;

    task.notes =
        document.getElementById("editNotes").value.trim();


    saveTasks();

    editModal.classList.remove("show");

    renderTasks();

});


/* ================= CLOSE MODAL ================= */

document
    .getElementById("closeModal")
    .addEventListener("click", () => {

        editModal.classList.remove("show");

    });


editModal.addEventListener("click", function(e) {

    if (e.target === editModal) {

        editModal.classList.remove("show");

    }

});


/* ================= FILTERS ================= */

searchTask.addEventListener(
    "input",
    renderTasks
);

filterSubject.addEventListener(
    "change",
    renderTasks
);

filterStatus.addEventListener(
    "change",
    renderTasks
);


/* ================= STATS ================= */

function updateDashboardStats() {

    const total =
        tasks.length;

    const completed =
        tasks.filter(
            task => task.completed
        ).length;


    const totalMinutes =
        tasks
            .filter(task => task.completed)
            .reduce(
                (sum, task) =>
                    sum + Number(task.duration),
                0
            );


    const percentage =
        total === 0
        ? 0
        : Math.round(
            (completed / total) * 100
        );


    document.getElementById("totalTasks")
        .textContent = total;


    document.getElementById("completedTasks")
        .textContent = completed;


    document.getElementById("progressPercent")
        .textContent = `${percentage}%`;


    document.getElementById("progressNumber")
        .textContent = `${percentage}%`;


    document.getElementById("progressText")
        .textContent =
        `${completed} of ${total} tasks completed`;


    document.getElementById("progressBar")
        .style.width = `${percentage}%`;


    const hours =
        Math.floor(totalMinutes / 60);

    const minutes =
        totalMinutes % 60;


    document.getElementById("studyTime")
        .textContent =
        `${hours}h ${minutes}m`;
}


/* ================= GENERATE PLAN ================= */

document
    .getElementById("generateBtn")
    .addEventListener("click", generatePlan);


function generatePlan() {

    const today =
        new Date();


    const subjects = [

        {
            name: "Database Management System",
            topics: [
                "SQL Practice",
                "Normalization",
                "Transactions"
            ]
        },

        {
            name: "Java",
            topics: [
                "OOP Concepts",
                "Collections Framework",
                "Exception Handling"
            ]
        },

        {
            name: "Python",
            topics: [
                "Functions",
                "File Handling",
                "Modules"
            ]
        },

        {
            name: "Operating System",
            topics: [
                "Process Management",
                "Memory Management",
                "Scheduling"
            ]
        }

    ];


    let added = 0;


    subjects.forEach((subjectData, index) => {

        const date =
            new Date(today);

        date.setDate(
            today.getDate() + index
        );


        const year =
            date.getFullYear();

        const month =
            String(
                date.getMonth() + 1
            ).padStart(2, "0");

        const day =
            String(
                date.getDate()
            ).padStart(2, "0");


        const randomHour =
            9 + index * 2;


        const time =
            `${String(randomHour).padStart(2, "0")}:00`;


        tasks.push({

            id: Date.now() + added,

            subject: subjectData.name,

            topic:
                subjectData.topics[
                    index %
                    subjectData.topics.length
                ],

            date:
                `${year}-${month}-${day}`,

            time,

            duration: 45,

            priority:
                index === 0
                ? "High"
                : "Medium",

            notes:
                "Generated study session",

            completed: false,

            createdAt:
                new Date().toISOString()

        });


        added++;

    });


    saveTasks();

    renderTasks();


    alert(
        `Study plan generated successfully!\n\n${added} study sessions added.`
    );
}


/* ================= TIME FORMAT ================= */

function formatTime(time) {

    if (!time) return "";

    const [hour, minute] =
        time.split(":");

    let h = Number(hour);

    const period =
        h >= 12 ? "PM" : "AM";

    h =
        h % 12 || 12;


    return `${h}:${minute} ${period}`;
}


/* ================= SECURITY ================= */

function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


/* ================= INITIAL LOAD ================= */

renderTasks();

updateDashboardStats();


/* Refresh UI every minute */

setInterval(() => {

    updateDate();

    renderTasks();

}, 60000);