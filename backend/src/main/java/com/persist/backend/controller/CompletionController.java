package com.persist.backend.controller;

import com.persist.backend.service.CompletionService;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/activities/{activityId}/completions")
@CrossOrigin(origins = "*")
public class CompletionController {

    private final CompletionService completionService;

    public CompletionController(CompletionService completionService) {
        this.completionService = completionService;
    }

    @PostMapping("/toggle")
    public Map<String, Object> toggle(@PathVariable Long activityId,
                                       @RequestParam(required = false) String date) {

        LocalDate targetDate = (date != null) ? LocalDate.parse(date) : LocalDate.now();
        boolean completedNow = completionService.toggleCompletion(activityId, targetDate);

        return Map.of("completed", completedNow, "date", targetDate.toString());
    }
}