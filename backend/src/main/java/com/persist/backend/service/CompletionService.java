package com.persist.backend.service;

import com.persist.backend.model.Activity;
import com.persist.backend.model.Completion;
import com.persist.backend.repository.ActivityRepository;
import com.persist.backend.repository.CompletionRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Optional;

@Service
public class CompletionService {

    private final CompletionRepository completionRepository;
    private final ActivityRepository activityRepository;

    public CompletionService(CompletionRepository completionRepository, ActivityRepository activityRepository) {
        this.completionRepository = completionRepository;
        this.activityRepository = activityRepository;
    }

    public boolean toggleCompletion(Long activityId, LocalDate date) {

        Activity activity = activityRepository.findById(activityId)
                .orElseThrow(() -> new IllegalArgumentException("Activity not found."));

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