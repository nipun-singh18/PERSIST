package com.persist.backend.service;

import com.persist.backend.model.Activity;
import com.persist.backend.model.Completion;
import com.persist.backend.repository.CompletionRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Optional;

@Service
public class CompletionService {

    private final CompletionRepository completionRepository;
    private final ActivityService activityService;

    public CompletionService(CompletionRepository completionRepository, ActivityService activityService) {
        this.completionRepository = completionRepository;
        this.activityService = activityService;
    }

    public boolean toggleCompletion(Long userId, Long activityId, LocalDate date) {

        Activity activity = activityService.getOwnedActivity(userId, activityId);

        Optional<Completion> existing = completionRepository.findByActivityIdAndCompletionDate(activityId, date);

        if (existing.isPresent()) {
            completionRepository.delete(existing.get());
            return false;
        }

        Completion completion = new Completion();
        completion.setActivity(activity);
        completion.setCompletionDate(date);
        completionRepository.save(completion);
        return true;
    }
}