import mongoose from 'mongoose';

const complaintCategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  defaultPriority: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], default: 'MEDIUM' },
  defaultSeverity: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], default: 'MEDIUM' },
  slaHours: { type: Number, default: 48 },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

const ComplaintCategory = mongoose.model('ComplaintCategory', complaintCategorySchema);
export default ComplaintCategory;
