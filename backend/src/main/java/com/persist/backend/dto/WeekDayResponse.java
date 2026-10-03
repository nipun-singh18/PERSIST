package com.persist.backend.dto;

public class WeekDayResponse {

    private String date;
    private boolean completed;

    public WeekDayResponse(String date, boolean completed) {
        this.date = date;
        this.completed = completed;
    }

    public String getDate() { return date; }
    public boolean isCompleted() { return completed; }
}