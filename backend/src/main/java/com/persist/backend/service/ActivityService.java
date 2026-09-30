package com.persist.backend.service;

import com.persist.backend.dto.ActivityRequest;
import com.persist.backend.dto.ActivityResponse;
import com.persist.backend.model.Activity;
import com.persist.backend.model.User;
import com.persist.backend.repository.ActivityRepository;
import com.persist.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ActivityService {

    private final ActivityRepository activityRepository;
    private final UserRepository userRepository;

    public ActivityService(ActivityRepository activityRepository, UserRepository userRepository) {
        this.activityRepository = activityRepository;
        this.userRepository = userRepository;
    }

    public ActivityResponse createActivity(Long userId, ActivityRequest request) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found."));

        Activity activity = new Activity();
        activity.setUser(user);
        activity.setName(request.getName());
        activity.setDescription(request.getDescription());

        Activity saved = activityRepository.save(activity);

        return toResponse(saved);
    }

    public List<ActivityResponse> getActivitiesForUser(Long userId) {
        return activityRepository.findByUserId(userId).stream()
                .map(this::toResponse)
                .toList();
    }

    public void deleteActivity(Long activityId) {
        activityRepository.deleteById(activityId);
    }

    private ActivityResponse toResponse(Activity activity) {
        return new ActivityResponse(activity.getId(), activity.getName(), activity.getDescription());
    }
}