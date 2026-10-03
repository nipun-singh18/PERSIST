package com.persist.backend.controller;

import com.persist.backend.dto.ActivityRequest;
import com.persist.backend.dto.ActivityResponse;
import com.persist.backend.service.ActivityService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/activities")
public class ActivityController {

    private final ActivityService activityService;

    public ActivityController(ActivityService activityService) {
        this.activityService = activityService;
    }

    @PostMapping
    public ActivityResponse createActivity(@RequestParam Long userId, @RequestBody ActivityRequest request) {
        return activityService.createActivity(userId, request);
    }

    @GetMapping
    public List<ActivityResponse> getActivities(@RequestParam Long userId) {
        return activityService.getActivitiesForUser(userId);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteActivity(@PathVariable Long id) {
        activityService.deleteActivity(id);
        return ResponseEntity.noContent().build();
    }
}