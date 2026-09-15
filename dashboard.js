/* =========================================
   PERSIST DASHBOARD
========================================= */


/* =========================================
   ACTIVITY CHECKBOXES
========================================= */

const checkButtons =
    document.querySelectorAll(".check-button");


checkButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                const activityCard =
                    button.closest(
                        ".activity-card"
                    );


                /* Toggle completed state */

                button.classList.toggle(
                    "completed"
                );


                /* Add/remove check mark */

                if (
                    button.classList.contains(
                        "completed"
                    )
                ) {

                    button.textContent = "✓";

                    activityCard.classList.add(
                        "activity-completed"
                    );

                }

                else {

                    button.textContent = "";

                    activityCard.classList.remove(
                        "activity-completed"
                    );

                }

            }
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


        /* If user presses Cancel */

        if (
            activityName === null
        ) {

            return;

        }


        /* Remove unnecessary spaces */

        const cleanName =
            activityName.trim();


        /* Don't create an empty activity */

        if (
            cleanName === ""
        ) {

            alert(
                "Please enter an activity name."
            );

            return;

        }


        /* Create activity card */

        const activityCard =
            document.createElement(
                "div"
            );


        activityCard.classList.add(
            "activity-card"
        );


        activityCard.innerHTML = `

            <div class="activity-left">

                <button
                    class="check-button"
                    type="button"
                    aria-label="Complete activity">

                </button>


                <div>

                    <h3>
                        ${cleanName}
                    </h3>

                    <p>
                        Complete today's activity
                    </p>

                </div>

            </div>


            <div class="activity-streak">

                🔥 0 days

            </div>

        `;


        /* Add new card to page */

        activityList.appendChild(
            activityCard
        );


        /* Make its checkbox work */

        const newCheckButton =
            activityCard.querySelector(
                ".check-button"
            );


        newCheckButton.addEventListener(
            "click",
            function () {

                newCheckButton.classList.toggle(
                    "completed"
                );


                if (
                    newCheckButton.classList.contains(
                        "completed"
                    )
                ) {

                    newCheckButton.textContent =
                        "✓";

                    activityCard.classList.add(
                        "activity-completed"
                    );

                }

                else {

                    newCheckButton.textContent =
                        "";

                    activityCard.classList.remove(
                        "activity-completed"
                    );

                }

            }
        );

    }
);