package com.persist.backend.repository;

import com.persist.backend.model.Completion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface CompletionRepository extends JpaRepository<Completion, Long> {

    List<Completion> findByActivityId(Long activityId);

    Optional<Completion> findByActivityIdAndCompletionDate(Long activityId, LocalDate completionDate);
}