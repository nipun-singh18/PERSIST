/* =========================================
   PERSIST — SHARED STREAK LOGIC

   Used by dashboard.js and profile.js so
   the streak calculation lives in exactly
   one place. This is the JS equivalent of
   what will later become a single
   StreakService class in the Spring Boot
   backend — one source of truth instead
   of copy-pasted logic per page.
========================================= */


/* =========================================
   DATE HELPERS
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

   Takes an array of "YYYY-MM-DD" completion
   dates for a single activity and returns:

     { current, best }

   - best    = longest run of consecutive
               calendar days anywhere in
               the history.
   - current = the run ending today, but
               only if the most recent
               completion was today or
               yesterday. Otherwise 0,
               because the streak is broken.
========================================= */

function calculateStreaks(completions) {

    if (!completions || completions.length === 0) {
        return { current: 0, best: 0 };
    }

    const sortedDates = [...new Set(completions)].sort();

    /* ---------- BEST STREAK ---------- */

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

    /* ---------- CURRENT STREAK ---------- */

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

   Also shared, since both dashboard.js and
   profile.js need to read the same
   localStorage keys the same way. Once the
   backend exists, these become fetch()
   calls to the REST API instead — nothing
   else in dashboard.js/profile.js should
   need to change, since they'll still just
   call loadActivities()/loadUser().
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