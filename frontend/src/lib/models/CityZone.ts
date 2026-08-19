import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICityZoneDoc extends Document {
  name: string;
  code: string;
  population: number;
  areaSqkm: number;
  healthScore: number;
  openIssuesCount: number;
  criticalPotholesCount: number;
  waterSupplyCoveragePct: number;
  sanitationFrequencyPerWeek: number;
  zonalOfficerName: string;
  zonalOfficeContact: string;
}

const CityZoneSchema = new Schema<ICityZoneDoc>(
  {
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    population: { type: Number, required: true },
    areaSqkm: { type: Number, required: true },
    healthScore: { type: Number, default: 85 },
    openIssuesCount: { type: Number, default: 0 },
    criticalPotholesCount: { type: Number, default: 4 },
    waterSupplyCoveragePct: { type: Number, default: 94 },
    sanitationFrequencyPerWeek: { type: Number, default: 6 },
    zonalOfficerName: { type: String, default: 'Zonal Commissioner' },
    zonalOfficeContact: { type: String, default: '+91-141-2740100' },
  },
  { timestamps: true }
);

export const CityZoneModel: Model<ICityZoneDoc> =
  mongoose.models.CityZone || mongoose.model<ICityZoneDoc>('CityZone', CityZoneSchema);
