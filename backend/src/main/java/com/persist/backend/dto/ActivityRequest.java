package com.persist.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ActivityRequest {

    @NotBlank(message = "Activity name is required")
    @Size(max = 100, message = "Name must be under 100 characters")
    private String name;

    @Size(max = 255, message = "Description must be under 255 characters")
    private String description;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}