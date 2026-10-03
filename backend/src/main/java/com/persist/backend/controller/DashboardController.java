package com.persist.backend.controller;

import com.persist.backend.dto.DashboardSummaryResponse;
import com.persist.backend.service.DashboardService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/summary")
    public DashboardSummaryResponse getSummary(@RequestParam Long userId) {
        return dashboardService.getSummary(userId);
    }
}