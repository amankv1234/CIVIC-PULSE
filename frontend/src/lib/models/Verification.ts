import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IVerificationDoc extends Document {
  userId: string;
  applicantName: string;
  applicantRole: string;
  govIdType: string;
  govIdNumberMasked: string;
  issuingAuthority: string;
  verificationHash: string;
  digiLockerTxnId: string;
  status: string;
  verifiedAt: Date;
  departmentOrMinistry: string;
  documents: {
    docType: string;
    uri: string;
    verifiedOnChain: boolean;
  }[];
}

const VerificationSchema = new Schema<IVerificationDoc>(
  {
    userId: { type: String, required: true, index: true },
    applicantName: { type: String, required: true },
    applicantRole: { type: String, required: true },
    govIdType: { type: String, required: true },
    govIdNumberMasked: { type: String, required: true },
    issuingAuthority: { type: String, required: true },
    verificationHash: { type: String, required: true, unique: true },
    digiLockerTxnId: { type: String, required: true, unique: true },
    status: { type: String, enum: ['VERIFIED', 'PENDING', 'REJECTED'], default: 'VERIFIED' },
    departmentOrMinistry: { type: String, required: true },
    verifiedAt: { type: Date, default: Date.now },
    documents: [
      {
        docType: { type: String, required: true },
        uri: { type: String, required: true },
        verifiedOnChain: { type: Boolean, default: true },
      },
    ],
  },
  { timestamps: true }
);

export const VerificationModel: Model<IVerificationDoc> =
  mongoose.models.Verification ||
  mongoose.model<IVerificationDoc>('Verification', VerificationSchema);
