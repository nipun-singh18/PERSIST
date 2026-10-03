package com.persist.backend.dto;

import java.util.List;

public class ActivityResponse {

    private Long id;
    private String name;
    private String description;
    private int currentStreak;
    private int bestStreak;
    private List<String> completionDates;

    public ActivityResponse(Long id, String name, String description,
                             int currentStreak, int bestStreak, List<String> completionDates) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.currentStreak = currentStreak;
        this.bestStreak = bestStreak;
        this.completionDates = completionDates;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public int getCurrentStreak() { return currentStreak; }
    public int getBestStreak() { return bestStreak; }
    public List<String> getCompletionDates() { return completionDates; }
}