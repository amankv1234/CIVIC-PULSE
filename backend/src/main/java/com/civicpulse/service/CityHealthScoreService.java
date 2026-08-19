package com.civicpulse.service;

import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class CityHealthScoreService {

    /**
     * City Health Index calculation formula:
     * Overall Score = (SLA Compliance % * 0.35)
     *               + (Avg Resolution Speed Score * 0.25)
     *               + (Citizen Satisfaction Rate % * 0.25)
     *               + (Backlog Health Score * 0.15)
     */
    public double calculateOverallHealthScore(
            double slaComplianceRate,
            double avgResolutionHours,
            double citizenSatisfactionRate,
            int openCriticalIssues,
            int totalActiveIssues
    ) {
        // Normalize SLA Compliance (0-100) -> weight 35%
        double slaScore = Math.min(100.0, Math.max(0.0, slaComplianceRate));

        // Normalize Resolution Speed: 0 hrs = 100, 72 hrs = 0 -> weight 25%
        double speedScore = Math.max(0.0, 100.0 - (avgResolutionHours / 72.0 * 100.0));

        // Citizen Satisfaction (0-100) -> weight 25%
        double satisfactionScore = Math.min(100.0, Math.max(0.0, citizenSatisfactionRate));

        // Backlog Health: Deduct for open critical issues -> weight 15%
        double backlogScore = Math.max(0.0, 100.0 - (openCriticalIssues * 8.0) - (totalActiveIssues * 0.5));

        double overall = (slaScore * 0.35) + (speedScore * 0.25) + (satisfactionScore * 0.25) + (backlogScore * 0.15);
        return Math.round(overall * 10.0) / 10.0;
    }
}
