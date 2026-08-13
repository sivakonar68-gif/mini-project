document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("registerForm");

    const name = document.getElementById("name");
    const email = document.getElementById("email");
    const course = document.getElementById("course");

    const password = document.getElementById("password");
    const confirmPassword =
        document.getElementById("confirmPassword");

    const terms = document.getElementById("terms");

    const strengthBar =
        document.getElementById("strengthBar");

    const strengthText =
        document.getElementById("strengthText");


    /* PASSWORD TOGGLE */

    function togglePassword(input, button) {

        if (input.type === "password") {

            input.type = "text";

            button.innerHTML =
                '<i class="fa-regular fa-eye-slash"></i>';

        } else {

            input.type = "password";

            button.innerHTML =
                '<i class="fa-regular fa-eye"></i>';
        }
    }

    document
        .getElementById("togglePassword")
        .addEventListener("click", function () {

            togglePassword(password, this);

        });

    document
        .getElementById("toggleConfirm")
        .addEventListener("click", function () {

            togglePassword(confirmPassword, this);

        });


    /* PASSWORD STRENGTH */

    password.addEventListener("input", () => {

        const value = password.value;

        let score = 0;

        if (value.length >= 8) score++;
        if (/[A-Z]/.test(value)) score++;
        if (/[0-9]/.test(value)) score++;
        if (/[^A-Za-z0-9]/.test(value)) score++;

        strengthBar.style.width =
            `${score * 25}%`;

        if (!value) {

            strengthText.textContent =
                "Minimum 8 characters";

        } else if (score <= 1) {

            strengthText.textContent =
                "Weak password";

        } else if (score === 2) {

            strengthText.textContent =
                "Fair password";

        } else if (score === 3) {

            strengthText.textContent =
                "Good password";

        } else {

            strengthText.textContent =
                "Strong password";
        }
    });


    /* FORM */

    form.addEventListener("submit", (e) => {

        e.preventDefault();

        document.getElementById("nameError").textContent = "";
        document.getElementById("emailError").textContent = "";
        document.getElementById("passwordError").textContent = "";
        document.getElementById("confirmError").textContent = "";
        document.getElementById("termsError").textContent = "";


        let valid = true;


        /* NAME */

        if (name.value.trim().length < 2) {

            document.getElementById("nameError").textContent =
                "Please enter your name.";

            valid = false;
        }


        /* EMAIL */

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {

            document.getElementById("emailError").textContent =
                "Please enter a valid email.";

            valid = false;
        }


        /* COURSE */

        if (!course.value) {

            valid = false;

            course.style.borderColor = "#dc2626";

        } else {

            course.style.borderColor = "";
        }


        /* PASSWORD */

        if (password.value.length < 8) {

            document.getElementById("passwordError").textContent =
                "Password must contain at least 8 characters.";

            valid = false;
        }


        /* CONFIRM */

        if (password.value !== confirmPassword.value) {

            document.getElementById("confirmError").textContent =
                "Passwords do not match.";

            valid = false;
        }


        /* TERMS */

        if (!terms.checked) {

            document.getElementById("termsError").textContent =
                "Please accept the terms to continue.";

            valid = false;
        }


        if (!valid) return;


        /* DEMO ACCOUNT */

        const user = {
            name: name.value.trim(),
            email: email.value.trim(),
            course: course.value
        };

        localStorage.setItem(
            "studyPlannerUser",
            JSON.stringify(user)
        );

        sessionStorage.setItem(
            "isLoggedIn",
            "true"
        );

        sessionStorage.setItem(
            "userEmail",
            user.email
        );


        const button =
            document.getElementById("registerButton");

        button.innerHTML =
            '<i class="fa-solid fa-spinner fa-spin"></i> Creating account...';

        button.disabled = true;


        setTimeout(() => {

            window.location.href =
                "dashboard.html";

        }, 900);

    });

});