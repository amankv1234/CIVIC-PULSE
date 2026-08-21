import mongoose from 'mongoose';

const complaintStatusHistorySchema = new mongoose.Schema({
  complaint: { type: mongoose.Schema.Types.ObjectId, ref: 'Complaint', required: true },
  changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  previousStatus: { type: String },
  newStatus: { type: String, required: true },
  comments: { type: String }
}, {
  timestamps: true
});

const ComplaintStatusHistory = mongoose.model('ComplaintStatusHistory', complaintStatusHistorySchema);
export default ComplaintStatusHistory;
