package com.civicpulse.service;

import com.civicpulse.model.enums.PriorityLevel;
import com.civicpulse.model.enums.SeverityLevel;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class PriorityEngineService {

    /**
     * Deterministic Rule-Based Priority Calculation
     * Formula:
     * Base Score = (CategoryWeight * 20) + (SeverityScore * 15 * CrowdMultiplier) + (ReopenCount * 25)
     */
    public PriorityLevel calculatePriority(
            BigDecimal categoryWeight,
            SeverityLevel severity,
            int affectedCount,
            boolean isEmergency,
            int reopenCount
    ) {
        if (isEmergency) {
            return PriorityLevel.CRITICAL;
        }

        double weight = categoryWeight != null ? categoryWeight.doubleValue() : 1.0;
        
        int severityScore = switch (severity) {
            case CRITICAL -> 4;
            case HIGH -> 3;
            case MEDIUM -> 2;
            case LOW -> 1;
        };

        double crowdMultiplier = 1.0;
        if (affectedCount > 500) {
            crowdMultiplier = 1.6;
        } else if (affectedCount > 100) {
            crowdMultiplier = 1.4;
        } else if (affectedCount > 25) {
            crowdMultiplier = 1.2;
        }

        double totalScore = (weight * 20.0) + (severityScore * 15.0 * crowdMultiplier) + (reopenCount * 25.0);

        if (totalScore >= 80.0) {
            return PriorityLevel.CRITICAL;
        } else if (totalScore >= 55.0) {
            return PriorityLevel.HIGH;
        } else if (totalScore >= 30.0) {
            return PriorityLevel.MEDIUM;
        } else {
            return PriorityLevel.LOW;
        }
    }
}
