import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IDepartmentDoc extends Document {
  name: string;
  code: string;
  description: string;
  headName: string;
  phone: string;
  email: string;
  colorHex: string;
  activeComplaintsCount: number;
  resolvedCount: number;
  slaComplianceRate: number;
  totalBudgetCr: number;
  workforceCount: number;
}

const DepartmentSchema = new Schema<IDepartmentDoc>(
  {
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    headName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    colorHex: { type: String, default: '#F97316' },
    activeComplaintsCount: { type: Number, default: 0 },
    resolvedCount: { type: Number, default: 0 },
    slaComplianceRate: { type: Number, default: 90 },
    totalBudgetCr: { type: Number, default: 45.0 },
    workforceCount: { type: Number, default: 120 },
  },
  { timestamps: true }
);

export const DepartmentModel: Model<IDepartmentDoc> =
  mongoose.models.Department || mongoose.model<IDepartmentDoc>('Department', DepartmentSchema);
