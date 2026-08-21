import CityHealthScoreService from './CityHealthScoreService.js';
import Complaint from '../models/Complaint.js';

class WhatIfSimulatorService {
  async simulateResolutionImpact(complaintIds) {
    // Simulates what happens to the city health score if specific complaints are resolved
    const currentScore = await CityHealthScoreService.calculateScore();
    
    // Fetch the complaints to simulate
    const complaintsToResolve = await Complaint.find({ _id: { $in: complaintIds } });
    
    let recoveredScore = 0;
    for (const c of complaintsToResolve) {
      if (c.status === 'RESOLVED' || c.status === 'CLOSED') continue;
      
      if (c.severity === 'CRITICAL') recoveredScore += 5;
      else if (c.severity === 'HIGH') recoveredScore += 2;
      else recoveredScore += 0.5;

      if (c.slaBreached) recoveredScore += 3;
    }

    const projectedScore = Math.min(100, currentScore + recoveredScore);
    
    return {
      currentScore,
      projectedScore,
      improvement: projectedScore - currentScore
    };
  }
}

export default new WhatIfSimulatorService();
