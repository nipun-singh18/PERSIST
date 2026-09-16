/* =========================================
   PERSIST DASHBOARD
========================================= */


/* =========================================
   ACTIVITY CHECKBOXES
========================================= */

function setupCheckButton(button) {

    button.addEventListener(
        "click",
        function () {

            button.classList.toggle(
                "completed"
            );


            if (
                button.classList.contains(
                    "completed"
                )
            ) {

                button.textContent = "✓";

            }

            else {

                button.textContent = "";

            }

        }
    );

}


/* =========================================
   REMOVE BUTTON
========================================= */

function setupRemoveButton(button) {

    button.addEventListener(
        "click",
        function () {

            const activityCard =
                button.closest(
                    ".activity-card"
                );


            if (!activityCard) {

                return;

            }


            const activityName =
                activityCard.querySelector(
                    "h3"
                ).textContent;


            const confirmRemove =
                confirm(
                    `Remove "${activityName}" from your activities?`
                );


            if (confirmRemove) {

                activityCard.remove();

            }

        }
    );

}


/* =========================================
   SETUP EXISTING ACTIVITIES
========================================= */

function setupActivity(activityCard) {

    const checkButton =
        activityCard.querySelector(
            ".check-button"
        );


    const removeButton =
        activityCard.querySelector(
            ".remove-button"
        );


    setupCheckButton(
        checkButton
    );


    setupRemoveButton(
        removeButton
    );

}


const existingActivities =
    document.querySelectorAll(
        ".activity-card"
    );


existingActivities.forEach(
    function (activityCard) {

        setupActivity(
            activityCard
        );

    }
);


/* =========================================
   ADD ACTIVITY
========================================= */

const addActivityButton =
    document.getElementById(
        "addActivityButton"
    );


const activityList =
    document.getElementById(
        "activityList"
    );


addActivityButton.addEventListener(
    "click",
    function () {


        const activityName =
            prompt(
                "Enter your new activity:"
            );


        if (
            activityName === null
        ) {

            return;

        }


        const cleanName =
            activityName.trim();


        if (
            cleanName === ""
        ) {

            alert(
                "Please enter an activity name."
            );

            return;

        }


        /* =============================
           Create Activity Card
        ============================= */

        const activityCard =
            document.createElement(
                "div"
            );


        activityCard.classList.add(
            "activity-card"
        );


        /* =============================
           Left Side
        ============================= */

        const activityLeft =
            document.createElement(
                "div"
            );


        activityLeft.classList.add(
            "activity-left"
        );


        /* =============================
           Check Button
        ============================= */

        const checkButton =
            document.createElement(
                "button"
            );


        checkButton.classList.add(
            "check-button"
        );


        checkButton.type =
            "button";


        checkButton.setAttribute(
            "aria-label",
            `Complete ${cleanName}`
        );


        /* =============================
           Activity Text
        ============================= */

        const textContainer =
            document.createElement(
                "div"
            );


        const title =
            document.createElement(
                "h3"
            );


        title.textContent =
            cleanName;


        const description =
            document.createElement(
                "p"
            );


        description.textContent =
            "Complete today's activity";


        textContainer.appendChild(
            title
        );


        textContainer.appendChild(
            description
        );


        activityLeft.appendChild(
            checkButton
        );


        activityLeft.appendChild(
            textContainer
        );


        /* =============================
           Right Side
        ============================= */

        const activityRight =
            document.createElement(
                "div"
            );


        activityRight.classList.add(
            "activity-right"
        );


        const streak =
            document.createElement(
                "div"
            );


        streak.classList.add(
            "activity-streak"
        );


        streak.textContent =
            "🔥 0 days";


        const removeButton =
            document.createElement(
                "button"
            );


        removeButton.classList.add(
            "remove-button"
        );


        removeButton.type =
            "button";


        removeButton.textContent =
            "Remove";


        activityRight.appendChild(
            streak
        );


        activityRight.appendChild(
            removeButton
        );


        /* =============================
           Put Everything Together
        ============================= */

        activityCard.appendChild(
            activityLeft
        );


        activityCard.appendChild(
            activityRight
        );


        activityList.appendChild(
            activityCard
        );


        /* Make buttons work */

        setupActivity(
            activityCard
        );

    }
);