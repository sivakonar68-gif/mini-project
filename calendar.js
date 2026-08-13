/* =========================================
   SMART CALENDAR
   ========================================= */

let events =
    JSON.parse(localStorage.getItem("aiPlannerEvents")) || [];

let currentDate = new Date();

let selectedDate = new Date();


/* =========================================
   SAVE DATA
   ========================================= */

function saveEvents() {

    localStorage.setItem(
        "aiPlannerEvents",
        JSON.stringify(events)
    );

}


/* =========================================
   DATE HELPERS
   ========================================= */

function dateKey(date) {

    const year = date.getFullYear();

    const month =
        String(date.getMonth() + 1).padStart(2, "0");

    const day =
        String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;

}


function formatDate(dateString) {

    const date = new Date(dateString + "T00:00:00");

    return date.toLocaleDateString(
        "en-IN",
        {
            day: "numeric",
            month: "short",
            year: "numeric"
        }
    );

}


/* =========================================
   LIVE CLOCK
   ========================================= */

function updateClock() {

    const now = new Date();

    document.getElementById("liveClock")
        .textContent =
        now.toLocaleTimeString(
            "en-IN",
            {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
            }
        );

    document.getElementById("liveDate")
        .textContent =
        now.toLocaleDateString(
            "en-IN",
            {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );

}


updateClock();

setInterval(updateClock, 1000);


/* =========================================
   CALENDAR
   ========================================= */

function renderCalendar() {

    const grid =
        document.getElementById("calendarGrid");

    grid.innerHTML = "";

    const year =
        currentDate.getFullYear();

    const month =
        currentDate.getMonth();


    const monthName =
        currentDate.toLocaleDateString(
            "en-IN",
            {
                month: "long",
                year: "numeric"
            }
        );


    document.getElementById("monthTitle")
        .textContent = monthName;


    /*
       JS starts Sunday = 0.
       Convert so Monday = 0.
    */

    let firstDay =
        new Date(year, month, 1).getDay();

    firstDay =
        firstDay === 0 ? 6 : firstDay - 1;


    const daysInMonth =
        new Date(year, month + 1, 0).getDate();


    const previousMonthDays =
        new Date(year, month, 0).getDate();


    /* Previous month */

    for (
        let i = firstDay - 1;
        i >= 0;
        i--
    ) {

        const dayNumber =
            previousMonthDays - i;

        const cell =
            createDayCell(
                dayNumber,
                true
            );

        grid.appendChild(cell);

    }


    /* Current month */

    for (
        let day = 1;
        day <= daysInMonth;
        day++
    ) {

        const cell =
            createDayCell(
                day,
                false
            );

        grid.appendChild(cell);

    }


    /* Next month */

    const totalCells =
        Math.ceil(grid.children.length / 7) * 7;

    let nextDay = 1;

    while (
        grid.children.length < totalCells
    ) {

        const cell =
            createDayCell(
                nextDay,
                true
            );

        grid.appendChild(cell);

        nextDay++;

    }

}


/* =========================================
   CREATE DAY
   ========================================= */

function createDayCell(
    dayNumber,
    otherMonth
) {

    const cell =
        document.createElement("div");

    cell.className = "day";


    if (otherMonth) {

        cell.classList.add(
            "other-month"
        );

        cell.innerHTML =
            `<span class="day-number">${dayNumber}</span>`;

        return cell;

    }


    const date =
        new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            dayNumber
        );


    const key =
        dateKey(date);


    const todayKey =
        dateKey(new Date());


    const selectedKey =
        dateKey(selectedDate);


    if (key === todayKey) {

        cell.classList.add("today");

    }


    if (key === selectedKey) {

        cell.classList.add("selected");

    }


    cell.innerHTML =
        `<span class="day-number">${dayNumber}</span>`;


    const dayEvents =
        events.filter(
            event => event.date === key
        );


    if (dayEvents.length) {

        const dots =
            document.createElement("div");

        dots.className = "event-dots";


        dayEvents
            .slice(0, 4)
            .forEach(event => {

                const dot =
                    document.createElement("span");

                dot.className =
                    `event-dot ${event.type}`;

                dots.appendChild(dot);

            });


        cell.appendChild(dots);

    }


    cell.addEventListener(
        "click",
        () => {

            selectedDate = date;

            document.getElementById(
                "eventDate"
            ).value = key;

            renderCalendar();

            renderDayEvents();

        }
    );


    return cell;

}


/* =========================================
   MONTH NAVIGATION
   ========================================= */

document.getElementById("prevMonth")
    .addEventListener(
        "click",
        () => {

            currentDate.setMonth(
                currentDate.getMonth() - 1
            );

            renderCalendar();

        }
    );


document.getElementById("nextMonth")
    .addEventListener(
        "click",
        () => {

            currentDate.setMonth(
                currentDate.getMonth() + 1
            );

            renderCalendar();

        }
    );


/* =========================================
   ADD EVENT
   ========================================= */

document.getElementById("eventForm")
    .addEventListener(
        "submit",
        function(e) {

            e.preventDefault();


            const title =
                document.getElementById(
                    "eventTitle"
                ).value.trim();


            const date =
                document.getElementById(
                    "eventDate"
                ).value;


            const type =
                document.getElementById(
                    "eventType"
                ).value;


            const start =
                document.getElementById(
                    "eventStart"
                ).value;


            const end =
                document.getElementById(
                    "eventEnd"
                ).value;


            const priority =
                document.getElementById(
                    "eventPriority"
                ).value;


            const notes =
                document.getElementById(
                    "eventNotes"
                ).value.trim();


            if (!title || !date || !start) {

                alert(
                    "Please enter the event name, date and start time."
                );

                return;

            }


            const newEvent = {

                id:
                    Date.now(),

                title,

                date,

                type,

                start,

                end,

                priority,

                notes,

                completed: false,

                createdAt:
                    new Date().toISOString()

            };


            events.push(newEvent);


            saveEvents();


            /*
               Move calendar to event date
            */

            const eventDate =
                new Date(
                    date + "T00:00:00"
                );


            currentDate =
                new Date(eventDate);

            selectedDate =
                new Date(eventDate);


            renderAll();


            this.reset();


            document.getElementById(
                "eventDate"
            ).value = dateKey(selectedDate);

        }
    );


/* =========================================
   RENDER DAY EVENTS
   ========================================= */

function renderDayEvents() {

    const key =
        dateKey(selectedDate);


    const dayEvents =
        events
            .filter(
                event => event.date === key
            )
            .sort(
                (a, b) =>
                    a.start.localeCompare(
                        b.start
                    )
            );


    document.getElementById(
        "selectedDateText"
    ).textContent =
        formatDate(key);


    document.getElementById(
        "dayTitle"
    ).textContent =
        selectedDate.toLocaleDateString(
            "en-IN",
            {
                weekday: "long",
                day: "numeric",
                month: "long"
            }
        );


    document.getElementById(
        "eventNumber"
    ).textContent =
        `${dayEvents.length} ${
            dayEvents.length === 1
                ? "event"
                : "events"
        }`;


    const container =
        document.getElementById(
            "dayEvents"
        );


    container.innerHTML = "";


    if (!dayEvents.length) {

        container.innerHTML = `

            <div class="empty-day">

                <i class="fas fa-calendar-check"></i>

                <h3>Your day is clear</h3>

                <p>
                    Add a study session, assignment,
                    class or exam.
                </p>

            </div>

        `;

        return;

    }


    dayEvents.forEach(event => {

        const card =
            document.createElement("div");


        card.className =
            "event-card";


        if (event.completed) {

            card.classList.add(
                "completed"
            );

        }


        const time =
            event.end
                ? `${event.start} – ${event.end}`
                : event.start;


        card.innerHTML = `

            <div class="event-time">

                ${time}

            </div>


            <div class="event-main">

                <h3>
                    ${escapeHTML(event.title)}
                </h3>

                <p>
                    ${
                        event.notes
                            ? escapeHTML(event.notes)
                            : "No notes added."
                    }
                </p>

                <div class="event-meta">

                    <span class="badge ${event.type}">
                        ${event.type}
                    </span>

                    <span class="badge ${
                        event.priority === "high"
                            ? "exam"
                            : event.priority
                    }">
                        ${event.priority}
                    </span>

                </div>

            </div>


            <div class="event-actions">

                <button
                    class="complete-btn"
                    onclick="toggleComplete(${event.id})"
                    title="Complete"
                >

                    <i class="fas fa-check"></i>

                </button>


                <button
                    class="remove-btn"
                    onclick="deleteEvent(${event.id})"
                    title="Delete"
                >

                    <i class="fas fa-trash"></i>

                </button>

            </div>

        `;


        container.appendChild(card);

    });

}


/* =========================================
   UPCOMING EVENTS
   ========================================= */

function renderUpcoming() {

    const container =
        document.getElementById(
            "upcomingList"
        );


    const now =
        new Date();


    const upcoming =
        [...events]

            .filter(
                event => {

                    const eventDate =
                        new Date(
                            `${event.date}T${event.start || "00:00"}`
                        );

                    return eventDate >= now;

                }
            )

            .sort(
                (a, b) => {

                    const dateA =
                        new Date(
                            `${a.date}T${a.start}`
                        );

                    const dateB =
                        new Date(
                            `${b.date}T${b.start}`
                        );

                    return dateA - dateB;

                }
            )

            .slice(0, 5);


    container.innerHTML = "";


    if (!upcoming.length) {

        container.innerHTML = `

            <div class="empty-state">

                <i class="fas fa-calendar-plus"></i>

                <p>No upcoming events</p>

            </div>

        `;

        return;

    }


    upcoming.forEach(event => {

        const item =
            document.createElement("div");

        item.className =
            "upcoming-item";


        const date =
            new Date(
                event.date + "T00:00:00"
            );


        const day =
            date.toLocaleDateString(
                "en-IN",
                {
                    day: "2-digit",
                    month: "short"
                }
            );


        item.innerHTML = `

            <div class="upcoming-date">

                ${day}

                <br>

                ${event.start}

            </div>


            <div class="upcoming-info">

                <strong>
                    ${escapeHTML(event.title)}
                </strong>

                <span>
                    ${event.type} • ${event.priority} priority
                </span>

            </div>


            <button
                class="delete-small"
                onclick="deleteEvent(${event.id})"
            >

                <i class="fas fa-trash"></i>

            </button>

        `;


        container.appendChild(item);

    });

}


/* =========================================
   COMPLETE EVENT
   ========================================= */

function toggleComplete(id) {

    const event =
        events.find(
            event => event.id === id
        );


    if (!event) return;


    event.completed =
        !event.completed;


    saveEvents();

    renderAll();

}


/* =========================================
   DELETE EVENT
   ========================================= */

function deleteEvent(id) {

    const confirmed =
        confirm(
            "Delete this event?"
        );


    if (!confirmed) return;


    events =
        events.filter(
            event => event.id !== id
        );


    saveEvents();

    renderAll();

}


/* =========================================
   STATISTICS
   ========================================= */

function updateStats() {

    const today =
        dateKey(new Date());


    const todayEvents =
        events.filter(
            event => event.date === today
        );


    const pending =
        events.filter(
            event => !event.completed
        );


    const highPriority =
        events.filter(
            event =>
                event.priority === "high" &&
                !event.completed
        );


    const completed =
        events.filter(
            event => event.completed
        );


    document.getElementById(
        "todayCount"
    ).textContent =
        todayEvents.length;


    document.getElementById(
        "pendingCount"
    ).textContent =
        pending.length;


    document.getElementById(
        "priorityCount"
    ).textContent =
        highPriority.length;


    document.getElementById(
        "completedCount"
    ).textContent =
        completed.length;

}


/* =========================================
   REAL-TIME REFRESH
   ========================================= */

function refreshRealTime() {

    updateClock();

    updateStats();

    renderUpcoming();

}


/*
   Refresh every 30 seconds.
   This means upcoming events and
   statistics stay current.
*/

setInterval(
    refreshRealTime,
    30000
);


/* =========================================
   SECURITY
   ========================================= */

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


/* =========================================
   RENDER EVERYTHING
   ========================================= */

function renderAll() {

    renderCalendar();

    renderDayEvents();

    renderUpcoming();

    updateStats();

}


/* =========================================
   INITIAL SETUP
   ========================================= */

const today =
    new Date();


selectedDate =
    new Date(today);


currentDate =
    new Date(today);


/*
   Default event date = today
*/

document.getElementById(
    "eventDate"
).value =
    dateKey(today);


renderAll();