import mongoose, { Document, Schema } from 'mongoose';

export interface IStaffAccount extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'admin' | 'editor' | 'viewer';
  status: 'active' | 'inactive';
  lastLogin?: Date;
  lastLogout?: Date;
  created_at: Date;
  updated_at: Date;
}

const staffAccountSchema = new Schema<IStaffAccount>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false }, // Don't include in queries by default
  role: { type: String, enum: ['admin', 'editor', 'viewer'], default: 'viewer' },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  lastLogin: { type: Date },
  lastLogout: { type: Date },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

staffAccountSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

export const StaffAccount = mongoose.model<IStaffAccount>('StaffAccount', staffAccountSchema);
