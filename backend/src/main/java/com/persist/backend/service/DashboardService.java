package com.persist.backend.service;

import com.persist.backend.dto.ActivityResponse;
import com.persist.backend.dto.DashboardSummaryResponse;
import com.persist.backend.dto.WeekDayResponse;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final ActivityService activityService;

    public DashboardService(ActivityService activityService) {
        this.activityService = activityService;
    }

    public DashboardSummaryResponse getSummary(Long userId) {

        List<ActivityResponse> activities = activityService.getActivitiesForUser(userId);

        if (activities.isEmpty()) {
            return new DashboardSummaryResponse(0, "No activities yet", 0, "No activities yet", 0, 0);
        }

        int topCurrent = -1;
        String topCurrentName = "";
        int topBest = -1;
        String topBestName = "";
        int completedToday = 0;
        String today = LocalDate.now().toString();

        for (ActivityResponse activity : activities) {

            if (activity.getCurrentStreak() > topCurrent) {
                topCurrent = activity.getCurrentStreak();
                topCurrentName = activity.getName();
            }

            if (activity.getBestStreak() > topBest) {
                topBest = activity.getBestStreak();
                topBestName = activity.getName();
            }

            if (activity.getCompletionDates().contains(today)) {
                completedToday += 1;
            }
        }

        return new DashboardSummaryResponse(
                topCurrent, topCurrent > 0 ? topCurrentName : "No active streak",
                topBest, topBest > 0 ? topBestName : "No streak yet",
                completedToday, activities.size()
        );
    }

    public List<WeekDayResponse> getWeek(Long userId) {

        List<ActivityResponse> activities = activityService.getActivitiesForUser(userId);

        LocalDate monday = LocalDate.now().with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));

        return java.util.stream.IntStream.range(0, 7)
                .mapToObj(monday::plusDays)
                .map(date -> {
                    String dateStr = date.toString();
                    boolean wasCompleted = activities.stream()
                            .anyMatch(a -> a.getCompletionDates().contains(dateStr));
                    return new WeekDayResponse(dateStr, wasCompleted);
                })
                .collect(Collectors.toList());
    }
}