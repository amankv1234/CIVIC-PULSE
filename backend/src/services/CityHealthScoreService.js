import Complaint from '../models/Complaint.js';

class CityHealthScoreService {
  async calculateScore(zoneId = null) {
    // Basic logic for city health score (0-100)
    // 100 is perfect health, drops based on open and critical complaints
    const query = { status: { $nin: ['RESOLVED', 'CLOSED', 'REJECTED'] } };
    if (zoneId) query.zone = zoneId;

    const activeComplaints = await Complaint.find(query);
    
    let score = 100;
    for (const c of activeComplaints) {
      if (c.severity === 'CRITICAL') score -= 5;
      else if (c.severity === 'HIGH') score -= 2;
      else score -= 0.5;

      if (c.slaBreached) score -= 3;
    }

    return Math.max(0, Math.round(score * 10) / 10);
  }
}

export default new CityHealthScoreService();
