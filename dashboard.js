/* =========================================
   PERSIST DASHBOARD

   Date helpers, streak calculation, and
   data access (loadActivities, saveActivities,
   loadUser) now live in streaks.js, loaded
   before this file.
========================================= */


/* =========================================
   ROUTE GUARD
========================================= */

if (localStorage.getItem("persistLoggedIn") !== "true") {
    window.location.href = "auth.html?mode=login";
}


/* =========================================
   DOM REFERENCES
========================================= */

const activityList = document.getElementById("activityList");
const addActivityButton = document.getElementById("addActivityButton");

const currentStreakEl = document.getElementById("currentStreak");
const bestStreakEl = document.getElementById("bestStreak");
const currentStreakActivityEl = document.getElementById("currentStreakActivity");
const bestStreakActivityEl = document.getElementById("bestStreakActivity");
const todayProgressEl = document.getElementById("todayProgress");


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
            <div class="activity-streak">🔥 ${current} current &middot; 🏆 ${best} best</div>
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
========================================= */

function renderStats() {

    const activities = loadActivities();

    if (activities.length === 0) {
        currentStreakEl.textContent = "0 Days";
        bestStreakEl.textContent = "0 Days";
        currentStreakActivityEl.textContent = "No activities yet";
        bestStreakActivityEl.textContent = "No activities yet";
        todayProgressEl.textContent = "0/0";
        return;
    }

    let topCurrent = -1;
    let topCurrentName = "";
    let topBest = -1;
    let topBestName = "";
    let completedToday = 0;

    activities.forEach(function (activity) {

        const { current, best } = calculateStreaks(activity.completions);

        if (current > topCurrent) {
            topCurrent = current;
            topCurrentName = activity.name;
        }

        if (best > topBest) {
            topBest = best;
            topBestName = activity.name;
        }

        if (activity.completions.includes(todayString())) {
            completedToday += 1;
        }

    });

    currentStreakEl.textContent = `${topCurrent} Day${topCurrent === 1 ? "" : "s"}`;
    bestStreakEl.textContent = `${topBest} Day${topBest === 1 ? "" : "s"}`;
    currentStreakActivityEl.textContent = topCurrent > 0 ? topCurrentName : "No active streak";
    bestStreakActivityEl.textContent = topBest > 0 ? topBestName : "No streak yet";
    todayProgressEl.textContent = `${completedToday}/${activities.length}`;

}


/* =========================================
   RENDER: WEEKLY CONSISTENCY GRID
========================================= */

function renderWeek() {

    const activities = loadActivities();
    const dayBoxes = document.querySelectorAll(".day-box");

    const now = new Date();
    const dayOfWeek = now.getDay();
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