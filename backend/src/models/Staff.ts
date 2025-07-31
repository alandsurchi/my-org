import mongoose, { Document, Schema } from 'mongoose';

export interface IStaff extends Document {
  name: string;
  position: string;
  bio?: string;
  email?: string;
  phone?: string;
  image_url?: string;
  social_links?: Record<string, string>;
  order?: number;
  status: 'active' | 'inactive';
  created_at: Date;
  updated_at: Date;
}

const staffSchema = new Schema<IStaff>({
  name: { type: String, required: true },
  position: { type: String, required: true },
  bio: { type: String },
  email: { type: String },
  phone: { type: String },
  image_url: { type: String },
  social_links: { type: Schema.Types.Mixed, default: {} },
  order: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

staffSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

// Transform _id to id when converting to JSON
staffSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete (ret as any).__v;
    return ret;
  }
});

export const Staff = mongoose.model<IStaff>('Staff', staffSchema);
