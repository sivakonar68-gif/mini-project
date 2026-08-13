document.addEventListener("DOMContentLoaded", () => {

    const loginForm = document.getElementById("loginForm");

    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    const emailError = document.getElementById("emailError");
    const passwordError = document.getElementById("passwordError");

    const rememberMe = document.getElementById("rememberMe");

    const togglePassword =
        document.getElementById("togglePassword");

    const loginButton =
        document.getElementById("loginButton");

    const forgotPassword =
        document.getElementById("forgotPassword");

    const googleLogin =
        document.getElementById("googleLogin");

    const githubLogin =
        document.getElementById("githubLogin");


    /* ==========================================
       LOAD REMEMBERED EMAIL
    ========================================== */

    const savedEmail =
        localStorage.getItem("rememberedEmail");

    if (savedEmail) {

        emailInput.value = savedEmail;

        rememberMe.checked = true;
    }


    /* ==========================================
       PASSWORD SHOW / HIDE
    ========================================== */

    togglePassword.addEventListener("click", () => {

        const isPassword =
            passwordInput.type === "password";

        passwordInput.type =
            isPassword ? "text" : "password";

        togglePassword.innerHTML = isPassword
            ? '<i class="fa-regular fa-eye-slash"></i>'
            : '<i class="fa-regular fa-eye"></i>';

    });


    /* ==========================================
       CLEAR ERRORS WHILE TYPING
    ========================================== */

    emailInput.addEventListener("input", () => {

        emailError.textContent = "";

        emailInput.classList.remove("invalid");

    });

    passwordInput.addEventListener("input", () => {

        passwordError.textContent = "";

        passwordInput.classList.remove("invalid");

    });


    /* ==========================================
       EMAIL VALIDATION
    ========================================== */

    function validateEmail(email) {

        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    }


    /* ==========================================
       LOGIN
    ========================================== */

    loginForm.addEventListener("submit", (event) => {

        event.preventDefault();


        const email =
            emailInput.value.trim();

        const password =
            passwordInput.value.trim();

        let valid = true;


        /* EMAIL */

        if (!email) {

            emailError.textContent =
                "Please enter your email address.";

            valid = false;

        }
        else if (!validateEmail(email)) {

            emailError.textContent =
                "Please enter a valid email address.";

            valid = false;

        }


        /* PASSWORD */

        if (!password) {

            passwordError.textContent =
                "Please enter your password.";

            valid = false;

        }
        else if (password.length < 6) {

            passwordError.textContent =
                "Password must contain at least 6 characters.";

            valid = false;

        }


        if (!valid) {
            return;
        }


        /* ======================================
           REMEMBER EMAIL
        ====================================== */

        if (rememberMe.checked) {

            localStorage.setItem(
                "rememberedEmail",
                email
            );

        } else {

            localStorage.removeItem(
                "rememberedEmail"
            );

        }


        /* ======================================
           LOGIN BUTTON
        ====================================== */

        loginButton.classList.add("loading");

        loginButton.innerHTML =
            '<i class="fa-solid fa-spinner fa-spin"></i> Signing in...';


        /*
            DEMO LOGIN

            Replace this section later with
            your backend/database authentication.
        */

        setTimeout(() => {

            sessionStorage.setItem(
                "isLoggedIn",
                "true"
            );

            sessionStorage.setItem(
                "userEmail",
                email
            );


            /*
                Redirect to dashboard
            */

            window.location.href =
                "dashboard.html";

        }, 900);

    });


    /* ==========================================
       FORGOT PASSWORD
    ========================================== */

    forgotPassword.addEventListener("click", (event) => {

        event.preventDefault();

        const email =
            emailInput.value.trim();

        if (!email) {

            emailError.textContent =
                "Enter your email first.";

            emailInput.focus();

            return;
        }

        if (!validateEmail(email)) {

            emailError.textContent =
                "Enter a valid email address.";

            emailInput.focus();

            return;
        }

        alert(
            "Password reset functionality will be connected to the backend."
        );

    });


    /* ==========================================
       GOOGLE LOGIN
    ========================================== */

    googleLogin.addEventListener("click", () => {

        alert(
            "Google authentication will be connected later."
        );

    });


    /* ==========================================
       GITHUB LOGIN
    ========================================== */

    githubLogin.addEventListener("click", () => {

        alert(
            "GitHub authentication will be connected later."
        );

    });

});