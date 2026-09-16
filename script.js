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


/*
   Create every character separately
   so that each character can animate.
*/

text.split("").forEach((character, index) => {

    const span =
        document.createElement("span");


    /*
       Preserve spaces between words.
    */

    span.textContent =
        character === " "
            ? "\u00A0"
            : character;


    span.classList.add(
        "animated-letter"
    );


    /*
       Small delay between characters.
    */

    span.style.animationDelay =
        `${index * 0.04}s`;


    animatedText.appendChild(
        span
    );

});


/* =========================================
   REPEAT TAGLINE ANIMATION
========================================= */

/*
   Replay the animation every 8 seconds.
*/

setInterval(function () {

    const letters =
        document.querySelectorAll(
            ".animated-letter"
        );


    letters.forEach(function (letter) {

        letter.style.animation =
            "none";

    });


    /*
       Force browser to recognize
       the animation reset.
    */

    void animatedText.offsetWidth;


    /*
       Start animation again.
    */

    letters.forEach(function (letter, index) {

        letter.style.animation =
            "letterAppear 0.5s ease forwards";


        letter.style.animationDelay =
            `${index * 0.04}s`;

    });

}, 8000);


/* =========================================
   BUTTON NAVIGATION
========================================= */

/*
   GET STARTED ALWAYS OPENS
   THE CREATE ACCOUNT PAGE.
*/

function goToGetStarted() {

    window.location.href =
        "auth.html?mode=signup";

}


/*
   LOGIN ALWAYS OPENS
   THE LOGIN PAGE.
*/

function goToLogin() {

    window.location.href =
        "auth.html?mode=login";

}


/* =========================================
   FLOATING BACKGROUND PARTICLES
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


    /*
       Random particle size.
    */

    const size =
        9 + Math.random() * 13;


    particle.style.width =
        `${size}px`;


    particle.style.height =
        `${size}px`;


    /*
       Random particle color.
    */

    const randomColor =
        particleColors[
            Math.floor(
                Math.random() *
                particleColors.length
            )
        ];


    particle.style.backgroundColor =
        randomColor;


    /*
       Random starting position.
    */

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


    /*
       Store particle information.
    */

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
   MOUSE POSITION
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


/* =========================================
   MOUSE LEAVES PAGE
========================================= */

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


            /*
               Gentle natural movement.
            */

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


            /*
               Friction.
            */

            particle.velocityX *=
                0.88;


            particle.velocityY *=
                0.88;


            /*
               Update position.
            */

            particle.x +=
                particle.velocityX;


            particle.y +=
                particle.velocityY;


            /*
               Move particle.
            */

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