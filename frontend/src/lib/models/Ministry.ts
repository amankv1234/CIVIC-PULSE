import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMinistryDoc extends Document {
  name: string;
  code: string;
  jurisdiction: 'CENTRAL' | 'STATE';
  ministerInCharge: string;
  secretaryName: string;
  contactEmail: string;
  phone: string;
  monitoredDepartments: string[];
  totalAllocatedBudgetCr: number;
  complianceRating: number;
  activeDirectivesCount: number;
  description: string;
}

const MinistrySchema = new Schema<IMinistryDoc>(
  {
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    jurisdiction: { type: String, enum: ['CENTRAL', 'STATE'], default: 'STATE' },
    ministerInCharge: { type: String, required: true },
    secretaryName: { type: String, required: true },
    contactEmail: { type: String, required: true },
    phone: { type: String, required: true },
    monitoredDepartments: [{ type: String }],
    totalAllocatedBudgetCr: { type: Number, default: 250.0 },
    complianceRating: { type: Number, default: 94.5 },
    activeDirectivesCount: { type: Number, default: 4 },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

export const MinistryModel: Model<IMinistryDoc> =
  mongoose.models.Ministry || mongoose.model<IMinistryDoc>('Ministry', MinistrySchema);
