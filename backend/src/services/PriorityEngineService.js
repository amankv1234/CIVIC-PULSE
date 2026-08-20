class PriorityEngineService {
  calculatePriority(category, affectedCount, isEmergency) {
    if (isEmergency) return 'CRITICAL';
    
    let baseScore = 0;
    if (category.defaultPriority === 'CRITICAL') baseScore = 4;
    else if (category.defaultPriority === 'HIGH') baseScore = 3;
    else if (category.defaultPriority === 'MEDIUM') baseScore = 2;
    else baseScore = 1;

    // Boost priority if many people are affected
    if (affectedCount > 50) baseScore += 2;
    else if (affectedCount > 10) baseScore += 1;

    if (baseScore >= 4) return 'CRITICAL';
    if (baseScore === 3) return 'HIGH';
    if (baseScore === 2) return 'MEDIUM';
    return 'LOW';
  }
}

export default new PriorityEngineService();
