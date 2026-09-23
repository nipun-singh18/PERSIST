/* =========================================
   PERSIST HOMEPAGE
========================================= */


/* =========================================
   ANIMATED TAGLINE
========================================= */

const animatedText =
    document.getElementById("animated-text");

const text =
    animatedText.textContent;

animatedText.textContent = "";

text.split("").forEach((character, index) => {

    const span =
        document.createElement("span");

    span.textContent =
        character === " " ? "\u00A0" : character;

    span.classList.add("animated-letter");

    span.style.animationDelay =
        `${index * 0.04}s`;

    animatedText.appendChild(span);

});


/* =========================================
   REPEAT TAGLINE ANIMATION
========================================= */

setInterval(function () {

    const letters =
        document.querySelectorAll(".animated-letter");

    letters.forEach(function (letter) {
        letter.style.animation = "none";
    });

    void animatedText.offsetWidth;

    letters.forEach(function (letter, index) {
        letter.style.animation = "letterAppear 0.5s ease forwards";
        letter.style.animationDelay = `${index * 0.04}s`;
    });

}, 8000);


/* =========================================
   BUTTON NAVIGATION
   Behavior depends on whether the visitor
   already has a session — a returning,
   logged-in user shouldn't be pushed
   through signup/login again.
========================================= */

const getStartedButton =
    document.getElementById("getStartedButton");

const loginButton =
    document.getElementById("loginButton");


function setupButtonsForLoggedOutUser() {

    getStartedButton.textContent = "Get Started";
    loginButton.textContent = "Login";

    getStartedButton.addEventListener("click", function () {
        window.location.href = "auth.html?mode=signup";
    });

    loginButton.addEventListener("click", function () {
        window.location.href = "auth.html?mode=login";
    });

}


function setupButtonsForLoggedInUser() {

    getStartedButton.textContent = "Go to Dashboard";
    loginButton.textContent = "Logout";

    getStartedButton.addEventListener("click", function () {
        window.location.href = "dashboard.html";
    });

    loginButton.addEventListener("click", function () {

        const confirmLogout = confirm("Are you sure you want to logout?");
        if (!confirmLogout) return;

        localStorage.removeItem("persistLoggedIn");

        // Refresh button state without a full page reload.
        setupButtonsForLoggedOutUser();
        getStartedButton.textContent = "Get Started";
        loginButton.textContent = "Login";

    });

}


if (localStorage.getItem("persistLoggedIn") === "true") {
    setupButtonsForLoggedInUser();
} else {
    setupButtonsForLoggedOutUser();
}


/* =========================================
   FLOATING BACKGROUND PARTICLES
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