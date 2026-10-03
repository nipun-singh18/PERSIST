package com.persist.backend.service;

import com.persist.backend.dto.ActivityRequest;
import com.persist.backend.dto.ActivityResponse;
import com.persist.backend.model.Activity;
import com.persist.backend.model.Completion;
import com.persist.backend.model.User;
import com.persist.backend.repository.ActivityRepository;
import com.persist.backend.repository.CompletionRepository;
import com.persist.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class ActivityService {

    private final ActivityRepository activityRepository;
    private final UserRepository userRepository;
    private final CompletionRepository completionRepository;
    private final StreakService streakService;

    public ActivityService(ActivityRepository activityRepository,
                            UserRepository userRepository,
                            CompletionRepository completionRepository,
                            StreakService streakService) {
        this.activityRepository = activityRepository;
        this.userRepository = userRepository;
        this.completionRepository = completionRepository;
        this.streakService = streakService;
    }

    public ActivityResponse createActivity(Long userId, ActivityRequest request) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found."));

        Activity activity = new Activity();
        activity.setUser(user);
        activity.setName(request.getName());
        activity.setDescription(request.getDescription());

        return toResponse(activityRepository.save(activity));
    }

    public ActivityResponse updateActivity(Long userId, Long activityId, ActivityRequest request) {

        Activity activity = getOwnedActivity(userId, activityId);
        activity.setName(request.getName());
        activity.setDescription(request.getDescription());

        return toResponse(activityRepository.save(activity));
    }

    public List<ActivityResponse> getActivitiesForUser(Long userId) {
        return activityRepository.findByUserId(userId).stream()
                .map(this::toResponse)
                .toList();
    }

    public void deleteActivity(Long userId, Long activityId) {
        Activity activity = getOwnedActivity(userId, activityId);
        activityRepository.delete(activity);
    }

    /**
     * Fetches an activity and verifies it actually belongs to the given
     * user, preventing one user from editing/deleting another's data just
     * by guessing an activity id. This is a stand-in for proper auth
     * (JWT), which replaces the userId parameter entirely later.
     */
    public Activity getOwnedActivity(Long userId, Long activityId) {

        Activity activity = activityRepository.findById(activityId)
                .orElseThrow(() -> new IllegalArgumentException("Activity not found."));

        if (!activity.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("This activity does not belong to you.");
        }

        return activity;
    }

    private ActivityResponse toResponse(Activity activity) {

        List<LocalDate> dates = completionRepository.findByActivityId(activity.getId()).stream()
                .map(Completion::getCompletionDate)
                .toList();

        StreakService.StreakResult streaks = streakService.calculateStreaks(dates);
        List<String> dateStrings = dates.stream().map(LocalDate::toString).toList();

        return new ActivityResponse(
                activity.getId(), activity.getName(), activity.getDescription(),
                streaks.current(), streaks.best(), dateStrings
        );
    }
}