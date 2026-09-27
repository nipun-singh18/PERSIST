package com.persist.backend.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(
    name = "completions",
    uniqueConstraints = @UniqueConstraint(columnNames = {"activity_id", "completion_date"})
)
public class Completion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "activity_id", nullable = false)
    private Activity activity;

    @Column(name = "completion_date", nullable = false)
    private LocalDate completionDate;

    public Completion() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Activity getActivity() { return activity; }
    public void setActivity(Activity activity) { this.activity = activity; }

    public LocalDate getCompletionDate() { return completionDate; }
    public void setCompletionDate(LocalDate completionDate) { this.completionDate = completionDate; }
}