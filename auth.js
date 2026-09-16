/* =========================================
   AUTHENTICATION PAGE
========================================= */


/* =========================================
   AUTH BOX
========================================= */

const authBox =
    document.querySelector(".auth-box");


const showLogin =
    document.getElementById("showLogin");


const showSignup =
    document.getElementById("showSignup");


/* =========================================
   CHECK WHICH FORM SHOULD OPEN
========================================= */

/*
   If the user clicked Login on the
   homepage, the URL will contain:

   ?mode=login

   In that case we immediately show
   the Login form.

   If there is no mode parameter,
   Create Account is shown by default.
*/

const urlParams =
    new URLSearchParams(
        window.location.search
    );


if (
    urlParams.get("mode") === "login"
) {

    authBox.classList.add(
        "login-mode"
    );

}


/* =========================================
   SHOW LOGIN
========================================= */

showLogin.addEventListener(
    "click",
    function () {

        authBox.classList.add(
            "login-mode"
        );

    }
);


/* =========================================
   SHOW CREATE ACCOUNT
========================================= */

showSignup.addEventListener(
    "click",
    function () {

        authBox.classList.remove(
            "login-mode"
        );

    }
);


/* =========================================
   CREATE ACCOUNT FORM
========================================= */

const signupForm =
    document.getElementById("signupForm");


signupForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        /*
           TEMPORARY LOGIN SYSTEM

           Backend authentication is not
           connected yet.

           For now, we remember that the
           user has successfully created
           an account.
        */

        localStorage.setItem(
            "persistLoggedIn",
            "true"
        );


        /*
           Open the dashboard.
        */

        window.location.href =
            "dashboard.html";

    }
);


/* =========================================
   LOGIN FORM
========================================= */

const loginForm =
    document.getElementById("loginForm");


loginForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        /*
           TEMPORARY LOGIN SYSTEM

           Backend authentication is not
           connected yet.

           For now, we remember that the
           user has successfully logged in.
        */

        localStorage.setItem(
            "persistLoggedIn",
            "true"
        );


        /*
           Open the dashboard.
        */

        window.location.href =
            "dashboard.html";

    }
);


/* =========================================
   BACKGROUND PARTICLES
========================================= */

const particlesContainer =
    document.getElementById("particles");


const particleColors = [

    "#7B1E3A",
    "#9C1C4A",
    "#C2185B",
    "#D81B60",
    "#8E24AA",
    "#6A1B9A",
    "#AD1457"

];


const particles = [];

const numberOfParticles = 28;


/* =========================================
   CREATE PARTICLES
========================================= */

for (
    let i = 0;
    i < numberOfParticles;
    i++
) {

    const particle =
        document.createElement("div");


    particle.classList.add(
        "particle"
    );


    const size =
        9 + Math.random() * 13;


    particle.style.width =
        `${size}px`;


    particle.style.height =
        `${size}px`;


    const randomColor =
        particleColors[
            Math.floor(
                Math.random() *
                particleColors.length
            )
        ];


    particle.style.backgroundColor =
        randomColor;


    const startX =
        Math.random() *
        window.innerWidth;


    const startY =
        Math.random() *
        window.innerHeight;


    particle.style.left =
        `${startX}px`;


    particle.style.top =
        `${startY}px`;


    particles.push({

        element: particle,

        x: startX,

        y: startY,

        originalX: startX,

        originalY: startY,

        targetX: startX,

        targetY: startY,

        velocityX: 0,

        velocityY: 0,

        phase:
            Math.random() *
            Math.PI *
            2,

        speed:
            0.0005 +
            Math.random() *
            0.0008

    });


    particlesContainer.appendChild(
        particle
    );

}


/* =========================================
   MOUSE
========================================= */

let mouseX =
    window.innerWidth / 2;


let mouseY =
    window.innerHeight / 2;


let mouseActive = false;


document.addEventListener(
    "mousemove",
    function (event) {

        mouseX =
            event.clientX;

        mouseY =
            event.clientY;

        mouseActive = true;

    }
);


document.addEventListener(
    "mouseleave",
    function () {

        mouseActive = false;

    }
);


/* =========================================
   PARTICLE ANIMATION
========================================= */

function animateParticles(time) {

    particles.forEach(
        function (particle) {


            /* -----------------------------
               Gentle natural movement
            ----------------------------- */

            const gentleX =
                Math.sin(
                    time *
                    particle.speed +
                    particle.phase
                ) * 12;


            const gentleY =
                Math.cos(
                    time *
                    particle.speed +
                    particle.phase
                ) * 12;


            particle.targetX =
                particle.originalX +
                gentleX;


            particle.targetY =
                particle.originalY +
                gentleY;


            /* -----------------------------
               Cursor interaction
            ----------------------------- */

            if (mouseActive) {

                const dx =
                    mouseX -
                    particle.x;


                const dy =
                    mouseY -
                    particle.y;


                const distance =
                    Math.sqrt(
                        dx * dx +
                        dy * dy
                    );


                const influenceRadius =
                    350;


                if (
                    distance <
                    influenceRadius
                ) {

                    const influence =
                        1 -
                        distance /
                        influenceRadius;


                    particle.targetX +=
                        dx *
                        influence *
                        0.55;


                    particle.targetY +=
                        dy *
                        influence *
                        0.55;

                }

            }


            /* -----------------------------
               Smooth movement
            ----------------------------- */

            particle.velocityX +=
                (
                    particle.targetX -
                    particle.x
                ) * 0.025;


            particle.velocityY +=
                (
                    particle.targetY -
                    particle.y
                ) * 0.025;


            particle.velocityX *=
                0.88;


            particle.velocityY *=
                0.88;


            particle.x +=
                particle.velocityX;


            particle.y +=
                particle.velocityY;


            /* -----------------------------
               Update particle position
            ----------------------------- */

            particle.element.style.transform =
                `translate3d(
                    ${particle.x - particle.originalX}px,
                    ${particle.y - particle.originalY}px,
                    0
                )`;

        }
    );


    requestAnimationFrame(
        animateParticles
    );

}


requestAnimationFrame(
    animateParticles
);


/* =========================================
   WINDOW RESIZE
========================================= */

window.addEventListener(
    "resize",
    function () {

        mouseX =
            window.innerWidth / 2;

        mouseY =
            window.innerHeight / 2;

    }
);