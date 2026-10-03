package com.persist.backend.service;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.TreeSet;

@Service
public class StreakService {

    public record StreakResult(int current, int best) {}

    public StreakResult calculateStreaks(List<LocalDate> completions) {

        if (completions == null || completions.isEmpty()) {
            return new StreakResult(0, 0);
        }

        TreeSet<LocalDate> sortedDates = new TreeSet<>(completions);

        int best = 1;
        int run = 1;
        LocalDate previous = null;

        for (LocalDate date : sortedDates) {
            if (previous != null) {
                long gap = ChronoUnit.DAYS.between(previous, date);
                if (gap == 1) {
                    run += 1;
                } else if (gap > 1) {
                    run = 1;
                }
                if (run > best) {
                    best = run;
                }
            }
            previous = date;
        }

        LocalDate mostRecent = sortedDates.last();
        long gapFromToday = ChronoUnit.DAYS.between(mostRecent, LocalDate.now());

        int current = 0;

        if (gapFromToday <= 1) {
            current = 1;
            LocalDate[] datesArray = sortedDates.toArray(new LocalDate[0]);
            for (int i = datesArray.length - 1; i > 0; i--) {
                long gap = ChronoUnit.DAYS.between(datesArray[i - 1], datesArray[i]);
                if (gap == 1) {
                    current += 1;
                } else {
                    break;
                }
            }
        }

        return new StreakResult(current, best);
    }
}