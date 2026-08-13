document.addEventListener("DOMContentLoaded", () => {

    const streakCount =
        document.getElementById("streakCount");

    const currentStreak =
        document.getElementById("currentStreak");

    const bestStreak =
        document.getElementById("bestStreak");

    const totalDays =
        document.getElementById("totalDays");

    const message =
        document.getElementById("streakMessage");

    const studyBtn =
        document.getElementById("studyBtn");

    const calendar =
        document.getElementById("calendar");


    let studyDays =
        JSON.parse(
            localStorage.getItem("studyDays")
        ) || [];


    function getToday() {
        const now = new Date();

        return [
            now.getFullYear(),
            String(now.getMonth() + 1).padStart(2, "0"),
            String(now.getDate()).padStart(2, "0")
        ].join("-");
    }


    function calculateStreak() {

        if (studyDays.length === 0)
            return 0;

        const dates =
            [...new Set(studyDays)].sort().reverse();

        const today = new Date();

        const todayString = getToday();

        const yesterday = new Date(today);

        yesterday.setDate(
            yesterday.getDate() - 1
        );

        const yesterdayString =
            [
                yesterday.getFullYear(),
                String(yesterday.getMonth() + 1).padStart(2, "0"),
                String(yesterday.getDate()).padStart(2, "0")
            ].join("-");


        if (
            dates[0] !== todayString &&
            dates[0] !== yesterdayString
        ) {
            return 0;
        }


        let streak = 0;

        let checkDate =
            new Date(
                dates[0] === todayString
                    ? today
                    : yesterday
            );


        for (let i = 0; i < dates.length; i++) {

            const expected =
                [
                    checkDate.getFullYear(),
                    String(checkDate.getMonth() + 1).padStart(2, "0"),
                    String(checkDate.getDate()).padStart(2, "0")
                ].join("-");


            if (dates[i] === expected) {

                streak++;

                checkDate.setDate(
                    checkDate.getDate() - 1
                );

            } else {
                break;
            }
        }

        return streak;
    }


    function calculateBestStreak() {

        const dates =
            [...new Set(studyDays)].sort();

        let best = 0;
        let current = 0;
        let previous = null;


        dates.forEach(dateString => {

            const date =
                new Date(dateString);


            if (previous) {

                const difference =
                    Math.round(
                        (date - previous) /
                        (1000 * 60 * 60 * 24)
                    );


                if (difference === 1) {
                    current++;
                } else {
                    current = 1;
                }

            } else {
                current = 1;
            }


            best =
                Math.max(best, current);

            previous = date;
        });


        return best;
    }


    function renderCalendar() {

        calendar.innerHTML = "";

        const today = new Date();

        const year =
            today.getFullYear();

        const month =
            today.getMonth();

        const daysInMonth =
            new Date(
                year,
                month + 1,
                0
            ).getDate();


        for (
            let day = 1;
            day <= daysInMonth;
            day++
        ) {

            const cell =
                document.createElement("div");

            cell.className = "day";

            const date =
                `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

            cell.textContent = day;


            if (studyDays.includes(date)) {
                cell.classList.add("studied");
            }


            calendar.appendChild(cell);
        }
    }


    function update() {

        const streak =
            calculateStreak();

        const best =
            calculateBestStreak();

        const total =
            new Set(studyDays).size;


        streakCount.textContent =
            `${streak} ${streak === 1 ? "Day" : "Days"}`;

        currentStreak.textContent =
            streak;

        bestStreak.textContent =
            best;

        totalDays.textContent =
            total;


        const today =
            getToday();


        if (studyDays.includes(today)) {

            message.textContent =
                "You've studied today! Keep the streak alive 🔥";

            studyBtn.disabled = true;

            studyBtn.innerHTML =
                "✓ Studied Today";

        } else {

            studyBtn.disabled = false;

            studyBtn.innerHTML =
                '<i class="fa-solid fa-book-open"></i> Mark Today as Studied';

            message.textContent =
                streak > 0
                    ? "Study today to continue your streak!"
                    : "Start studying today to begin your streak!";
        }


        renderCalendar();
    }


    studyBtn.addEventListener("click", () => {

        const today =
            getToday();


        if (!studyDays.includes(today)) {

            studyDays.push(today);

            localStorage.setItem(
                "studyDays",
                JSON.stringify(studyDays)
            );

            update();
        }
    });


    update();

});