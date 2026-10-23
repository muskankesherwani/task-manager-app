const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const message = document.getElementById("message");


// LOGIN
if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const loginButton = document.getElementById("loginButton");
        loginButton.disabled = true;
        loginButton.textContent = "Logging in...";
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        try {
            const response = await fetch(
                `${API_BASE_URL}/api/auth/login`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                }
            );
            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                message.textContent = data.message || "Something went wrong.";
                return;
            }

            // Save JWT token
            localStorage.setItem("token", data.token);

            // Save user information
            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );

            message.textContent = "Login successful!";

            // Open dashboard
            window.location.href = "dashboard.html";

        } catch (error) {

            console.error("Login error:", error);
            message.textContent = error.message;
 
            // Enable login button again
            loginButton.disabled = false;
            loginButton.textContent = "Login";
        }

    });

}


// SIGNUP
if (signupForm) {
    signupForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const signupButton = document.getElementById("signupButton");
        signupButton.disabled = true;
        signupButton.textContent = "Creating account...";
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        try {
            const response = await fetch(
                `${API_BASE_URL}/api/auth/signup`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        name: name,
                        email: email,
                        password: password
                    })
                }
            );
            const data = await response.json();
            if (!response.ok) {
                message.textContent = data.message;
                return;
            }
            // Save JWT token
            localStorage.setItem("token", data.token);
            // Save user information
            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );

            message.textContent = "Account created successfully!";

            // Open dashboard
            window.location.href = "dashboard.html";

        } catch (error) {

            console.error("Signup error:", error);
            message.textContent = error.message;

            loginButton.disabled = false;
            loginButton.textContent = "SignUp";
        }

    });

}