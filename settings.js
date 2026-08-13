document.addEventListener("DOMContentLoaded", () => {

    const nameInput =
        document.getElementById("nameInput");

    const emailInput =
        document.getElementById("emailInput");

    const courseInput =
        document.getElementById("courseInput");

    const studyGoal =
        document.getElementById("studyGoal");

    const focusDuration =
        document.getElementById("focusDuration");

    const notifications =
        document.getElementById("notifications");

    const saveBtn =
        document.getElementById("saveBtn");

    const saveMessage =
        document.getElementById("saveMessage");


    /* ==========================
       LOAD USER
    ========================== */

    const savedUser =
        JSON.parse(
            localStorage.getItem("studyPlannerUser")
        );


    if (savedUser) {

        nameInput.value =
            savedUser.name || "";

        emailInput.value =
            savedUser.email || "";

        courseInput.value =
            savedUser.course || "";

    }


    /* ==========================
       LOAD SETTINGS
    ========================== */

    studyGoal.value =
        localStorage.getItem("studyGoal") || "120";

    focusDuration.value =
        localStorage.getItem("focusDuration") || "25";

    notifications.checked =
        localStorage.getItem("notifications") === "true";


    /* ==========================
       SAVE
    ========================== */

    saveBtn.addEventListener("click", () => {

        const user = {

            name:
                nameInput.value.trim(),

            email:
                emailInput.value.trim(),

            course:
                courseInput.value

        };


        localStorage.setItem(
            "studyPlannerUser",
            JSON.stringify(user)
        );


        localStorage.setItem(
            "studyGoal",
            studyGoal.value
        );


        localStorage.setItem(
            "focusDuration",
            focusDuration.value
        );


        localStorage.setItem(
            "notifications",
            notifications.checked
        );


        saveMessage.textContent =
            "✓ Changes saved";


        saveBtn.innerHTML =
            '<i class="fa-solid fa-check"></i> Saved';


        setTimeout(() => {

            saveMessage.textContent = "";

            saveBtn.innerHTML =
                '<i class="fa-solid fa-check"></i> Save Changes';

        }, 2000);

    });


    /* ==========================
       LOGOUT
    ========================== */

    document
        .getElementById("logoutBtn")
        .addEventListener("click", (event) => {

            event.preventDefault();

            sessionStorage.removeItem(
                "isLoggedIn"
            );

            sessionStorage.removeItem(
                "userEmail"
            );

            window.location.href =
                "login.html";

        });

});