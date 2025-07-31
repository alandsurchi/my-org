import mongoose, { Document, Schema } from 'mongoose';

export interface IProject extends Document {
  title: string;
  description: string;
  image_url?: string;
  project_url?: string;
  technologies: string[];
  status: 'active' | 'completed' | 'archived';
  location?: string;
  category?: string;
  // Multilingual support
  title_ar?: string;
  title_ku?: string;
  description_ar?: string;
  description_ku?: string;
  created_at: Date;
  updated_at: Date;
}

const projectSchema = new Schema<IProject>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image_url: { type: String },
  project_url: { type: String },
  technologies: [{ type: String }],
  status: { type: String, enum: ['active', 'completed', 'archived'], default: 'active' },
  location: { type: String },
  category: { type: String },
  // Multilingual support
  title_ar: { type: String },
  title_ku: { type: String },
  description_ar: { type: String },
  description_ku: { type: String },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

projectSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

// Transform _id to id when converting to JSON
projectSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete (ret as any).__v;
    return ret;
  }
});

export const Project = mongoose.model<IProject>('Project', projectSchema);
