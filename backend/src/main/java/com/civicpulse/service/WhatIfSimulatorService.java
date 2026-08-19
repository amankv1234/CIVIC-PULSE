package com.civicpulse.service;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class WhatIfSimulatorService {

    /**
     * Computes the deterministic simulation outcome for policy modeling.
     *
     * @param workerIncreasePercent  Percent increase in field staff (0-100)
     * @param budgetReserveLakhs     Extra emergency budget in Lakhs INR (0-200)
     * @param monsoonSurgeActive     Whether extreme climate monsoon stress is modeled
     * @param baseHealthScore        Current baseline health index
     * @param baseSlaCompliance      Current baseline SLA compliance %
     * @param baseAvgHours           Current baseline average resolution time
     * @return Simulation projection results map
     */
    public Map<String, Object> runSimulation(
            double workerIncreasePercent,
            double budgetReserveLakhs,
            boolean monsoonSurgeActive,
            double baseHealthScore,
            double baseSlaCompliance,
            double baseAvgHours
    ) {
        double projectedSla = Math.min(
                99.2,
                Math.max(45.0, baseSlaCompliance + (workerIncreasePercent * 0.22) - (monsoonSurgeActive ? 18.5 : 0.0) + (budgetReserveLakhs * 0.08))
        );

        double projectedAvgHours = Math.max(
                6.5,
                baseAvgHours - (workerIncreasePercent * 0.15) + (monsoonSurgeActive ? 12.0 : 0.0) - (budgetReserveLakhs * 0.05)
        );

        double projectedHealth = Math.min(
                98.5,
                Math.max(40.0, baseHealthScore + (workerIncreasePercent * 0.18) - (monsoonSurgeActive ? 14.2 : 0.0) + (budgetReserveLakhs * 0.06))
        );

        Map<String, Object> results = new HashMap<>();
        results.put("projectedHealthScore", Math.round(projectedHealth * 10.0) / 10.0);
        results.put("healthScoreDelta", Math.round((projectedHealth - baseHealthScore) * 10.0) / 10.0);
        results.put("projectedSlaCompliance", Math.round(projectedSla * 10.0) / 10.0);
        results.put("slaComplianceDelta", Math.round((projectedSla - baseSlaCompliance) * 10.0) / 10.0);
        results.put("projectedAvgResolutionHours", Math.round(projectedAvgHours * 10.0) / 10.0);
        results.put("avgResolutionHoursDelta", Math.round((projectedAvgHours - baseAvgHours) * 10.0) / 10.0);
        results.put("backlogReductionPercent", Math.round(workerIncreasePercent * 0.45));

        return results;
    }
}
