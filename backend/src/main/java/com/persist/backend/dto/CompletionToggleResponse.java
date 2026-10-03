package com.persist.backend.dto;

public class CompletionToggleResponse {

    private boolean completed;
    private String date;

    public CompletionToggleResponse(boolean completed, String date) {
        this.completed = completed;
        this.date = date;
    }

    public boolean isCompleted() { return completed; }
    public String getDate() { return date; }
}