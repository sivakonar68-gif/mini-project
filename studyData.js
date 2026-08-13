// ========================================
// AI STUDY PLANNER - STUDY DATA SYSTEM
// ========================================

// All completed study sessions are stored here.
const STUDY_DATA_KEY = "aiStudyPlannerData";


// ========================================
// GET DATA
// ========================================

function getStudyData() {

    const savedData =
        localStorage.getItem(STUDY_DATA_KEY);

    if (!savedData) {

        return {
            sessions: []
        };

    }

    try {

        const data =
            JSON.parse(savedData);

        if (!data.sessions) {
            data.sessions = [];
        }

        return data;

    } catch (error) {

        console.error(
            "Could not read study data:",
            error
        );

        return {
            sessions: []
        };

    }

}


// ========================================
// SAVE DATA
// ========================================

function saveStudyData(data) {

    localStorage.setItem(
        STUDY_DATA_KEY,
        JSON.stringify(data)
    );

    // Tell Analytics and other pages
    // that the data has changed.
    window.dispatchEvent(
        new CustomEvent("studyDataUpdated")
    );

}


// ========================================
// ADD COMPLETED STUDY SESSION
// ========================================

function addStudySession(
    subject,
    minutes
) {

    const data =
        getStudyData();


    const now =
        new Date();


    const session = {

        id:
            Date.now(),

        subject:
            subject,

        minutes:
            Number(minutes),

        date:
            now.toISOString(),

        day:
            now.toISOString()
                .split("T")[0]

    };


    data.sessions.push(session);


    saveStudyData(data);


    console.log(
        `Study session added: ${subject} - ${minutes} minutes`
    );


    return session;

}


// ========================================
// GET ALL SESSIONS
// ========================================

function getSessions() {

    return getStudyData().sessions;

}


// ========================================
// TOTAL STUDY MINUTES
// ========================================

function getTotalStudyMinutes() {

    return getSessions().reduce(
        (total, session) => {

            return total +
                Number(session.minutes);

        },
        0
    );

}


// ========================================
// TODAY'S STUDY MINUTES
// ========================================

function getTodayStudyMinutes() {

    const today =
        new Date()
            .toISOString()
            .split("T")[0];


    return getSessions()
        .filter(session =>
            session.day === today
        )
        .reduce(
            (total, session) => {

                return total +
                    Number(session.minutes);

            },
            0
        );

}


// ========================================
// SUBJECT STUDY DATA
// ========================================

function getSubjectStudyData() {

    const subjects = [

        "DBMS",
        "Java",
        "Python",
        "Operating System",
        "Computer Networks"

    ];


    const sessions =
        getSessions();


    return subjects.map(subject => {

        return sessions
            .filter(
                session =>
                    session.subject === subject
            )
            .reduce(
                (total, session) =>
                    total +
                    Number(session.minutes),
                0
            );

    });

}


// ========================================
// GET SUBJECT MINUTES
// ========================================

function getSubjectMinutes(subject) {

    return getSessions()
        .filter(
            session =>
                session.subject === subject
        )
        .reduce(
            (total, session) =>
                total +
                Number(session.minutes),
            0
        );

}


// ========================================
// WEEKLY STUDY DATA
// ========================================

function getWeeklyStudyData() {

    const result =
        [0, 0, 0, 0, 0, 0, 0];


    const now =
        new Date();


    const startOfWeek =
        new Date(now);


    // Monday = beginning of week

    const day =
        startOfWeek.getDay();


    const difference =
        day === 0
            ? 6
            : day - 1;


    startOfWeek.setDate(
        startOfWeek.getDate() -
        difference
    );


    startOfWeek.setHours(
        0, 0, 0, 0
    );


    getSessions().forEach(session => {

        const sessionDate =
            new Date(session.date);


        if (
            sessionDate >=
            startOfWeek
        ) {

            const dayIndex =
                sessionDate.getDay() === 0
                    ? 6
                    : sessionDate.getDay() - 1;


            result[dayIndex] +=
                Number(session.minutes) / 60;

        }

    });


    return result.map(hours =>
        Number(hours.toFixed(2))
    );

}


// ========================================
// STUDY STREAK
// ========================================

function getStudyStreak() {

    const sessions =
        getSessions();


    if (sessions.length === 0) {
        return 0;
    }


    const studyDays =
        new Set();


    sessions.forEach(session => {

        studyDays.add(
            session.day
        );

    });


    const dates =
        Array.from(studyDays)
            .sort()
            .reverse();


    const today =
        new Date();

    today.setHours(
        0, 0, 0, 0
    );


    let streak = 0;


    // Check whether today has study activity.

    const todayString =
        formatDate(today);


    if (!studyDays.has(todayString)) {

        // Allow streak to continue from yesterday.

        const yesterday =
            new Date(today);

        yesterday.setDate(
            yesterday.getDate() - 1
        );


        if (
            !studyDays.has(
                formatDate(yesterday)
            )
        ) {

            return 0;

        }

    }


    let currentDate =
        studyDays.has(todayString)
            ? new Date(today)
            : new Date(today);


    if (!studyDays.has(todayString)) {

        currentDate.setDate(
            currentDate.getDate() - 1
        );

    }


    while (
        studyDays.has(
            formatDate(currentDate)
        )
    ) {

        streak++;

        currentDate.setDate(
            currentDate.getDate() - 1
        );

    }


    return streak;

}


// ========================================
// DATE FORMAT
// ========================================

function formatDate(date) {

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


    return `${year}-${month}-${day}`;

}


// ========================================
// TOTAL STUDY HOURS
// ========================================

function getTotalStudyHours() {

    return (
        getTotalStudyMinutes() / 60
    );

}


// ========================================
// DELETE A SESSION
// ========================================

function deleteStudySession(id) {

    const data =
        getStudyData();


    data.sessions =
        data.sessions.filter(
            session =>
                session.id !== id
        );


    saveStudyData(data);

}


// ========================================
// CLEAR ALL STUDY DATA
// ========================================

function clearStudyData() {

    const confirmDelete =
        confirm(
            "Delete all study data?"
        );


    if (!confirmDelete) {
        return;
    }


    localStorage.removeItem(
        STUDY_DATA_KEY
    );


    window.dispatchEvent(
        new CustomEvent("studyDataUpdated")
    );


    console.log(
        "All study data cleared."
    );

}


// ========================================
// REAL-TIME STORAGE SYNC
// ========================================

// If another browser tab changes the
// study data, update this page too.

window.addEventListener(
    "storage",
    event => {

        if (
            event.key ===
            STUDY_DATA_KEY
        ) {

            window.dispatchEvent(
                new CustomEvent(
                    "studyDataUpdated"
                )
            );

        }

    }
);