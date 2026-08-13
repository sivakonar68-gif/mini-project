// ==========================
// AI Study Planner
// main.js
// ==========================

document.addEventListener("DOMContentLoaded", () => {

    // ==========================
    // AI Planner Card
    // ==========================

    const plannerCard = [...document.querySelectorAll("h3")]
        .find(element =>
            element.textContent.trim() === "AI Planner"
        );

    if (plannerCard) {

        const card = plannerCard.closest(
            ".feature-card, .card, section, div"
        );

        if (card) {

            card.style.cursor = "pointer";

            card.addEventListener("click", () => {
                window.location.href = "planner.html";
            });

        }
    }


    // ==========================
    // Login Links
    // ==========================

    document.querySelectorAll("a").forEach(link => {

        const text =
            link.textContent.trim().toLowerCase();

        if (text.includes("login")) {

            link.addEventListener("click", () => {
                window.location.href = "login.html";
            });

        }

    });


    // ==========================
    // Signup / Get Started Links
    // ==========================

    document.querySelectorAll("a").forEach(link => {

        const text =
            link.textContent.trim().toLowerCase();

        if (
            text.includes("sign up") ||
            text.includes("signup") ||
            text.includes("get started")
        ) {

            link.addEventListener("click", () => {
                window.location.href = "signup.html";
            });

        }

    });


    // ==========================
    // Console
    // ==========================

    console.log(
        "🚀 AI Study Planner Homepage Loaded"
    );

});