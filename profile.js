/* =========================================
   PERSIST PROFILE
========================================= */


/* =========================================
   ROUTE GUARD
   Same rule as the dashboard — no session,
   no access.
========================================= */

if (localStorage.getItem("persistLoggedIn") !== "true") {
    window.location.href = "auth.html?mode=login";
}


/* =========================================
   DATE HELPERS
   (identical logic to dashboard.js —
   in a real backend this would live in
   one shared place instead of being
   copied between files)
========================================= */

function todayString() {
    return new Date().toISOString().split("T")[0];
}

function parseDate(dateStr) {
    const [year, month, day] = dateStr.split("-").map(Number);
    return new Date(year, month - 1, day);
}

function daysBetween(dateStrA, dateStrB) {
    const msPerDay = 1000 * 60 * 60 * 24;
    const a = parseDate(dateStrA);
    const b = parseDate(dateStrB);
    return Math.round((b - a) / msPerDay);
}


/* =========================================
   STREAK CALCULATION
========================================= */

function calculateStreaks(completions) {

    if (!completions || completions.length === 0) {
        return { current: 0, best: 0 };
    }

    const sortedDates = [...new Set(completions)].sort();

    let best = 1;
    let run = 1;

    for (let i = 1; i < sortedDates.length; i++) {

        const gap = daysBetween(sortedDates[i - 1], sortedDates[i]);

        if (gap === 1) {
            run += 1;
        } else if (gap > 1) {
            run = 1;
        }

        if (run > best) {
            best = run;
        }

    }

    const mostRecent = sortedDates[sortedDates.length - 1];
    const gapFromToday = daysBetween(mostRecent, todayString());

    let current = 0;

    if (gapFromToday <= 1) {

        current = 1;

        for (let i = sortedDates.length - 1; i > 0; i--) {

            const gap = daysBetween(sortedDates[i - 1], sortedDates[i]);

            if (gap === 1) {
                current += 1;
            } else {
                break;
            }

        }

    }

    return { current, best };

}


/* =========================================
   DATA ACCESS
========================================= */

function loadUser() {
    const raw = localStorage.getItem("persistUser");
    return raw ? JSON.parse(raw) : null;
}

function loadActivities() {
    const raw = localStorage.getItem("persistActivities");
    return raw ? JSON.parse(raw) : [];
}


/* =========================================
   RENDER: PERSONAL INFO
========================================= */

function renderPersonalInfo() {

    const user = loadUser();
    if (!user) return;

    document.getElementById("profileName").textContent = user.name;
    document.getElementById("profileEmail").textContent = user.email;
    document.getElementById("profileHeading").textContent = user.name;

    const initial = user.name.trim().charAt(0).toUpperCase();
    document.getElementById("profileAvatar").textContent = initial || "P";

}


/* =========================================
   RENDER: CONSISTENCY SUMMARY
   Reuses the exact same "best across all
   activities" logic as the dashboard's top
   stat cards, so the numbers always agree
   no matter which page the user is on.
========================================= */

function renderConsistencySummary() {

    const activities = loadActivities();

    const currentEl = document.getElementById("summaryCurrentStreak");
    const bestEl = document.getElementById("summaryBestStreak");
    const totalEl = document.getElementById("summaryTotalActivities");
    const todayEl = document.getElementById("summaryCompletedToday");

    totalEl.textContent = activities.length;

    if (activities.length === 0) {
        currentEl.textContent = "0 Days";
        bestEl.textContent = "0 Days";
        todayEl.textContent = "0/0";
        return;
    }

    let topCurrent = 0;
    let topBest = 0;
    let completedToday = 0;

    activities.forEach(function (activity) {

        const { current, best } = calculateStreaks(activity.completions);

        if (current > topCurrent) topCurrent = current;
        if (best > topBest) topBest = best;

        if (activity.completions.includes(todayString())) {
            completedToday += 1;
        }

    });

    currentEl.textContent = `${topCurrent} Day${topCurrent === 1 ? "" : "s"}`;
    bestEl.textContent = `${topBest} Day${topBest === 1 ? "" : "s"}`;
    todayEl.textContent = `${completedToday}/${activities.length}`;

}


/* =========================================
   LOGOUT
========================================= */

const logoutButton = document.getElementById("logoutButton");

logoutButton.addEventListener("click", function () {

    const confirmLogout = confirm("Are you sure you want to logout?");
    if (!confirmLogout) return;

    /*
       Only clear the session flag —
       NOT persistUser or persistActivities.
       Their account/data should still be
       there next time they log back in.
    */

    localStorage.removeItem("persistLoggedIn");

    window.location.href = "index.html";

});


/* =========================================
   INITIAL RENDER
========================================= */

renderPersonalInfo();
renderConsistencySummary();