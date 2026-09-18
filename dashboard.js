/* =========================================
   PERSIST DASHBOARD
========================================= */


/* =========================================
   ROUTE GUARD
   If nobody is logged in, don't let them
   see the dashboard at all.
========================================= */

if (localStorage.getItem("persistLoggedIn") !== "true") {
    window.location.href = "auth.html?mode=login";
}


/* =========================================
   DATE HELPERS
========================================= */

/*
   Returns today's date as "YYYY-MM-DD",
   which is what we store in `completions`.
*/
function todayString() {
    return new Date().toISOString().split("T")[0];
}

/*
   "YYYY-MM-DD" -> Date object at midnight,
   so day-difference math is exact.
*/
function parseDate(dateStr) {
    const [year, month, day] = dateStr.split("-").map(Number);
    return new Date(year, month - 1, day);
}

/*
   Whole number of days between two date strings.
*/
function daysBetween(dateStrA, dateStrB) {
    const msPerDay = 1000 * 60 * 60 * 24;
    const a = parseDate(dateStrA);
    const b = parseDate(dateStrB);
    return Math.round((b - a) / msPerDay);
}


/* =========================================
   STREAK CALCULATION
   (the core algorithm of the whole project)
========================================= */

function calculateStreaks(completions) {

    if (!completions || completions.length === 0) {
        return { current: 0, best: 0 };
    }

    /*
       Sort ascending and remove duplicates,
       so we can walk day-by-day safely.
    */
    const sortedDates =
        [...new Set(completions)].sort();

    /* ---------- BEST STREAK ---------- */

    let best = 1;
    let run = 1;

    for (let i = 1; i < sortedDates.length; i++) {

        const gap = daysBetween(sortedDates[i - 1], sortedDates[i]);

        if (gap === 1) {
            // consecutive day, extend the run
            run += 1;
        } else if (gap > 1) {
            // missed at least one day, run resets
            run = 1;
        }
        // gap === 0 can't happen, duplicates were removed

        if (run > best) {
            best = run;
        }

    }

    /* ---------- CURRENT STREAK ---------- */

    const mostRecent = sortedDates[sortedDates.length - 1];
    const gapFromToday = daysBetween(mostRecent, todayString());

    let current = 0;

    if (gapFromToday <= 1) {

        // Most recent completion was today or yesterday,
        // so the streak is still "alive" — count backward.

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
    // else: last completion was 2+ days ago, streak is broken -> 0

    return { current, best };

}


/* =========================================
   DATA ACCESS (localStorage for now,
   will become real API calls later)
========================================= */

function loadActivities() {
    const raw = localStorage.getItem("persistActivities");
    return raw ? JSON.parse(raw) : [];
}

function saveActivities(activities) {
    localStorage.setItem("persistActivities", JSON.stringify(activities));
}

function loadUser() {
    const raw = localStorage.getItem("persistUser");
    return raw ? JSON.parse(raw) : null;
}


/* =========================================
   DOM REFERENCES
========================================= */

const activityList = document.getElementById("activityList");
const addActivityButton = document.getElementById("addActivityButton");
const currentStreakEl = document.getElementById("currentStreak");
const bestStreakEl = document.getElementById("bestStreak");


/* =========================================
   RENDER: ONE ACTIVITY CARD
========================================= */

function createActivityCard(activity) {

    const { current, best } = calculateStreaks(activity.completions);
    const completedToday = activity.completions.includes(todayString());

    const activityCard = document.createElement("div");
    activityCard.classList.add("activity-card");
    activityCard.dataset.id = activity.id;

    activityCard.innerHTML = `
        <div class="activity-left">
            <button
                class="check-button ${completedToday ? "completed" : ""}"
                type="button"
                aria-label="Complete ${activity.name}">
                ${completedToday ? "✓" : ""}
            </button>
            <div>
                <h3>${activity.name}</h3>
                <p>${activity.description}</p>
            </div>
        </div>
        <div class="activity-right">
            <div class="activity-streak">🔥 ${current} days</div>
            <button class="remove-button" type="button">Remove</button>
        </div>
    `;

    const checkButton = activityCard.querySelector(".check-button");
    const removeButton = activityCard.querySelector(".remove-button");

    checkButton.addEventListener("click", function () {
        toggleCompletion(activity.id);
    });

    removeButton.addEventListener("click", function () {
        removeActivity(activity.id, activity.name);
    });

    return activityCard;

}


/* =========================================
   RENDER: FULL ACTIVITY LIST
========================================= */

function renderActivities() {

    const activities = loadActivities();

    activityList.innerHTML = "";

    if (activities.length === 0) {
        activityList.innerHTML =
            `<p style="color:#888; font-size:14px;">
                No activities yet. Add one to get started.
             </p>`;
        return;
    }

    activities.forEach(function (activity) {
        activityList.appendChild(createActivityCard(activity));
    });

}


/* =========================================
   RENDER: TOP STAT CARDS
   Shows the activity you're most consistent
   with right now.
========================================= */

function renderStats() {

    const activities = loadActivities();

    let topCurrent = 0;
    let topBest = 0;

    activities.forEach(function (activity) {
        const { current, best } = calculateStreaks(activity.completions);
        if (current > topCurrent) topCurrent = current;
        if (best > topBest) topBest = best;
    });

    currentStreakEl.textContent = `${topCurrent} Day${topCurrent === 1 ? "" : "s"}`;
    bestStreakEl.textContent = `${topBest} Day${topBest === 1 ? "" : "s"}`;

}


/* =========================================
   RENDER: WEEKLY CONSISTENCY GRID
   A day counts as "consistent" if the user
   completed at least one activity that day.
========================================= */

function renderWeek() {

    const activities = loadActivities();
    const dayBoxes = document.querySelectorAll(".day-box");

    // Find this week's Monday
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 = Sunday
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

    const monday = new Date(now);
    monday.setDate(now.getDate() + diffToMonday);

    for (let i = 0; i < 7; i++) {

        const date = new Date(monday);
        date.setDate(monday.getDate() + i);

        const dateStr = date.toISOString().split("T")[0];

        const wasCompleted = activities.some(function (activity) {
            return activity.completions.includes(dateStr);
        });

        const box = dayBoxes[i];
        if (!box) continue;

        box.classList.toggle("completed-day", wasCompleted);
        box.textContent = wasCompleted ? "✓" : "";

    }

}


/* =========================================
   ACTIONS
========================================= */

function toggleCompletion(activityId) {

    const activities = loadActivities();
    const activity = activities.find(a => a.id === activityId);

    if (!activity) return;

    const today = todayString();
    const index = activity.completions.indexOf(today);

    if (index === -1) {
        activity.completions.push(today);
    } else {
        activity.completions.splice(index, 1);
    }

    saveActivities(activities);
    renderAll();

}

function removeActivity(activityId, activityName) {

    const confirmRemove = confirm(`Remove "${activityName}" from your activities?`);
    if (!confirmRemove) return;

    const activities = loadActivities().filter(a => a.id !== activityId);
    saveActivities(activities);
    renderAll();

}

function addActivity() {

    const name = prompt("Enter your new activity:");
    if (name === null) return;

    const cleanName = name.trim();
    if (cleanName === "") {
        alert("Please enter an activity name.");
        return;
    }

    const activities = loadActivities();

    activities.push({
        id: "act_" + Date.now(),
        name: cleanName,
        description: "Complete today's activity",
        createdAt: todayString(),
        completions: []
    });

    saveActivities(activities);
    renderAll();

}


/* =========================================
   WELCOME MESSAGE
========================================= */

function renderWelcome() {

    const user = loadUser();
    const welcomeHeading = document.querySelector(".welcome-section h1");

    if (user && welcomeHeading) {
        const firstName = user.name.split(" ")[0];
        welcomeHeading.textContent = `Good to see you, ${firstName} 👋`;
    }

}


/* =========================================
   INITIAL RENDER + EVENT WIRING
========================================= */

function renderAll() {
    renderActivities();
    renderStats();
    renderWeek();
}

addActivityButton.addEventListener("click", addActivity);

renderWelcome();
renderAll();