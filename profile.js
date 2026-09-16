/* =========================================
   PERSIST PROFILE
========================================= */


/* =========================================
   LOGOUT
========================================= */

const logoutButton =
    document.getElementById(
        "logoutButton"
    );


logoutButton.addEventListener(
    "click",
    function () {


        const confirmLogout =
            confirm(
                "Are you sure you want to logout?"
            );


        if (!confirmLogout) {

            return;

        }


        /*
           Remove temporary login status.
        */

        localStorage.removeItem(
            "persistLoggedIn"
        );


        /*
           Return to homepage.
        */

        window.location.href =
            "index.html";

    }
);