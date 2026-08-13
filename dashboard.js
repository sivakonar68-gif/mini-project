// ============================================
// AI STUDY PLANNER — DASHBOARD JS
// Keeps the existing dashboard UI
// ============================================


// ============================================
// ELEMENTS
// ============================================

const greeting =
    document.getElementById("greeting");

const todayDate =
    document.getElementById("todayDate");

const focusMinutes =
    document.getElementById("focusMinutes");

const streak =
    document.getElementById("streak");

const xp =
    document.getElementById("xp");

const tasksDone =
    document.getElementById("tasksDone");

const goalPercent =
    document.getElementById("goalPercent");

const goalCurrent =
    document.getElementById("goalCurrent");

const goalBar =
    document.getElementById("goalBar");

const goalCircle =
    document.querySelector(".goal-circle");

const goalMessage =
    document.getElementById("goalMessage");

const taskList =
    document.getElementById("taskList");

const subjectList =
    document.getElementById("subjectList");

const productivityScore =
    document.getElementById("productivityScore");

const focusBar =
    document.getElementById("focusBar");

const taskBar =
    document.getElementById("taskBar");

const streakBar =
    document.getElementById("streakBar");

const focusBarText =
    document.getElementById("focusBarText");

const taskBarText =
    document.getElementById("taskBarText");

const streakBarText =
    document.getElementById("streakBarText");

const motivation =
    document.getElementById("motivation");

const newMotivation =
    document.getElementById("newMotivation");

const nextStep =
    document.getElementById("nextStep");

const nextButton =
    document.getElementById("nextButton");


// ============================================
// SAFE STORAGE
// ============================================

function readStorage(key, fallback = []) {

    try {

        const data =
            localStorage.getItem(key);

        if (!data) {
            return fallback;
        }

        return JSON.parse(data);

    } catch (error) {

        console.error(
            `Could not read ${key}:`,
            error
        );

        return fallback;
    }
}


// ============================================
// DATA SOURCES
// ============================================

// IMPORTANT:
// Planner uses this exact key.
function getTasks() {

    return readStorage(
        "aiStudyPlannerTasks",
        []
    );
}


// Pomodoro / study sessions
function getSessions() {

    return readStorage(
        "studySessions",
        []
    );
}


// User information
function getUser() {

    return readStorage(
        "studyPlannerUser",
        {}
    );
}


// ============================================
// DATE HELPERS
// ============================================

function isToday(dateValue) {

    if (!dateValue) {
        return false;
    }

    const date =
        new Date(dateValue);

    if (isNaN(date.getTime())) {
        return false;
    }

    const today =
        new Date();

    return (
        date.getFullYear() ===
            today.getFullYear()
        &&
        date.getMonth() ===
            today.getMonth()
        &&
        date.getDate() ===
            today.getDate()
    );
}


// ============================================
// GREETING
// ============================================

function updateGreeting() {

    if (!greeting) return;

    const hour =
        new Date().getHours();

    let text;

    if (hour < 12) {

        text = "Good morning";

    } else if (hour < 17) {

        text = "Good afternoon";

    } else {

        text = "Good evening";
    }

    greeting.textContent =
        `${text} 👋`;
}


// ============================================
// DATE + LIVE CLOCK
// ============================================

function updateDate() {

    if (!todayDate) return;

    const now =
        new Date();

    const date =
        now.toLocaleDateString(
            "en-IN",
            {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );

    const time =
        now.toLocaleTimeString(
            "en-IN",
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );

    todayDate.textContent =
        `${date} • ${time}`;
}


// ============================================
// TODAY'S STUDY SESSIONS
// ============================================

function getTodaySessions() {

    return getSessions().filter(
        session =>
            isToday(
                session.date ||
                session.timestamp ||
                session.createdAt
            )
    );
}


// ============================================
// TODAY'S MINUTES
// ============================================

function getTodayMinutes() {

    return getTodaySessions()
        .reduce(
            (total, session) => {

                const minutes =
                    Number(
                        session.minutes ||
                        session.duration ||
                        0
                    );

                return total + minutes;

            },
            0
        );
}


// ============================================
// STREAK
// ============================================

function getStreak() {

    const sessions =
        getSessions();

    if (!sessions.length) {
        return 0;
    }

    const activeDays =
        new Set();

    sessions.forEach(session => {

        const rawDate =
            session.date ||
            session.timestamp ||
            session.createdAt;

        if (!rawDate) return;

        const date =
            new Date(rawDate);

        if (isNaN(date.getTime())) {
            return;
        }

        activeDays.add(
            `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
        );

    });


    let count = 0;

    const checkDate =
        new Date();


    while (true) {

        const key =
            `${checkDate.getFullYear()}-${checkDate.getMonth()}-${checkDate.getDate()}`;

        if (!activeDays.has(key)) {
            break;
        }

        count++;

        checkDate.setDate(
            checkDate.getDate() - 1
        );
    }

    return count;
}


// ============================================
// XP
// ============================================

function getXP() {

    const storedXP =
        Number(
            localStorage.getItem(
                "studyXP"
            )
        );

    if (!isNaN(storedXP)) {
        return storedXP;
    }

    // If XP hasn't been created yet,
    // calculate a simple value from study time.
    return getTodayMinutes();
}


// ============================================
// TASKS
// ============================================

function updateTasks() {

    if (!taskList) return;

    const tasks =
        getTasks();


    // Only today's tasks
    const todayTasks =
        tasks.filter(task => {

            // Planner task has a date
            if (task.date) {
                return isToday(task.date);
            }

            // If no date exists,
            // don't randomly show it as today's task.
            return false;
        });


    const completed =
        tasks.filter(
            task =>
                task.completed === true
        ).length;


    if (tasksDone) {

        tasksDone.textContent =
            completed;
    }


    if (!todayTasks.length) {

        taskList.innerHTML = `

            <div class="empty-state">

                <i class="fa-solid fa-check-double"></i>

                <strong>
                    No tasks for today
                </strong>

                <span>
                    Add a task in your Planner.
                </span>

            </div>

        `;

        return;
    }


    taskList.innerHTML =
        todayTasks
            .slice(0, 5)
            .map(task => {

                const title =
                    task.title ||
                    task.topic ||
                    "Study task";


                const subject =
                    task.subject ||
                    "";


                return `

                    <div class="dashboard-task
                        ${task.completed ? "completed" : ""}">

                        <div class="task-check">

                            ${
                                task.completed
                                    ? "✓"
                                    : "•"
                            }

                        </div>

                        <div class="task-content">

                            <strong>
                                ${escapeHTML(title)}
                            </strong>

                            ${
                                subject
                                    ? `
                                        <span>
                                            ${escapeHTML(subject)}
                                        </span>
                                      `
                                    : ""
                            }

                        </div>

                    </div>

                `;

            })
            .join("");
}


// ============================================
// SUBJECT BREAKDOWN
// ============================================

function updateSubjects() {

    if (!subjectList) return;


    const subjectTotals = {};


    // Subjects come ONLY from actual
    // recorded study sessions.
    const sessions =
        getTodaySessions();


    sessions.forEach(session => {

        if (!session.subject) {
            return;
        }


        const subject =
            String(
                session.subject
            ).trim();


        if (!subject) {
            return;
        }


        const minutes =
            Number(
                session.minutes ||
                session.duration ||
                0
            );


        subjectTotals[subject] =
            (
                subjectTotals[subject] ||
                0
            ) + minutes;

    });


    const entries =
        Object.entries(
            subjectTotals
        )
        .sort(
            (a, b) =>
                b[1] - a[1]
        )
        .slice(0, 5);


    // Nothing has actually been studied yet.
    if (!entries.length) {

        subjectList.innerHTML = `

            <div class="subject-row">

                <div class="subject-dot blue"></div>

                <span>
                    No study subject yet
                </span>

            </div>

        `;

        return;
    }


    const dots = [
        "blue",
        "purple",
        "green",
        "orange"
    ];


    subjectList.innerHTML =
        entries
            .map(
                ([subject, minutes], index) => `

                    <div class="subject-row">

                        <div class="subject-dot
                            ${dots[index % dots.length]}">
                        </div>

                        <span>
                            ${escapeHTML(subject)}
                        </span>

                        <span class="subject-time">
                            ${minutes} min
                        </span>

                    </div>

                `
            )
            .join("");
}


// ============================================
// DAILY GOAL
// ============================================

function updateGoal() {

    if (!goalPercent) return;


    const minutes =
        getTodayMinutes();


    const goal =
        120;


    const percent =
        Math.min(
            Math.round(
                (minutes / goal) * 100
            ),
            100
        );


    goalPercent.textContent =
        `${percent}%`;


    if (goalCurrent) {

        goalCurrent.textContent =
            minutes;
    }


    if (goalBar) {

        goalBar.style.width =
            `${percent}%`;
    }


    if (goalCircle) {

        const degrees =
            percent * 3.6;

        goalCircle.style.background =
            `
            conic-gradient(
                var(--blue) ${degrees}deg,
                #172b48 ${degrees}deg
            )
            `;
    }


    if (!goalMessage) return;


    if (minutes === 0) {

        goalMessage.textContent =
            "Let's get started. 🗿";

    } else if (minutes < 30) {

        goalMessage.textContent =
            "Warm-up complete. Keep going.";

    } else if (minutes < 60) {

        goalMessage.textContent =
            "Okayyy, you're cooking. 🔥";

    } else if (minutes < 120) {

        goalMessage.textContent =
            "You're seriously locked in.";

    } else {

        goalMessage.textContent =
            "GOAL DESTROYED. 🗿🔥";
    }
}


// ============================================
// PRODUCTIVITY
// ============================================

function updateProductivity() {

    if (!productivityScore) return;


    const minutes =
        getTodayMinutes();


    const tasks =
        getTasks();


    const completedTasks =
        tasks.filter(
            task =>
                task.completed === true
        ).length;


    const totalTasks =
        tasks.length;


    const currentStreak =
        getStreak();


    const focusScore =
        Math.min(
            (minutes / 120) * 100,
            100
        );


    const taskScore =
        totalTasks
            ? Math.min(
                (completedTasks /
                    totalTasks) * 100,
                100
            )
            : 0;


    const streakScore =
        Math.min(
            (currentStreak / 7) * 100,
            100
        );


    const score =
        Math.round(
            (
                focusScore +
                taskScore +
                streakScore
            ) / 3
        );


    productivityScore.textContent =
        `${score}%`;


    setBar(
        focusBar,
        focusBarText,
        focusScore
    );


    setBar(
        taskBar,
        taskBarText,
        taskScore
    );


    setBar(
        streakBar,
        streakBarText,
        streakScore
    );
}


function setBar(
    bar,
    text,
    value
) {

    if (!bar) return;


    const rounded =
        Math.round(value);


    bar.style.width =
        `${rounded}%`;


    if (text) {

        text.textContent =
            `${rounded}%`;
    }
}


// ============================================
// MOTIVATION
// ============================================

const messages = [

    "Bro... you opened the dashboard. Might as well study now. 😭",

    "Your future GPA just entered the room. 👀",

    "One Pomodoro. That's literally it. 🗿",

    "Imagine studying before the deadline for once. 💀",

    "Lock in before Instagram wins again.",

    "DBMS isn't going to pass itself bro.",

    "Future you is going to be VERY happy about this.",

    "You already opened the planner. Don't fumble now. 😭",

    "Small progress is still progress.",

    "Okay scholar, let's cook. 🔥"

];


if (newMotivation && motivation) {

    newMotivation.addEventListener(
        "click",
        () => {

            let message;

            do {

                message =
                    messages[
                        Math.floor(
                            Math.random() *
                            messages.length
                        )
                    ];

            } while (
                message ===
                motivation.textContent
            );


            motivation.textContent =
                message;
        }
    );
}


// ============================================
// QUICK ACTIONS
// ============================================

document
    .querySelectorAll(".action-card")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const action =
                    button.dataset.action;


                const pages = {

                    pomodoro:
                        "pomodoro.html",

                    planner:
                        "planner.html",

                    calendar:
                        "calendar.html",

                    tutor:
                        "ai-tutor.html"

                };


                if (pages[action]) {

                    window.location.href =
                        pages[action];
                }
            }
        );
    });


// ============================================
// PLANNER BUTTON
// ============================================

const plannerLink =
    document.getElementById(
        "plannerLink"
    );


if (plannerLink) {

    plannerLink.addEventListener(
        "click",
        () => {

            window.location.href =
                "planner.html";
        }
    );
}


// ============================================
// NEXT BUTTON
// ============================================

if (nextButton) {

    nextButton.addEventListener(
        "click",
        () => {

            const minutes =
                getTodayMinutes();


            if (minutes < 120) {

                window.location.href =
                    "pomodoro.html";

            } else {

                window.location.href =
                    "analytics.html";
            }
        }
    );
}


// ============================================
// NEXT STEP
// ============================================

function updateNextStep() {

    if (!nextStep) return;


    const minutes =
        getTodayMinutes();


    const tasks =
        getTasks();


    const incomplete =
        tasks.filter(
            task =>
                !task.completed
        );


    if (minutes === 0) {

        nextStep.textContent =
            "Start your first Pomodoro.";

    } else if (incomplete.length) {

        nextStep.textContent =
            `You have ${incomplete.length} task${
                incomplete.length === 1
                    ? ""
                    : "s"
            } waiting.`;

    } else if (minutes < 120) {

        nextStep.textContent =
            "One more focus session.";

    } else {

        nextStep.textContent =
            "Check your analytics.";
    }
}


// ============================================
// HTML SAFETY
// ============================================

function escapeHTML(value) {

    return String(value)
        .replace(
            /[&<>"']/g,
            character => ({

                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#039;"

            })[character]
        );
}


// ============================================
// REFRESH DASHBOARD
// ============================================

function refreshDashboard() {

    updateGreeting();

    updateDate();

    updateTasks();

    updateSubjects();

    updateGoal();

    updateProductivity();

    updateNextStep();
}


// ============================================
// LIVE CLOCK
// ============================================

setInterval(
    updateDate,
    1000
);


// ============================================
// LIVE DATA REFRESH
// ============================================

setInterval(
    () => {

        updateTasks();

        updateSubjects();

        updateGoal();

        updateProductivity();

        updateNextStep();

    },
    2000
);


// ============================================
// STORAGE CHANGES
// ============================================

window.addEventListener(
    "storage",
    refreshDashboard
);


// ============================================
// INITIAL LOAD
// ============================================

refreshDashboard();