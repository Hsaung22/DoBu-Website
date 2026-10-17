const menuBtn = document.querySelector(".menu-btn");
const navLinks = document.querySelector(".nav-links");

if (menuBtn) {
    menuBtn.addEventListener("click", () => {
        navLinks.classList.toggle("show");
    });
}

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", function (e) {

        e.preventDefault();

        const name = document.getElementById("regName").value.trim();
        const email = document.getElementById("regEmail").value.trim();
        const password = document.getElementById("regPassword").value;
        const confirmPassword = document.getElementById("regConfirm").value;

        const message = document.getElementById("registerMessage");

        if (!name || !email || !password) {
            showMessage(message, "Please complete all fields.");
            return;
        }

        if (password.length <6) {
            showMessage(message, "Password must contain at least 6 characters.");
            return;
        }

        if (password !== confirmPassword) {
            showMessage(message, "Passwords do not match.");
            return;
        }

        const user = {
            name: name,
            email: email,
            password: password,
            membership: "Basic",
            membershipPrice: "£25 / Month",
            joinDate: new Date().toLocaleDateString(),
            trainingHistory: []
        };

        localStorage.setItem("dobuUser", JSON.stringify(user));

        message.style.display = "block";
        message.style.background = "rgba(50,200,100,.15)";
        message.style.color = "#9cffbd";
        message.innerText = "Account created successfully! Redirecting...";

        setTimeout(() => {
            window.location.href = "dashboard.html";
        }, 1200);
    });
}


const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", function (e) {

        e.preventDefault();

        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value;

        const message = document.getElementById("loginMessage");

        const savedUser = JSON.parse(localStorage.getItem("dobuUser"));

        if (!savedUser) {
            showMessage(message, "No account found. Please register first.");
            return;
        }

        if (email === savedUser.email && password === savedUser.password) {

            localStorage.setItem("dobuLoggedIn", "true");

            message.style.display = "block";
            message.style.background = "rgba(50,200,100,.15)";
            message.style.color = "#9cffbd";
            message.innerText = "Login successful!";

            setTimeout(() => {
                window.location.href = "dashboard.html";
            }, 700);

        } else {
            showMessage(message, "Incorrect email or password.");
        }
    });
}


function loadDashboard() {

    const user = JSON.parse(localStorage.getItem("dobuUser"));

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    const name = document.getElementById("dashboardName");
    const email = document.getElementById("dashboardEmail");
    const membership = document.getElementById("dashboardMembership");
    const price = document.getElementById("dashboardPrice");

    if (name) name.innerText = user.name;
    if (email) email.innerText = user.email;
    if (membership) membership.innerText = user.membership;
    if (price) price.innerText = user.membershipPrice;

    const history = document.getElementById("trainingHistory");

    if (history) {

        if (user.trainingHistory.length === 0) {
            history.innerHTML =
                "<p style='color:#9d91aa'>No training history available yet.</p>";
        } else {

            history.innerHTML = "";

            user.trainingHistory.forEach(item => {

                const div = document.createElement("div");

                div.style.padding = "12px 0";
                div.style.borderBottom = "1px solid rgba(157,78,221,.2)";

                div.innerHTML = `
                    <strong>${item.class}</strong>
                    <br>
                    <small style="color:#9d91aa">${item.date}</small>
                `;

                history.appendChild(div);
            });
        }
    }
}

if (document.body.classList.contains("dashboard-page")) {
    loadDashboard();
}


const membershipForm = document.getElementById("membershipForm");

if (membershipForm) {

    membershipForm.addEventListener("submit", function (e) {

        e.preventDefault();

        const selected = document.getElementById("membershipSelect").value;

        const prices = {
            Basic: "£25 / Month",
            Intermediate: "£35 / Month",
            Advanced: "£45 / Month",
            Elite: "£60 / Month",
            Junior: "£25 / Month"
        };

        const user = JSON.parse(localStorage.getItem("dobuUser"));

        if (!user) {
            window.location.href = "login.html";
            return;
        }

        user.membership = selected;
        user.membershipPrice = prices[selected];

        localStorage.setItem("dobuUser", JSON.stringify(user));

        const message = document.getElementById("membershipMessage");

        message.style.display = "block";
        message.style.background = "rgba(50,200,100,.15)";
        message.style.color = "#9cffbd";
        message.innerText = "Membership updated successfully.";

        loadDashboard();
    });
}

function logout() {

    localStorage.removeItem("dobuLoggedIn");

    window.location.href = "login.html";
}

const topicForm = document.getElementById("topicForm");

if (topicForm) {

    topicForm.addEventListener("submit", function (e) {

        e.preventDefault();

        const loggedIn = localStorage.getItem("dobuLoggedIn");
        const user = JSON.parse(localStorage.getItem("dobuUser"));

        if (!loggedIn || !user) {
            alert("Please login before creating a topic.");
            window.location.href = "login.html";
            return;
        }

        const title = document.getElementById("topicTitle").value.trim();
        const category = document.getElementById("topicCategory").value;
        const description = document.getElementById("topicDescription").value.trim();

        if (!title || !description) {
            alert("Please complete all fields.");
            return;
        }

        const topics = JSON.parse(localStorage.getItem("dobuTopics")) || [];

        topics.unshift({
            title: title,
            category: category,
            description: description,
            author: user.name,
            date: new Date().toLocaleDateString()
        });

        localStorage.setItem("dobuTopics", JSON.stringify(topics));

        alert("Your topic has been created.");

        topicForm.reset();

        loadTopics();
    });
}


function loadTopics() {

    const topicContainer = document.getElementById("customTopics");

    if (!topicContainer) return;

    const topics = JSON.parse(localStorage.getItem("dobuTopics")) || [];

    topicContainer.innerHTML = "";

    topics.forEach(topic => {

        const div = document.createElement("div");

        div.className = "forum-topic";

        div.innerHTML = `
            <div>
                <h1>${escapedTitle}</h1>
                <p>
                    ${escapeHTML(topic.category)}
                    • Posted by ${escapeHTML(topic.author)}
                    • ${escapeHTML(topic.date)}
                </p>
            </div>
            <i class="fa-solid fa-comments"></i>
        `;

        topicContainer.appendChild(div);
    });
}

if (document.getElementById("customTopics")) {
    loadTopics();
}


const contactForm = document.getElementById("contactForm");

if (contactForm) {

    contactForm.addEventListener("submit", function (e) {

        e.preventDefault();

        const message = document.getElementById("contactMessage");

        message.style.display = "block";
        message.style.background = "rgba(50,200,100,.15)";
        message.style.color = "#9cffbd";
        message.innerText =
            "Thank you! Your message has been sent successfully.";

        contactForm.reset();
    });
}


function showMessage(element, text) {

    if (!element) return;

    element.style.display = "block";
    element.style.background = "rgba(255,70,100,.12)";
    element.style.color = "#ff9eae";
    element.innerText = text;
}


function escapeHTML(str) {

    return str
        .replaceAll("&", "&amp;")
        .replaceAll("\u003E", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}