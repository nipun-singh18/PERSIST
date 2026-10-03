package com.persist.backend.dto;

public class DashboardSummaryResponse {

    private int topCurrentStreak;
    private String topCurrentStreakActivity;
    private int topBestStreak;
    private String topBestStreakActivity;
    private int completedToday;
    private int totalActivities;

    public DashboardSummaryResponse(int topCurrentStreak, String topCurrentStreakActivity,
                                     int topBestStreak, String topBestStreakActivity,
                                     int completedToday, int totalActivities) {
        this.topCurrentStreak = topCurrentStreak;
        this.topCurrentStreakActivity = topCurrentStreakActivity;
        this.topBestStreak = topBestStreak;
        this.topBestStreakActivity = topBestStreakActivity;
        this.completedToday = completedToday;
        this.totalActivities = totalActivities;
    }

    public int getTopCurrentStreak() { return topCurrentStreak; }
    public String getTopCurrentStreakActivity() { return topCurrentStreakActivity; }
    public int getTopBestStreak() { return topBestStreak; }
    public String getTopBestStreakActivity() { return topBestStreakActivity; }
    public int getCompletedToday() { return completedToday; }
    public int getTotalActivities() { return totalActivities; }
}