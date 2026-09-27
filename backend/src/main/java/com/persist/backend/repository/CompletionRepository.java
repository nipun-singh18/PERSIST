package com.persist.backend.repository;

import com.persist.backend.model.Completion;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CompletionRepository extends JpaRepository<Completion, Long> {
}