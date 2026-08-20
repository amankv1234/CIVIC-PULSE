import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema({
  complaintNumber: { type: String, required: true, unique: true },
  citizen: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'ComplaintCategory', required: true },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
  zone: { type: mongoose.Schema.Types.ObjectId, ref: 'CityZone' },
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['REPORT_SUBMITTED', 'IN_REVIEW', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'REJECTED'], 
    default: 'REPORT_SUBMITTED' 
  },
  priority: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], default: 'MEDIUM' },
  severity: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], default: 'MEDIUM' },
  affectedCount: { type: Number, default: 1 },
  address: { type: String },
  landmark: { type: String },
  city: { type: String },
  pincode: { type: String },
  // GeoJSON for exact location
  location: {
    type: { type: String, enum: ['Point'], required: false },
    coordinates: { type: [Number], required: false } // [longitude, latitude]
  },
  slaDeadline: { type: Date },
  slaBreached: { type: Boolean, default: false },
  isEmergency: { type: Boolean, default: false },
  isAnonymous: { type: Boolean, default: false },
  resolvedAt: { type: Date },
  closedAt: { type: Date },
  deletedAt: { type: Date }
}, {
  timestamps: true
});

complaintSchema.index({ location: '2dsphere' });

const Complaint = mongoose.model('Complaint', complaintSchema);
export default Complaint;
