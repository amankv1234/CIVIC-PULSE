import mongoose from 'mongoose';

const cityZoneSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  // GeoJSON for boundary
  boundary: {
    type: { type: String, enum: ['Polygon'], required: false },
    coordinates: { type: [[[Number]]], required: false }
  },
  supervisorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

cityZoneSchema.index({ boundary: '2dsphere' });

const CityZone = mongoose.model('CityZone', cityZoneSchema);
export default CityZone;
