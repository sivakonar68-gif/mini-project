/* =====================================================
   AI STUDY PLANNER - REAL TIME ANALYTICS
===================================================== */

const TASK_KEY = "aiStudyPlannerTasks";
const SESSION_KEY = "studySessions";

let weeklyChart = null;
let subjectChart = null;


/* =====================================================
   DATA
===================================================== */

function getTasks() {

    return JSON.parse(
        localStorage.getItem(TASK_KEY)
    ) || [];

}


function getSessions() {

    return JSON.parse(
        localStorage.getItem(SESSION_KEY)
    ) || [];

}


/* =====================================================
   DATE HELPERS
===================================================== */

function dateKey(date) {

    const d = new Date(date);

    const year = d.getFullYear();

    const month =
        String(d.getMonth() + 1).padStart(2, "0");

    const day =
        String(d.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;

}


function todayKey() {

    return dateKey(new Date());

}


function isToday(date) {

    return dateKey(date) === todayKey();

}


function isWithinLast7Days(date) {

    const now = new Date();

    const target = new Date(date);

    const difference =
        now - target;

    return (
        difference >= 0 &&
        difference <=
        7 * 24 * 60 * 60 * 1000
    );

}


/* =====================================================
   NORMALIZE SESSION DATE
===================================================== */

function sessionDate(session) {

    return (
        session.date ||
        session.createdAt ||
        new Date().toISOString()
    );

}


/* =====================================================
   TOTAL STUDY TIME
===================================================== */

function getTotalMinutes() {

    const sessions =
        getSessions();

    return sessions.reduce(
        (total, session) => {

            return total +
                Number(session.minutes || 0);

        },
        0
    );

}


function getTodayMinutes() {

    const sessions =
        getSessions();

    return sessions.reduce(
        (total, session) => {

            if (
                isToday(
                    sessionDate(session)
                )
            ) {

                return total +
                    Number(session.minutes || 0);

            }

            return total;

        },
        0
    );

}


function getWeeklyMinutes() {

    const sessions =
        getSessions();

    return sessions.reduce(
        (total, session) => {

            if (
                isWithinLast7Days(
                    sessionDate(session)
                )
            ) {

                return total +
                    Number(session.minutes || 0);

            }

            return total;

        },
        0
    );

}


/* =====================================================
   FORMAT TIME
===================================================== */

function formatMinutes(minutes) {

    minutes = Math.round(minutes);

    const hours =
        Math.floor(minutes / 60);

    const mins =
        minutes % 60;

    if (hours === 0) {

        return `${mins}m`;

    }

    return `${hours}h ${mins}m`;

}


/* =====================================================
   STREAK
===================================================== */

function calculateStreak() {

    const sessions =
        getSessions();

    const studiedDays =
        new Set();


    sessions.forEach(session => {

        studiedDays.add(
            dateKey(
                sessionDate(session)
            )
        );

    });


    let streak = 0;

    const current =
        new Date();


    /*
       Count backwards from today.
    */

    while (true) {

        const key =
            dateKey(current);

        if (
            studiedDays.has(key)
        ) {

            streak++;

            current.setDate(
                current.getDate() - 1
            );

        } else {

            break;

        }

    }


    return streak;

}


/* =====================================================
   PRODUCTIVITY
===================================================== */

function calculateProductivity() {

    const tasks =
        getTasks();

    if (tasks.length === 0) {

        return 0;

    }


    const today =
        todayKey();


    const todayTasks =
        tasks.filter(
            task => task.date === today
        );


    if (todayTasks.length === 0) {

        return 0;

    }


    const completed =
        todayTasks.filter(
            task => task.completed
        ).length;


    return Math.round(
        (completed /
            todayTasks.length) * 100
    );

}


/* =====================================================
   WEEKLY CHART DATA
===================================================== */

function getWeeklyData() {

    const sessions =
        getSessions();

    const labels = [];

    const values = [];


    for (let i = 6; i >= 0; i--) {

        const date =
            new Date();

        date.setHours(0, 0, 0, 0);

        date.setDate(
            date.getDate() - i
        );


        const key =
            dateKey(date);


        const label =
            date.toLocaleDateString(
                "en-IN",
                {
                    weekday: "short"
                }
            );


        labels.push(label);


        const minutes =
            sessions.reduce(
                (total, session) => {

                    if (
                        dateKey(
                            sessionDate(session)
                        ) === key
                    ) {

                        return total +
                            Number(
                                session.minutes || 0
                            );

                    }

                    return total;

                },
                0
            );


        values.push(
            Number(
                (minutes / 60).toFixed(2)
            )
        );

    }


    return {
        labels,
        values
    };

}


/* =====================================================
   SUBJECT DATA
===================================================== */

function getSubjectData() {

    const sessions =
        getSessions();

    const subjects = {};


    sessions.forEach(session => {

        const subject =
            session.subject ||
            "Other";


        if (!subjects[subject]) {

            subjects[subject] = {
                minutes: 0,
                sessions: 0
            };

        }


        subjects[subject].minutes +=
            Number(
                session.minutes || 0
            );


        subjects[subject].sessions++;

    });


    return subjects;

}


/* =====================================================
   UPDATE STAT CARDS
===================================================== */

function updateStats() {

    const totalMinutes =
        getTotalMinutes();

    const todayMinutes =
        getTodayMinutes();

    const streak =
        calculateStreak();

    const productivity =
        calculateProductivity();


    document.getElementById(
        "totalStudy"
    ).textContent =
        formatMinutes(totalMinutes);


    document.getElementById(
        "todayStudy"
    ).textContent =
        formatMinutes(todayMinutes);


    document.getElementById(
        "studyStreak"
    ).textContent =
        `${streak} Day${streak === 1 ? "" : "s"}`;


    document.getElementById(
        "productivityScore"
    ).textContent =
        `${productivity}%`;


    document.getElementById(
        "weeklyStudy"
    ).textContent =
        formatMinutes(
            getWeeklyMinutes()
        );


    document.getElementById(
        "completedSessions"
    ).textContent =
        getSessions().length;

}


/* =====================================================
   WEEKLY CHART
===================================================== */

function updateWeeklyChart() {

    const data =
        getWeeklyData();


    const canvas =
        document.getElementById(
            "weeklyStudyChart"
        );


    if (!canvas) return;


    if (weeklyChart) {

        weeklyChart.destroy();

    }


    weeklyChart =
        new Chart(canvas, {

            type: "bar",

            data: {

                labels: data.labels,

                datasets: [{

                    label: "Study Hours",

                    data: data.values,

                    borderRadius: 8,

                    backgroundColor:
                        "rgba(59,130,246,.75)",

                    borderColor:
                        "#60a5fa",

                    borderWidth: 1

                }]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                plugins: {

                    legend: {
                        display: false
                    }

                },

                scales: {

                    y: {

                        beginAtZero: true,

                        ticks: {
                            color: "#91a1b8"
                        },

                        grid: {
                            color:
                                "rgba(145,161,184,.08)"
                        }

                    },

                    x: {

                        ticks: {
                            color: "#91a1b8"
                        },

                        grid: {
                            display: false
                        }

                    }

                }

            }

        });

}


/* =====================================================
   SUBJECT CHART
===================================================== */

function updateSubjectChart() {

    const subjects =
        getSubjectData();


    const labels =
        Object.keys(subjects);


    const values =
        labels.map(
            subject =>
                Number(
                    (
                        subjects[subject]
                            .minutes / 60
                    ).toFixed(2)
                )
        );


    const canvas =
        document.getElementById(
            "subjectStudyChart"
        );


    if (!canvas) return;


    if (subjectChart) {

        subjectChart.destroy();

    }


    if (labels.length === 0) {

        subjectChart =
            new Chart(canvas, {

                type: "doughnut",

                data: {

                    labels: ["No study data"],

                    datasets: [{

                        data: [1],

                        backgroundColor: [
                            "#24344d"
                        ],

                        borderWidth: 0

                    }]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    plugins: {

                        legend: {

                            position: "bottom",

                            labels: {
                                color: "#91a1b8"
                            }

                        }

                    }

                }

            });

        return;

    }


    const chartColors = [

        "#3b82f6",
        "#22d3ee",
        "#a78bfa",
        "#22c55e",
        "#f59e0b",
        "#ef4444",
        "#64748b"

    ];


    subjectChart =
        new Chart(canvas, {

            type: "doughnut",

            data: {

                labels,

                datasets: [{

                    data: values,

                    backgroundColor:
                        chartColors.slice(
                            0,
                            labels.length
                        ),

                    borderColor: "#101a2b",

                    borderWidth: 3

                }]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                cutout: "68%",

                plugins: {

                    legend: {

                        position: "bottom",

                        labels: {
                            color: "#b5c2d3",
                            padding: 15
                        }

                    }

                }

            }

        });

}


/* =====================================================
   SUBJECT TABLE
===================================================== */

function updateSubjectTable() {

    const subjects =
        getSubjectData();


    const tbody =
        document.getElementById(
            "subjectTableBody"
        );


    tbody.innerHTML = "";


    const defaultSubjects = [

        "DBMS",
        "Java",
        "Python",
        "Operating System",
        "Computer Networks"

    ];


    const allSubjects =
        new Set([
            ...defaultSubjects,
            ...Object.keys(subjects)
        ]);


    allSubjects.forEach(subject => {

        const data =
            subjects[subject] || {
                minutes: 0,
                sessions: 0
            };


        const hours =
            (
                data.minutes / 60
            ).toFixed(1);


        let status = "No Data";
        let statusClass = "neutral";


        if (data.minutes >= 180) {

            status = "Excellent";
            statusClass = "excellent";

        } else if (data.minutes >= 60) {

            status = "Good";
            statusClass = "good";

        } else if (data.minutes > 0) {

            status = "Started";
            statusClass = "started";

        }


        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                <div class="subject-name">
                    <span class="subject-dot"></span>
                    ${escapeHTML(subject)}
                </div>
            </td>

            <td>
                ${hours} hrs
            </td>

            <td>
                ${data.sessions}
            </td>

            <td>
                <span class="status-badge ${statusClass}">
                    ${status}
                </span>
            </td>

        `;


        tbody.appendChild(row);

    });

}


/* =====================================================
   AI INSIGHTS
===================================================== */

function updateInsights() {

    const container =
        document.getElementById(
            "aiInsights"
        );


    const sessions =
        getSessions();

    const tasks =
        getTasks();

    const todayMinutes =
        getTodayMinutes();

    const weeklyMinutes =
        getWeeklyMinutes();

    const streak =
        calculateStreak();


    const insights = [];


    if (sessions.length === 0) {

        insights.push(
            "💡 Complete your first study session to generate personalized insights."
        );

        insights.push(
            "🎯 Start with a 25-minute Pomodoro to build your study history."
        );

    } else {

        const subjects =
            getSubjectData();


        const strongestSubject =
            Object.entries(subjects)
                .sort(
                    (a, b) =>
                        b[1].minutes -
                        a[1].minutes
                )[0];


        if (strongestSubject) {

            insights.push(
                `📚 You have spent the most study time on <strong>${escapeHTML(strongestSubject[0])}</strong>.`
            );

        }


        if (todayMinutes === 0) {

            insights.push(
                "⏰ You haven't recorded any study time today yet."
            );

        } else {

            insights.push(
                `🔥 You've already studied <strong>${formatMinutes(todayMinutes)}</strong> today.`
            );

        }


        if (weeklyMinutes >= 300) {

            insights.push(
                "🚀 Excellent weekly consistency. Keep maintaining this pace."
            );

        } else if (weeklyMinutes > 0) {

            insights.push(
                "📈 Your study history is building. More consistent sessions will strengthen your weekly progress."
            );

        }


        if (streak >= 3) {

            insights.push(
                `🔥 You're on a <strong>${streak}-day</strong> study streak. Keep it alive!`
            );

        }


        const pending =
            tasks.filter(
                task =>
                    !task.completed
            ).length;


        if (pending > 0) {

            insights.push(
                `🎯 You currently have <strong>${pending}</strong> pending planner task${pending === 1 ? "" : "s"}.`
            );

        }

    }


    container.innerHTML =
        insights
            .map(
                text =>
                    `<p>${text}</p>`
            )
            .join("");

}


/* =====================================================
   GOALS
===================================================== */

function updateGoals() {

    const weeklyMinutes =
        getWeeklyMinutes();

    const todayMinutes =
        getTodayMinutes();

    const streak =
        calculateStreak();


    /*
       Goals can easily be changed later.
       Weekly = 10 hours
       Daily = 60 minutes
       Consistency = 7 days
    */

    const weeklyGoal =
        Math.min(
            100,
            Math.round(
                (weeklyMinutes / 600) * 100
            )
        );


    const dailyGoal =
        Math.min(
            100,
            Math.round(
                (todayMinutes / 60) * 100
            )
        );


    const streakGoal =
        Math.min(
            100,
            Math.round(
                (streak / 7) * 100
            )
        );


    setGoal(
        "weeklyGoalText",
        "weeklyGoalBar",
        weeklyGoal
    );


    setGoal(
        "dailyGoalText",
        "dailyGoalBar",
        dailyGoal
    );


    setGoal(
        "streakGoalText",
        "streakGoalBar",
        streakGoal
    );

}


function setGoal(
    textId,
    barId,
    value
) {

    document.getElementById(
        textId
    ).textContent =
        `${value}%`;


    document.getElementById(
        barId
    ).style.width =
        `${value}%`;

}


/* =====================================================
   EMPTY STATE
===================================================== */

function updateEmptyState() {

    const sessions =
        getSessions();

    const tasks =
        getTasks();


    const empty =
        sessions.length === 0 &&
        tasks.length === 0;


    const element =
        document.getElementById(
            "analyticsEmpty"
        );


    element.style.display =
        empty ? "block" : "none";

}


/* =====================================================
   LAST UPDATED
===================================================== */

function updateTimestamp() {

    const now =
        new Date();


    document.getElementById(
        "lastUpdated"
    ).textContent =
        `Updated ${now.toLocaleTimeString(
            "en-IN",
            {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
            }
        )}`;

}


/* =====================================================
   MAIN UPDATE
===================================================== */

function updateAnalytics() {

    updateStats();

    updateWeeklyChart();

    updateSubjectChart();

    updateSubjectTable();

    updateInsights();

    updateGoals();

    updateEmptyState();

    updateTimestamp();

}


/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


/* =====================================================
   INITIALIZE
===================================================== */

updateAnalytics();


/*
   Refresh every 2 seconds.
   This means if Planner/Pomodoro changes
   localStorage, Analytics notices automatically.
*/

setInterval(
    updateAnalytics,
    2000
);


/*
   Also refresh when the user comes back
   to this browser tab.
*/

window.addEventListener(
    "focus",
    updateAnalytics
);


/*
   Refresh when another tab changes
   localStorage.
*/

window.addEventListener(
    "storage",
    updateAnalytics
);