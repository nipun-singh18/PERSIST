/* =========================================
   AUTHENTICATION PAGE
========================================= */


/* =========================================
   AUTH BOX (unchanged UI toggle logic)
========================================= */

const authBox =
    document.querySelector(".auth-box");

const showLogin =
    document.getElementById("showLogin");

const showSignup =
    document.getElementById("showSignup");


const urlParams =
    new URLSearchParams(window.location.search);

if (urlParams.get("mode") === "login") {
    authBox.classList.add("login-mode");
}

showLogin.addEventListener("click", function () {
    authBox.classList.add("login-mode");
});

showSignup.addEventListener("click", function () {
    authBox.classList.remove("login-mode");
});


/* =========================================
   DEFAULT ACTIVITIES FOR NEW USERS
   (gives a new signup something to see
   on the dashboard instead of an empty list)
========================================= */

function createDefaultActivities() {

    return [
        {
            id: "act_" + Date.now() + "_1",
            name: "DSA Practice",
            description: "Solve today's coding problem",
            createdAt: new Date().toISOString().split("T")[0],
            completions: []
        },
        {
            id: "act_" + Date.now() + "_2",
            name: "Workout",
            description: "Complete today's workout",
            createdAt: new Date().toISOString().split("T")[0],
            completions: []
        }
    ];

}


/* =========================================
   CREATE ACCOUNT FORM
========================================= */

const signupForm =
    document.getElementById("signupForm");

signupForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const name = document.getElementById("signupName").value.trim();
    const email = document.getElementById("signupEmail").value.trim().toLowerCase();
    const password = document.getElementById("signupPassword").value;

    if (!name || !email || !password) {
        alert("Please fill in all fields.");
        return;
    }

    /*
       TEMPORARY AUTHENTICATION
       Backend is not connected yet, so we store
       the user directly in localStorage.
       This will be replaced by a real Spring Boot
       /api/auth/register endpoint later.
    */

    const existingUserRaw = localStorage.getItem("persistUser");

    if (existingUserRaw) {
        const existingUser = JSON.parse(existingUserRaw);
        if (existingUser.email === email) {
            alert("An account with this email already exists. Please login instead.");
            return;
        }
    }

    const newUser = { name, email, password };

    localStorage.setItem("persistUser", JSON.stringify(newUser));
    localStorage.setItem("persistLoggedIn", "true");

    /*
       Only seed default activities if none exist yet,
       so we don't wipe an existing user's data.
    */

    if (!localStorage.getItem("persistActivities")) {
        localStorage.setItem(
            "persistActivities",
            JSON.stringify(createDefaultActivities())
        );
    }

    window.location.href = "dashboard.html";

});


/* =========================================
   LOGIN FORM
========================================= */

const loginForm =
    document.getElementById("loginForm");

loginForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const email = document.getElementById("loginEmail").value.trim().toLowerCase();
    const password = document.getElementById("loginPassword").value;

    const existingUserRaw = localStorage.getItem("persistUser");

    if (!existingUserRaw) {
        alert("No account found. Please create an account first.");
        return;
    }

    const existingUser = JSON.parse(existingUserRaw);

    if (existingUser.email !== email || existingUser.password !== password) {
        alert("Incorrect email or password.");
        return;
    }

    localStorage.setItem("persistLoggedIn", "true");

    window.location.href = "dashboard.html";

});


/* =========================================
   BACKGROUND PARTICLES (unchanged)
========================================= */

const particlesContainer =
    document.getElementById("particles");

const particleColors = [
    "#7B1E3A", "#9C1C4A", "#C2185B", "#D81B60",
    "#8E24AA", "#6A1B9A", "#AD1457"
];

const particles = [];
const numberOfParticles = 28;

for (let i = 0; i < numberOfParticles; i++) {

    const particle = document.createElement("div");
    particle.classList.add("particle");

    const size = 9 + Math.random() * 13;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;

    const randomColor = particleColors[Math.floor(Math.random() * particleColors.length)];
    particle.style.backgroundColor = randomColor;

    const startX = Math.random() * window.innerWidth;
    const startY = Math.random() * window.innerHeight;
    particle.style.left = `${startX}px`;
    particle.style.top = `${startY}px`;

    particles.push({
        element: particle,
        x: startX, y: startY,
        originalX: startX, originalY: startY,
        targetX: startX, targetY: startY,
        velocityX: 0, velocityY: 0,
        phase: Math.random() * Math.PI * 2,
        speed: 0.0005 + Math.random() * 0.0008
    });

    particlesContainer.appendChild(particle);

}

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let mouseActive = false;

document.addEventListener("mousemove", function (event) {
    mouseX = event.clientX;
    mouseY = event.clientY;
    mouseActive = true;
});

document.addEventListener("mouseleave", function () {
    mouseActive = false;
});

function animateParticles(time) {

    particles.forEach(function (particle) {

        const gentleX = Math.sin(time * particle.speed + particle.phase) * 12;
        const gentleY = Math.cos(time * particle.speed + particle.phase) * 12;

        particle.targetX = particle.originalX + gentleX;
        particle.targetY = particle.originalY + gentleY;

        if (mouseActive) {

            const dx = mouseX - particle.x;
            const dy = mouseY - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const influenceRadius = 350;

            if (distance < influenceRadius) {
                const influence = 1 - distance / influenceRadius;
                particle.targetX += dx * influence * 0.55;
                particle.targetY += dy * influence * 0.55;
            }

        }

        particle.velocityX += (particle.targetX - particle.x) * 0.025;
        particle.velocityY += (particle.targetY - particle.y) * 0.025;

        particle.velocityX *= 0.88;
        particle.velocityY *= 0.88;

        particle.x += particle.velocityX;
        particle.y += particle.velocityY;

        particle.element.style.transform =
            `translate3d(${particle.x - particle.originalX}px, ${particle.y - particle.originalY}px, 0)`;

    });

    requestAnimationFrame(animateParticles);

}

requestAnimationFrame(animateParticles);

window.addEventListener("resize", function () {
    mouseX = window.innerWidth / 2;
    mouseY = window.innerHeight / 2;
});