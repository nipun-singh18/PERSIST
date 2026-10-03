package com.persist.backend.controller;

import com.persist.backend.dto.CompletionToggleResponse;
import com.persist.backend.service.CompletionService;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/activities/{activityId}/completions")
public class CompletionController {

    private final CompletionService completionService;

    public CompletionController(CompletionService completionService) {
        this.completionService = completionService;
    }

    @PostMapping("/toggle")
    public CompletionToggleResponse toggle(@PathVariable Long activityId,
                                            @RequestParam Long userId,
                                            @RequestParam(required = false) String date) {

        LocalDate targetDate = (date != null) ? LocalDate.parse(date) : LocalDate.now();
        boolean completedNow = completionService.toggleCompletion(userId, activityId, targetDate);

        return new CompletionToggleResponse(completedNow, targetDate.toString());
    }
}