// ============================================
// AI STUDY PLANNER - POMODORO
// ============================================

const modes = {

    focus: {
        name: "DEEP FOCUS",
        minutes: 25
    },

    short: {
        name: "SHORT BREAK",
        minutes: 5
    },

    long: {
        name: "LONG BREAK",
        minutes: 15
    }

};


// ============================================
// ELEMENTS
// ============================================

const timerEl =
    document.getElementById("timer");

const timerStatus =
    document.getElementById("timerStatus");

const startBtn =
    document.getElementById("startBtn");

const resetBtn =
    document.getElementById("resetBtn");

const skipBtn =
    document.getElementById("skipBtn");

const subject =
    document.getElementById("subject");

const timerMode =
    document.getElementById("timerMode");

const sessionNumber =
    document.getElementById("sessionNumber");

const currentSubject =
    document.getElementById("currentSubject");

const subjectMinutes =
    document.getElementById("subjectMinutes");

const todayFocus =
    document.getElementById("todayFocus");

const streakValue =
    document.getElementById("streakValue");

const xpValue =
    document.getElementById("xpValue");

const goalMinutes =
    document.getElementById("goalMinutes");

const goalProgress =
    document.getElementById("goalProgress");

const progressText =
    document.getElementById("progressText");

const completedCount =
    document.getElementById("completedCount");

const quote =
    document.getElementById("quote");

const motivation =
    document.getElementById("motivation");

const motivationBtn =
    document.getElementById("motivationBtn");


// ============================================
// STATE
// ============================================

let currentMode = "focus";

let timeLeft =
    modes.focus.minutes * 60;

let timerInterval = null;

let running = false;


// ============================================
// STORAGE HELPERS
// ============================================

function getSessions() {

    return JSON.parse(
        localStorage.getItem("studySessions")
    ) || [];

}


function saveSessions(data) {

    localStorage.setItem(
        "studySessions",
        JSON.stringify(data)
    );

}


// ============================================
// TIME FORMAT
// ============================================

function formatTime(seconds) {

    const min =
        Math.floor(seconds / 60);

    const sec =
        seconds % 60;

    return (
        String(min).padStart(2, "0")
        +
        ":"
        +
        String(sec).padStart(2, "0")
    );

}


// ============================================
// UPDATE TIMER
// ============================================

function updateTimer() {

    timerEl.textContent =
        formatTime(timeLeft);


    const total =
        modes[currentMode].minutes * 60;


    const progress =
        ((total - timeLeft) / total) * 360;


    document.querySelector(
        ".timer-ring"
    ).style.background =
        `
        conic-gradient(
            var(--blue) ${progress}deg,
            #18304f ${progress}deg
        )
        `;

}


// ============================================
// START / PAUSE
// ============================================

startBtn.addEventListener(
    "click",
    () => {

        if (running) {

            pauseTimer();

        } else {

            startTimer();

        }

    }
);


function startTimer() {

    if (running) return;

    running = true;

    timerStatus.textContent =
        currentMode === "focus"
            ? "Lock in. No distractions."
            : "Relax. You've earned it.";

    updateStartButton();


    timerInterval =
        setInterval(
            () => {

                timeLeft--;

                updateTimer();


                if (timeLeft <= 0) {

                    finishTimer();

                }

            },
            1000
        );

}


function pauseTimer() {

    running = false;

    clearInterval(
        timerInterval
    );

    timerInterval = null;

    timerStatus.textContent =
        "Paused. Get back when ready.";

    updateStartButton();

}


function updateStartButton() {

    if (running) {

        startBtn.innerHTML =
            `
            <i class="fa-solid fa-pause"></i>
            Pause
            `;

    } else {

        startBtn.innerHTML =
            `
            <i class="fa-solid fa-play"></i>
            ${
                currentMode === "focus"
                    ? "Start Focus"
                    : "Start Break"
            }
            `;

    }

}


// ============================================
// RESET
// ============================================

resetBtn.addEventListener(
    "click",
    () => {

        clearInterval(
            timerInterval
        );

        timerInterval = null;

        running = false;

        timeLeft =
            modes[currentMode].minutes * 60;

        timerStatus.textContent =
            "Ready when you are.";

        updateStartButton();

        updateTimer();

    }
);


// ============================================
// MODE SELECTION
// ============================================

document
    .querySelectorAll(".mode")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                clearInterval(
                    timerInterval
                );

                timerInterval = null;

                running = false;


                currentMode =
                    button.dataset.mode;


                timeLeft =
                    modes[currentMode].minutes * 60;


                document
                    .querySelectorAll(".mode")
                    .forEach(btn =>
                        btn.classList.remove(
                            "active"
                        )
                    );


                button.classList.add(
                    "active"
                );


                timerMode.textContent =
                    modes[currentMode].name;


                timerStatus.textContent =
                    currentMode === "focus"
                        ? "Ready when you are."
                        : "Take a proper break.";


                updateStartButton();

                updateTimer();

            }
        );

    });


// ============================================
// SKIP
// ============================================

skipBtn.addEventListener(
    "click",
    () => {

        clearInterval(
            timerInterval
        );

        timerInterval = null;

        running = false;


        if (currentMode === "focus") {

            setMode("short");

        }

        else if (
            currentMode === "short"
        ) {

            setMode("focus");

        }

        else {

            setMode("focus");

        }

    }
);


function setMode(mode) {

    currentMode = mode;

    timeLeft =
        modes[mode].minutes * 60;


    document
        .querySelectorAll(".mode")
        .forEach(button => {

            button.classList.toggle(
                "active",
                button.dataset.mode === mode
            );

        });


    timerMode.textContent =
        modes[mode].name;


    timerStatus.textContent =
        mode === "focus"
            ? "Ready for another session."
            : "Time to recharge.";


    updateStartButton();

    updateTimer();

}


// ============================================
// COMPLETE TIMER
// ============================================

function finishTimer() {

    clearInterval(
        timerInterval
    );

    timerInterval = null;

    running = false;


    if (currentMode === "focus") {

        recordFocusSession();

        timerStatus.textContent =
            "🔥 Focus complete! Nice work.";

        quote.textContent =
            getRandomQuote();

    } else {

        timerStatus.textContent =
            "Break finished. Back to work.";

    }


    updateStartButton();

    updateStats();


    // automatically switch
    // focus → short break

    if (currentMode === "focus") {

        setTimeout(
            () => setMode("short"),
            1200
        );

    }

}


// ============================================
// RECORD FOCUS SESSION
// ============================================

function recordFocusSession() {

    const sessions =
        getSessions();


    const selectedSubject =
        subject.value;


    sessions.push({

        id: Date.now(),

        subject:
            selectedSubject,

        minutes: 25,

        date:
            new Date().toISOString(),

        type:
            "pomodoro"

    });


    saveSessions(
        sessions
    );


    // XP

    let xp =
        Number(
            localStorage.getItem(
                "studyXP"
            )
        ) || 0;


    xp += 25;


    localStorage.setItem(
        "studyXP",
        xp
    );


    updateStats();

}


// ============================================
// TODAY'S MINUTES
// ============================================

function getTodaySessions() {

    const sessions =
        getSessions();


    const today =
        new Date();


    return sessions.filter(
        session => {

            const date =
                new Date(
                    session.date
                );


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
    );

}


function getTodayMinutes() {

    return getTodaySessions()
        .reduce(
            (total, session) =>
                total +
                Number(
                    session.minutes || 0
                ),
            0
        );

}


// ============================================
// SUBJECT MINUTES
// ============================================

function getSubjectMinutes() {

    const selected =
        subject.value;


    return getTodaySessions()
        .filter(
            session =>
                session.subject === selected
        )
        .reduce(
            (total, session) =>
                total +
                Number(
                    session.minutes || 0
                ),
            0
        );

}


// ============================================
// STREAK
// ============================================

function getStreak() {

    const sessions =
        getSessions();


    const days =
        new Set();


    sessions.forEach(
        session => {

            const date =
                new Date(
                    session.date
                );


            days.add(
                `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
            );

        }
    );


    let streak = 0;

    const date =
        new Date();


    while (true) {

        const key =
            `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;


        if (!days.has(key)) {

            break;

        }


        streak++;


        date.setDate(
            date.getDate() - 1
        );

    }


    return streak;

}


// ============================================
// UPDATE STATS
// ============================================

function updateStats() {

    const minutes =
        getTodayMinutes();


    const subjectTime =
        getSubjectMinutes();


    const xp =
        Number(
            localStorage.getItem(
                "studyXP"
            )
        ) || 0;


    const streak =
        getStreak();


    todayFocus.textContent =
        `${minutes} min`;


    goalMinutes.textContent =
        minutes;


    subjectMinutes.textContent =
        subjectTime;


    currentSubject.textContent =
        subject.value;


    streakValue.textContent =
        `${streak} day${streak === 1 ? "" : "s"}`;


    xpValue.textContent =
        `${xp} XP`;


    const percentage =
        Math.min(
            (minutes / 120) * 100,
            100
        );


    goalProgress.style.width =
        `${percentage}%`;


    updateSessionCards();

}


// ============================================
// SESSION CARDS
// ============================================

function updateSessionCards() {

    const sessions =
        getTodaySessions()
        .filter(
            session =>
                session.type === "pomodoro"
        );


    const count =
        Math.min(
            sessions.length,
            3
        );


    completedCount.textContent =
        count;


    progressText.textContent =
        `${count} / 3 completed`;


    document
        .querySelectorAll(".session-item")
        .forEach(
            (card, index) => {

                card.classList.toggle(
                    "completed",
                    index < count
                );

            }
        );


    sessionNumber.textContent =
        `SESSION ${Math.min(count + 1, 3)} / 3`;

}


// ============================================
// SUBJECT CHANGE
// ============================================

subject.addEventListener(
    "change",
    () => {

        currentSubject.textContent =
            subject.value;

        updateStats();

    }
);


// ============================================
// FUNNY MOTIVATION
// ============================================

const funnyMessages = [

    "Bro... one session won't kill you. 😭",

    "Your future GPA is literally watching. 👀",

    "Lock in before YouTube wins again. 💀",

    "25 minutes. That's it. You got this. 🗿",

    "DBMS isn't going to pass itself. 😭",

    "Your assignment is still sitting there bro. 💀",

    "Imagine opening the textbook AND actually studying. 🤯",

    "No distractions. We are NOT touching Instagram. 🫡",

    "Future you will thank you for this session."

];


function getRandomMessage() {

    return funnyMessages[
        Math.floor(
            Math.random() *
            funnyMessages.length
        )
    ];

}


motivationBtn.addEventListener(
    "click",
    () => {

        motivation.textContent =
            getRandomMessage();

    }
);


// ============================================
// QUOTES
// ============================================

const quotes = [

    "25 minutes. No excuses.",

    "One session closer to being done.",

    "Lock in bro. 🗿",

    "Future you is going to appreciate this.",

    "Small sessions. Big results.",

    "You opened the planner. Now actually study. 💀"

];


function getRandomQuote() {

    return quotes[
        Math.floor(
            Math.random() *
            quotes.length
        )
    ];

}


// ============================================
// INITIAL LOAD
// ============================================

updateTimer();

updateStats();

updateStartButton();


// Keep analytics/dashboard
// synchronized if another page
// changes studySessions.

window.addEventListener(
    "storage",
    updateStats
);