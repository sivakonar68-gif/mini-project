document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("signupForm");

    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const confirmInput = document.getElementById("confirmPassword");

    const terms = document.getElementById("terms");

    const nameError = document.getElementById("nameError");
    const emailError = document.getElementById("emailError");
    const passwordError = document.getElementById("passwordError");
    const confirmError = document.getElementById("confirmPasswordError");
    const termsError = document.getElementById("termsError");

    const togglePassword =
        document.getElementById("togglePassword");

    const toggleConfirmPassword =
        document.getElementById("toggleConfirmPassword");

    const strengthBar =
        document.getElementById("strengthBar");

    const strengthText =
        document.getElementById("strengthText");

    const signupButton =
        document.getElementById("signupButton");


    /* ==============================
       PASSWORD TOGGLE
    ============================== */

    function toggleField(input, button) {

        const hidden =
            input.type === "password";

        input.type =
            hidden ? "text" : "password";

        button.innerHTML = hidden
            ? '<i class="fa-regular fa-eye-slash"></i>'
            : '<i class="fa-regular fa-eye"></i>';

    }

    togglePassword.addEventListener("click", () => {
        toggleField(passwordInput, togglePassword);
    });

    toggleConfirmPassword.addEventListener("click", () => {
        toggleField(confirmInput, toggleConfirmPassword);
    });


    /* ==============================
       EMAIL VALIDATION
    ============================== */

    function validEmail(email) {

        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    }


    /* ==============================
       PASSWORD STRENGTH
    ============================== */

    passwordInput.addEventListener("input", () => {

        const password =
            passwordInput.value;

        let score = 0;

        if (password.length >= 8)
            score++;

        if (/[A-Z]/.test(password))
            score++;

        if (/[0-9]/.test(password))
            score++;

        if (/[^A-Za-z0-9]/.test(password))
            score++;


        const widths = [
            "0%",
            "25%",
            "50%",
            "75%",
            "100%"
        ];

        strengthBar.style.width =
            widths[score];


        if (!password) {

            strengthText.textContent =
                "Use at least 8 characters";

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


    /* ==============================
       CLEAR ERRORS
    ============================== */

    [
        nameInput,
        emailInput,
        passwordInput,
        confirmInput
    ].forEach(input => {

        input.addEventListener("input", () => {

            input
                .closest(".form-group")
                ?.querySelector(".error")
                ?.replaceChildren();

        });

    });


    /* ==============================
       SUBMIT
    ============================== */

    form.addEventListener("submit", event => {

        event.preventDefault();


        /* Clear errors */

        nameError.textContent = "";
        emailError.textContent = "";
        passwordError.textContent = "";
        confirmError.textContent = "";
        termsError.textContent = "";


        const name =
            nameInput.value.trim();

        const email =
            emailInput.value.trim();

        const password =
            passwordInput.value;

        const confirmPassword =
            confirmInput.value;


        let valid = true;


        /* NAME */

        if (name.length < 2) {

            nameError.textContent =
                "Please enter your full name.";

            valid = false;

        }


        /* EMAIL */

        if (!validEmail(email)) {

            emailError.textContent =
                "Please enter a valid email address.";

            valid = false;

        }


        /* PASSWORD */

        if (password.length < 8) {

            passwordError.textContent =
                "Password must contain at least 8 characters.";

            valid = false;

        }


        /* CONFIRM */

        if (password !== confirmPassword) {

            confirmError.textContent =
                "Passwords do not match.";

            valid = false;

        }


        /* TERMS */

        if (!terms.checked) {

            termsError.textContent =
                "Please accept the terms to continue.";

            valid = false;

        }


        if (!valid)
            return;


        /* ==============================
           DEMO ACCOUNT CREATION
        ============================== */

        signupButton.classList.add("loading");

        signupButton.innerHTML =
            '<i class="fa-solid fa-spinner fa-spin"></i> Creating account...';


        setTimeout(() => {

            /*
                Demo storage.

                Later this can be replaced with
                your backend/database.
            */

            localStorage.setItem(
                "studyPlannerUser",
                JSON.stringify({
                    name: name,
                    email: email
                })
            );


            sessionStorage.setItem(
                "isLoggedIn",
                "true"
            );


            sessionStorage.setItem(
                "userEmail",
                email
            );


            /* Redirect */

            window.location.href =
                "dashboard.html";

        }, 1000);

    });

});