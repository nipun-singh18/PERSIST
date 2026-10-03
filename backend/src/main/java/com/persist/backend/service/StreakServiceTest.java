package com.persist.backend.service;

import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

class StreakServiceTest {

    private final StreakService streakService = new StreakService();

    @Test
    void emptyCompletionsReturnsZeroZero() {
        StreakService.StreakResult result = streakService.calculateStreaks(List.of());
        assertEquals(0, result.current());
        assertEquals(0, result.best());
    }

    @Test
    void singleCompletionTodayGivesCurrentStreakOne() {
        List<LocalDate> dates = List.of(LocalDate.now());
        StreakService.StreakResult result = streakService.calculateStreaks(dates);
        assertEquals(1, result.current());
        assertEquals(1, result.best());
    }

    @Test
    void threeConsecutiveDaysEndingTodayGivesStreakThree() {
        LocalDate today = LocalDate.now();
        List<LocalDate> dates = List.of(today.minusDays(2), today.minusDays(1), today);
        StreakService.StreakResult result = streakService.calculateStreaks(dates);
        assertEquals(3, result.current());
        assertEquals(3, result.best());
    }

    @Test
    void gapOfTwoOrMoreDaysBreaksCurrentStreak() {
        LocalDate today = LocalDate.now();
        // Completed 5 days ago, then nothing since — streak is broken.
        List<LocalDate> dates = List.of(today.minusDays(5));
        StreakService.StreakResult result = streakService.calculateStreaks(dates);
        assertEquals(0, result.current());
        assertEquals(1, result.best());
    }

    @Test
    void bestStreakSurvivesEvenAfterCurrentStreakBreaks() {
        LocalDate today = LocalDate.now();
        // A 4-day streak far in the past, then a broken gap, nothing recent.
        List<LocalDate> dates = List.of(
                today.minusDays(20), today.minusDays(19), today.minusDays(18), today.minusDays(17)
        );
        StreakService.StreakResult result = streakService.calculateStreaks(dates);
        assertEquals(0, result.current());
        assertEquals(4, result.best());
    }

    @Test
    void yesterdayCompletionStillCountsAsAliveStreak() {
        LocalDate today = LocalDate.now();
        List<LocalDate> dates = List.of(today.minusDays(1));
        StreakService.StreakResult result = streakService.calculateStreaks(dates);
        assertEquals(1, result.current());
    }

    @Test
    void duplicateDatesDoNotInflateStreak() {
        LocalDate today = LocalDate.now();
        List<LocalDate> dates = List.of(today, today, today);
        StreakService.StreakResult result = streakService.calculateStreaks(dates);
        assertEquals(1, result.current());
        assertEquals(1, result.best());
    }
}